import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { services } from "@/data/services";
import type { Locale } from "@/data/types";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Animate } from "@/components/Animate";
import { Pic } from "@/components/Pic";
import { Swatch } from "@/components/Swatch";
import { FinalCta } from "@/components/FinalCta";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMeta({ locale, path: "/services", title: t("servicesTitle"), description: t("servicesDescription") });
}

export default async function ServicesIndex({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  return (
    <>
      <PageHero
        locale={locale}
        title={t("servicesIndex.h1")}
        lead={t("servicesIndex.lead")}
        crumbs={[
          { name: t("common.home"), path: "/" },
          { name: t("nav.services"), path: "/services" },
        ]}
      />
      <section className="sec on-ink">
        <Animate className="wrap">
          <h2 className="sr">{t("services.title")}</h2>
          <div className="sgrid">
            {services.map((s) => (
              <article className="scard" key={s.slug}>
                <Link href={`/services/${s.slug}`} className="scard__link">
                  <div className="scard__face chamfer" data-kind={s.photos.length ? "photo" : "swatch"} data-wipe>
                    {s.photos.length ? (
                      <Pic k={s.photos[0]} locale={locale} sizes="(max-width: 639px) 92vw, (max-width: 1099px) 44vw, 300px" />
                    ) : (
                      <Swatch name={s.pattern} />
                    )}
                  </div>
                  <div className="scard__body">
                    <Swatch name={s.pattern} className="scard__mark" />
                    <h3 className="h3">{s.name[locale]}</h3>
                    <p>{s.short[locale]}</p>
                    <span className="link" aria-hidden="true">
                      {t("services.details")}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </Animate>
      </section>
      <FinalCta locale={locale} />
    </>
  );
}
