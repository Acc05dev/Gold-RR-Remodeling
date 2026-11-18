import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { photo, photos, projects, reels, beforeAfter } from "@/data/media";
import type { Locale } from "@/data/types";
import { pageMeta } from "@/lib/seo";
import { galleryLabels } from "@/lib/labels";
import { PageHero } from "@/components/PageHero";
import { Animate } from "@/components/Animate";
import { Gallery } from "@/components/Gallery";
import { Reels } from "@/components/Reels";
import { BeforeAfter } from "@/components/BeforeAfter";
import { FinalCta } from "@/components/FinalCta";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMeta({ locale, path: "/gallery", title: t("galleryTitle"), description: t("galleryDescription") });
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  // finished work first, then work in progress, then the "before" shots
  const order = { after: 0, progress: 1, before: 2 } as const;
  const items = [...photos]
    .sort((a, b) => order[a.stage] - order[b.stage])
    .map((p) => ({ key: p.key, src: p.src, width: p.width, height: p.height, alt: p.alt[locale], blur: p.blur, category: p.category, stage: p.stage, project: p.project }));

  return (
    <>
      <PageHero
        locale={locale}
        title={t("galleryPage.h1")}
        lead={t("galleryPage.lead")}
        crumbs={[
          { name: t("common.home"), path: "/" },
          { name: t("nav.gallery"), path: "/gallery" },
        ]}
      />
      <section className="sec on-ink">
        <div className="wrap">
          <h2 className="sr">{t("gallery.title")}</h2>
          <Gallery items={items} labels={galleryLabels(t)} filters />
        </div>
      </section>

      <section className="sec on-bone">
        <Animate className="wrap">
          <div className="sec-head sec-head--split">
            <div>
              <h2 className="display h2" data-split>
                {t("beforeAfter.title")}
              </h2>
              <span className="bar" />
            </div>
            <p className="lead">{t("beforeAfter.lead")}</p>
          </div>
          <BeforeAfter
            labels={{ before: t("common.before"), after: t("common.after"), handle: t("beforeAfter.handle"), choose: t("beforeAfter.choose") }}
            pairs={beforeAfter.map((p) => {
              const b = photo(p.before);
              const a = photo(p.after);
              return {
                key: p.key,
                title: projects[p.key][locale],
                before: { src: b.src, alt: b.alt[locale], blur: b.blur, width: b.width, height: b.height },
                after: { src: a.src, alt: a.alt[locale], blur: a.blur, width: a.width, height: a.height },
              };
            })}
          />
        </Animate>
      </section>

      <section className="sec on-ink">
        <Animate className="wrap">
          <div className="sec-head">
            <h2 className="display h2" data-split>
              {t("gallery.reelsTitle")}
            </h2>
            <span className="bar" />
          </div>
          <Reels
            reels={reels}
            locale={locale}
            labels={{
              play: t("common.play"),
              pause: t("common.pause"),
              previous: t("common.previous"),
              next: t("common.next"),
              playVideo: t.raw("gallery.playVideo") as string,
            }}
          />
        </Animate>
      </section>
      <FinalCta locale={locale} />
    </>
  );
}
