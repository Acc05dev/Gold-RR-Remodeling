import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { business } from "@/data/business";
import { photo } from "@/data/media";
import type { Locale } from "@/data/types";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Animate } from "@/components/Animate";
import { Pic } from "@/components/Pic";
import { FinalCta } from "@/components/FinalCta";
import { RoofMark } from "@/components/Icons";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMeta({ locale, path: "/about", title: t("aboutTitle"), description: t("aboutDescription") });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const story = t.raw("aboutPage.story") as string[];
  const values = t.raw("aboutPage.values") as { name: string; text: string }[];
  const creds = ["license", "google", "years", "languages", "owned", "friendly"] as const;

  return (
    <>
      <PageHero
        locale={locale}
        title={t("aboutPage.h1")}
        lead={t("aboutPage.lead")}
        crumbs={[
          { name: t("common.home"), path: "/" },
          { name: t("nav.about"), path: "/about" },
        ]}
      />
      <section className="sec on-bone">
        <Animate className="wrap split">
          <div className="prose">
            <h2 className="display h2--sm" data-split>
              {t("aboutPage.storyTitle")}
            </h2>
            <span className="bar" style={{ marginTop: 6, marginBottom: 10 }} />
            {story.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="faith">{t("aboutPage.faith")}</p>
          </div>
          <figure className="split__fig">
            <div className="chamfer" data-wipe>
              <Pic k="crew-saw" locale={locale} sizes="(max-width: 899px) 92vw, 460px" priority />
            </div>
            <figcaption>{photo("crew-saw").alt[locale]}</figcaption>
          </figure>
        </Animate>
      </section>

      <section className="sec on-ink">
        <Animate className="wrap">
          <div className="sec-head">
            <h2 className="display h2" data-split>
              {t("aboutPage.valuesTitle")}
            </h2>
            <span className="bar" />
          </div>
          <ul className="values" data-stagger>
            {values.map((v) => (
              <li key={v.name}>
                <h3 className="h3">{v.name}</h3>
                <p>{v.text}</p>
              </li>
            ))}
          </ul>
        </Animate>
      </section>

      <section className="sec on-ink" style={{ paddingTop: 0 }}>
        <Animate className="wrap split">
          <div>
            <h2 className="display h2--sm" data-split>
              {t("aboutPage.credentialsTitle")}
            </h2>
            <span className="bar" style={{ marginBottom: 30 }} />
            <ul className="creds" data-stagger>
              {creds.map((c) => (
                <li key={c}>
                  <RoofMark />
                  {c === "license" ? (
                    <a href={business.licenseLookup} target="_blank" rel="noopener" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                      {t(`aboutPage.credentials.${c}`)}
                    </a>
                  ) : c === "google" ? (
                    <a href={business.google.profile} target="_blank" rel="noopener" data-track="click_review" data-track-at="about" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                      {t(`aboutPage.credentials.${c}`)}
                    </a>
                  ) : (
                    t(`aboutPage.credentials.${c}`)
                  )}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 32, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/services" className="btn btn--line">
                {t("services.allServices")}
              </Link>
              <Link href="/gallery" className="btn btn--line">
                {t("gallery.viewAll")}
              </Link>
            </p>
          </div>
          <figure className="split__fig">
            <div className="chamfer" data-wipe>
              <Pic k="walkin-after-room" locale={locale} sizes="(max-width: 899px) 92vw, 460px" />
            </div>
            <figcaption>{photo("walkin-after-room").alt[locale]}</figcaption>
          </figure>
        </Animate>
      </section>
      <FinalCta locale={locale} />
    </>
  );
}
