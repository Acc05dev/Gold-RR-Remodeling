import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { business, tel } from "@/data/business";
import { areaBySlug, areas } from "@/data/areas";
import { serviceBySlug } from "@/data/services";
import type { Locale } from "@/data/types";
import { pageMeta, faqLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Animate } from "@/components/Animate";
import { AreasMap } from "@/components/AreasMap";
import { Swatch } from "@/components/Swatch";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { PhoneIcon } from "@/components/Icons";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => areas.map((a) => ({ locale, slug: a.slug })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const a = areaBySlug(slug);
  if (!a) return {};
  return pageMeta({
    locale,
    path: `/service-areas/${a.slug}`,
    title: a.metaTitle[locale],
    description: a.metaDescription[locale],
    ogTitle: `${a.city}, CA`,
    kicker: locale === "es" ? "Zona de servicio" : "Service area",
  });
}

export default async function AreaPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const a = areaBySlug(slug);
  if (!a) notFound();
  const t = await getTranslations({ locale });
  const path = `/service-areas/${a.slug}`;
  const [lead, ...intro] = a.intro[locale];
  const homes = a.homes[locale];
  // the four closest other cities, by straight-line distance between them
  const nearby = areas
    .filter((o) => o.slug !== a.slug)
    .map((o) => ({ o, d: Math.hypot((o.lat - a.lat) * 69, (o.lng - a.lng) * 54.3) }))
    .sort((x, y) => x.d - y.d)
    .slice(0, 4)
    .map((x) => x.o);

  return (
    <>
      <JsonLd data={faqLd(a.faqs[locale])} />
      <PageHero
        locale={locale}
        title={a.h1[locale]}
        lead={lead}
        meta={[t("areaPage.county", { county: a.county.replace(/ County$/, "") }), a.drive[locale]]}
        crumbs={[
          { name: t("common.home"), path: "/" },
          { name: t("nav.areas"), path: "/service-areas" },
          { name: `${a.city}, CA`, path },
        ]}
      >
        <Link href="/contact" className="btn btn--gold" data-magnetic>
          {t("common.getEstimate")}
        </Link>
        <a href={tel} className="btn btn--line" data-track="click_call" data-track-at={`area-${a.slug}`}>
          <PhoneIcon />
          {business.phone.display}
        </a>
      </PageHero>

      <section className="sec on-bone">
        <Animate className="wrap split">
          <div className="prose">
            {intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <h2 className="display h2--sm" data-split style={{ marginTop: "1.2em" }}>
              {homes.title}
            </h2>
            <span className="bar" style={{ marginTop: 6, marginBottom: 10 }} />
            {homes.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {a.neighborhoods.length > 0 && (
              <>
                <h3 className="h3" style={{ marginTop: "1.4em" }}>
                  {t("areaPage.neighborhoods")}
                </h3>
                <ul className="chips">
                  {a.neighborhoods.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="on-ink" style={{ background: "none" }}>
            <AreasMap
              active={a.slug}
              embed={`https://www.google.com/maps?q=${encodeURIComponent(`${a.city}, CA`)}&z=11&output=embed`}
              labels={{ title: t("areas.mapTitle"), load: t("areas.loadMap"), note: t("areas.mapNote"), base: t("areas.base") }}
              points={areas.map((o) => ({
                slug: o.slug,
                city: o.city,
                lat: o.lat,
                lng: o.lng,
                miles: o.milesFromVallejo,
                href: `${locale === "es" ? "/es" : ""}/service-areas/${o.slug}`,
              }))}
            />
          </div>
        </Animate>
      </section>

      <section className="sec on-ink">
        <Animate className="wrap">
          <div className="sec-head">
            <h2 className="display h2" data-split>
              {t("areaPage.popular", { city: a.city })}
            </h2>
            <span className="bar" />
          </div>
          <div className="pcards" data-stagger>
            {a.popular.map((p) => {
              const s = serviceBySlug(p.slug);
              if (!s) return null;
              return (
                <Link key={p.slug} href={`/services/${s.slug}`} className="pcard chamfer">
                  <Swatch name={s.pattern} />
                  <h3 className="h3">{s.name[locale]}</h3>
                  <p>{p.why[locale]}</p>
                </Link>
              );
            })}
          </div>
        </Animate>
      </section>

      <section className="sec on-bone">
        <Animate className="wrap faqwrap">
          <div>
            <h2 className="display h2--sm" data-split>
              {t("areaPage.faq", { city: a.city })}
            </h2>
            <span className="bar" />
          </div>
          <Faq items={a.faqs[locale]} name={`faq-${a.slug}`} />
        </Animate>
      </section>

      <section className="sec sec--tight on-ink">
        <div className="wrap">
          <h2 className="display h2--sm">{t("areaPage.nearby")}</h2>
          <nav className="linkrow" aria-label={t("areaPage.nearby")}>
            {nearby.map((o) => (
              <Link key={o.slug} href={`/service-areas/${o.slug}`}>
                {o.city}, CA
              </Link>
            ))}
            <Link href="/service-areas">{t("areas.allAreas")}</Link>
          </nav>
        </div>
      </section>

      <FinalCta locale={locale} />
    </>
  );
}
