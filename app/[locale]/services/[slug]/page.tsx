import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { business, sms } from "@/data/business";
import { serviceBySlug, services } from "@/data/services";
import { areas } from "@/data/areas";
import { photo } from "@/data/media";
import type { Locale } from "@/data/types";
import { pageMeta, serviceLd, faqLd } from "@/lib/seo";
import { galleryLabels } from "@/lib/labels";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Animate } from "@/components/Animate";
import { Pic } from "@/components/Pic";
import { Swatch } from "@/components/Swatch";
import { Gallery } from "@/components/Gallery";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { RoofMark, TextIcon } from "@/components/Icons";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  return pageMeta({
    locale,
    path: `/services/${s.slug}`,
    title: s.metaTitle[locale],
    description: s.metaDescription[locale],
    ogTitle: s.name[locale],
    kicker: `${business.address.locality}, ${business.address.region}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const s = serviceBySlug(slug);
  if (!s) notFound();
  const t = await getTranslations({ locale });
  const name = s.name[locale];
  const path = `/services/${s.slug}`;
  const [lead, ...intro] = s.intro[locale];
  const approach = s.approach[locale];
  const finishes = s.finishes[locale];
  const hasPhotos = s.photos.length > 0;

  return (
    <>
      <JsonLd data={[serviceLd({ name, description: s.metaDescription[locale], path, locale }), faqLd(s.faqs[locale])]} />
      <PageHero
        locale={locale}
        title={s.h1[locale]}
        lead={lead}
        meta={[t("common.licensed") + " #" + business.license, t("common.freeEstimate"), t("common.seHabla")]}
        crumbs={[
          { name: t("common.home"), path: "/" },
          { name: t("nav.services"), path: "/services" },
          { name, path },
        ]}
      >
        <Link href={`/contact?service=${s.slug}`} className="btn btn--gold" data-magnetic>
          {t("common.getEstimate")}
        </Link>
        <a href={sms(s.smsBody[locale])} className="btn btn--line" data-track="click_text" data-track-at={`service-${s.slug}`}>
          <TextIcon />
          {t("servicePage.textAbout")}
        </a>
      </PageHero>

      {/* Intro + approach */}
      <section className="sec on-bone">
        <Animate className="wrap split split--sticky">
          <div className="prose">
            {intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <h2 className="display h2--sm" data-split style={{ marginTop: "1.2em" }}>
              {approach.title}
            </h2>
            <span className="bar" style={{ marginTop: 6, marginBottom: 10 }} />
            {approach.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {hasPhotos ? (
            <figure className="split__fig">
              <div className="chamfer" data-wipe>
                <Pic k={s.photos[0]} locale={locale} sizes="(max-width: 899px) 92vw, 460px" priority />
              </div>
              <figcaption>{photo(s.photos[0]).alt[locale]}</figcaption>
            </figure>
          ) : (
            <div className="split__swatch chamfer" data-wipe>
              <Swatch name={s.pattern} />
            </div>
          )}
        </Animate>
      </section>

      {/* Included */}
      <section className="sec on-ink">
        <Animate className="wrap">
          <div className="sec-head">
            <h2 className="display h2" data-split>
              {t("servicePage.included")}
            </h2>
            <span className="bar" />
          </div>
          <ul className="inc" data-stagger>
            {s.includes[locale].map((it) => (
              <li key={it.title}>
                <h3>
                  <RoofMark />
                  {it.title}
                </h3>
                <p>{it.text}</p>
              </li>
            ))}
          </ul>
        </Animate>
      </section>

      {/* Materials and finishes + timing */}
      <section className="sec on-bone">
        <Animate className="wrap split split--flip">
          <div className="prose">
            <h2 className="display h2--sm" data-split>
              {finishes.title}
            </h2>
            <span className="bar" style={{ marginTop: 6, marginBottom: 10 }} />
            {finishes.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <ul className="chips">
              {finishes.options.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            <div className="callout chamfer">
              <h3>{t("servicePage.timeline")}</h3>
              <p>{s.timeline[locale]}</p>
            </div>
          </div>
          {s.photos[1] ? (
            <figure className="split__fig">
              <div className="chamfer" data-wipe>
                <Pic k={s.photos[1]} locale={locale} sizes="(max-width: 899px) 92vw, 460px" />
              </div>
              <figcaption>{photo(s.photos[1]).alt[locale]}</figcaption>
            </figure>
          ) : (
            <div className="split__swatch chamfer" data-wipe>
              <Swatch name={s.pattern} />
            </div>
          )}
        </Animate>
      </section>

      {/* Work */}
      <section className="sec on-ink">
        <Animate className="wrap">
          <div className="sec-head">
            <h2 className="display h2" data-split>
              {t("servicePage.work", { service: name })}
            </h2>
            <span className="bar" />
          </div>
          {hasPhotos ? (
            <>
              <Gallery
                labels={galleryLabels(t)}
                items={s.photos.map((k) => {
                  const p = photo(k);
                  return { key: p.key, src: p.src, width: p.width, height: p.height, alt: p.alt[locale], blur: p.blur, category: p.category, stage: p.stage, project: p.project };
                })}
              />
              <p className="center-cta">
                <Link href="/gallery" className="btn btn--line">
                  {t("gallery.viewAll")}
                </Link>
              </p>
            </>
          ) : (
            <div className="callout chamfer">
              <h3>{t("servicePage.noPhotosTitle")}</h3>
              <p>{t("servicePage.noPhotosBody")}</p>
              <p style={{ marginTop: 10 }}>
                <a href={sms(s.smsBody[locale])} className="link" data-track="click_text" data-track-at={`service-${s.slug}-examples`}>
                  {t("common.textUs")}
                </a>
              </p>
            </div>
          )}
        </Animate>
      </section>

      {/* FAQ */}
      <section className="sec on-bone">
        <Animate className="wrap faqwrap">
          <div>
            <h2 className="display h2--sm" data-split>
              {t("servicePage.faq", { service: name })}
            </h2>
            <span className="bar" />
          </div>
          <Faq items={s.faqs[locale]} name={`faq-${s.slug}`} />
        </Animate>
      </section>

      {/* Internal links: cities and sibling services */}
      <section className="sec on-ink">
        <Animate className="wrap stack">
          <div>
            <h2 className="display h2--sm">{t("servicePage.areas")}</h2>
            <p className="lead" style={{ marginTop: 14 }}>
              {t("servicePage.areasBody", { service: name })}
            </p>
            <nav className="linkrow" aria-label={t("servicePage.areas")}>
              {areas.map((a) => (
                <Link key={a.slug} href={`/service-areas/${a.slug}`}>
                  {a.city}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h2 className="display h2--sm">{t("servicePage.other")}</h2>
            <nav className="linkrow" aria-label={t("servicePage.other")}>
              {services
                .filter((o) => o.slug !== s.slug)
                .map((o) => (
                  <Link key={o.slug} href={`/services/${o.slug}`}>
                    {o.name[locale]}
                  </Link>
                ))}
            </nav>
          </div>
        </Animate>
      </section>

      <FinalCta locale={locale} smsBody={s.smsBody[locale]} />
    </>
  );
}
