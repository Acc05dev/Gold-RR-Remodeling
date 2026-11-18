import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { business } from "@/data/business";
import { areas } from "@/data/areas";
import type { Locale } from "@/data/types";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Animate } from "@/components/Animate";
import { AreasMap } from "@/components/AreasMap";
import { FinalCta } from "@/components/FinalCta";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMeta({ locale, path: "/service-areas", title: t("areasTitle"), description: t("areasDescription") });
}

export default async function AreasIndex({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const counties = [...new Set(areas.map((a) => a.county))];
  return (
    <>
      <PageHero
        locale={locale}
        title={t("areasIndex.h1")}
        lead={t("areasIndex.lead")}
        crumbs={[
          { name: t("common.home"), path: "/" },
          { name: t("nav.areas"), path: "/service-areas" },
        ]}
      />
      <section className="sec on-ink">
        <Animate className="wrap areas">
          <div>
            <h2 className="sr">{t("areas.title")}</h2>
            {counties.map((c) => (
              <div className="county" key={c}>
                <h3>{t("areaPage.county", { county: c.replace(/ County$/, "") })}</h3>
                {areas
                  .filter((a) => a.county === c)
                  .map((a) => (
                    <Link key={a.slug} href={`/service-areas/${a.slug}`} className="acard">
                      <strong>
                        {a.city}, CA
                        <span>{a.milesFromVallejo === 0 ? t("areas.base") : t("areas.miles", { miles: a.milesFromVallejo })}</span>
                      </strong>
                      <p>{a.drive[locale]}</p>
                    </Link>
                  ))}
              </div>
            ))}
          </div>
          <div style={{ position: "sticky", top: "calc(var(--header-h) + 28px)" }}>
            <AreasMap
              embed={business.google.embed}
              labels={{ title: t("areas.mapTitle"), load: t("areas.loadMap"), note: t("areas.mapNote"), base: t("areas.base") }}
              points={areas.map((a) => ({
                slug: a.slug,
                city: a.city,
                lat: a.lat,
                lng: a.lng,
                miles: a.milesFromVallejo,
                href: `${locale === "es" ? "/es" : ""}/service-areas/${a.slug}`,
              }))}
            />
          </div>
        </Animate>
      </section>
      <FinalCta locale={locale} />
    </>
  );
}
