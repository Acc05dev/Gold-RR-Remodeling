import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { business, tel, sms, defaultSms } from "@/data/business";
import { services } from "@/data/services";
import { areas } from "@/data/areas";
import { reviews } from "@/data/reviews";
import { faqs } from "@/data/faqs";
import { photo, photos, projects, reels, beforeAfter, buildSequence, homeGallery } from "@/data/media";
import type { Locale } from "@/data/types";
import { pageMeta, websiteLd, faqLd } from "@/lib/seo";
import { galleryLabels } from "@/lib/labels";
import { JsonLd } from "@/components/JsonLd";
import { Animate } from "@/components/Animate";
import { Pic } from "@/components/Pic";
import { Swatch } from "@/components/Swatch";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Reels } from "@/components/Reels";
import { Gallery } from "@/components/Gallery";
import { AreasMap } from "@/components/AreasMap";
import { Faq } from "@/components/Faq";
import { Reviews } from "@/components/Reviews";
import { FinalCta } from "@/components/FinalCta";
import { PhoneIcon, RoofMark, StarIcon, TextIcon } from "@/components/Icons";
import { Hero } from "@/components/home/Hero";
import { QuickEstimate } from "@/components/QuickEstimate";
import { Marquee } from "@/components/home/Marquee";
import { ServicesRail } from "@/components/home/ServicesRail";
import { BuildSequence } from "@/components/home/BuildSequence";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMeta({
    locale,
    path: "/",
    title: t("homeTitle"),
    description: t("homeDescription"),
    kicker: `${business.address.locality}, ${business.address.region}`,
  });
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const steps = t.raw("process.steps") as { name: string; text: string }[];
  const points = t.raw("about.points") as string[];

  return (
    <>
      <JsonLd data={[websiteLd(), faqLd(faqs[locale])]} />
      <Hero locale={locale} />
      {/* Phones and tablets: the estimate card comes right after the first screen */}
      <div className="hero-card-below on-ink">
        <QuickEstimate source="hero-card-mobile" options={services.map((s) => ({ value: s.slug, label: s.name[locale] }))} />
      </div>
      <Marquee items={services.map((s) => s.name[locale])} />

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <section className="sec on-bone" id="about">
        <Animate className="wrap about">
          <div className="about__text">
            <h2 className="display h2" data-split>
              {t("about.title")}
            </h2>
            <span className="bar" />
            <p className="about__statement" data-scrub-words>
              {t("about.statement")}
            </p>
            <ul className="ticks" data-stagger>
              {points.map((p) => (
                <li key={p}>
                  <RoofMark />
                  {p}
                </li>
              ))}
            </ul>
            <Link href="/about" className="link">
              {t("about.link")}
            </Link>
          </div>
          <figure className="about__fig" data-drift="-6">
            <div className="chamfer" data-wipe>
              <Pic k="crew-saw" locale={locale} sizes="(max-width: 899px) 92vw, 440px" />
            </div>
            <figcaption>{t("about.caption")}</figcaption>
          </figure>
        </Animate>
      </section>

      {/* ── Services: pinned horizontal rail ──────────────────────────────── */}
      <section className="sec sec--rail on-ink" id="services">
        <ServicesRail
          hint={t("services.drag")}
          intro={
            <>
              <h2 className="display h2">{t("services.title")}</h2>
              <span className="bar" />
              <p className="lead">{t("services.lead")}</p>
              <Link href="/services" className="link">
                {t("services.allServices")}
              </Link>
            </>
          }
        >
          <div className="rail__track">
            {services.map((s) => (
              <article className="scard" key={s.slug}>
                <Link href={`/services/${s.slug}`} className="scard__link">
                  <div className="scard__face chamfer" data-kind={s.photos.length ? "photo" : "swatch"}>
                    {s.photos.length ? (
                      <Pic k={s.photos[0]} locale={locale} sizes="(max-width: 899px) 78vw, 470px" />
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
        </ServicesRail>
      </section>

      {/* ── Before / after ────────────────────────────────────────────────── */}
      <section className="sec on-bone" id="before-after">
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
            labels={{
              before: t("common.before"),
              after: t("common.after"),
              handle: t("beforeAfter.handle"),
              choose: t("beforeAfter.choose"),
            }}
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

      {/* ── What goes in before the tile ──────────────────────────────────── */}
      <section className="sec on-ink" id="build">
        <Animate className="wrap">
          <div className="sec-head sec-head--split">
            <div>
              <h2 className="display h2" data-split>
                {t("build.title")}
              </h2>
              <span className="bar" />
            </div>
            <p className="lead">{t("build.lead")}</p>
          </div>
          <BuildSequence
            label={t("build.stageLabel")}
            of={t("common.of")}
            stages={buildSequence.map((s) => {
              const p = photo(s.photo);
              return {
                id: s.id,
                name: t(`build.stages.${s.id}.name`),
                text: t(`build.stages.${s.id}.text`),
                photo: { src: p.src, alt: p.alt[locale], blur: p.blur, width: p.width, height: p.height },
              };
            })}
          />
        </Animate>
      </section>

      {/* ── Process ───────────────────────────────────────────────────────── */}
      <section className="sec on-bone" id="process">
        <Animate className="wrap">
          <div className="sec-head">
            <h2 className="display h2" data-split>
              {t("process.title")}
            </h2>
            <span className="bar" />
            <p className="lead">{t("process.lead")}</p>
          </div>
          <div className="process" data-draw-area>
            {/* The roof line again: one continuous gold stroke that steps up 45° between stages */}
            <svg className="process__line" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
              <path data-draw d="M0 110H270L300 80H570L600 50H870L900 20H1200" />
            </svg>
            <ol className="process__steps">
              {steps.map((s, i) => (
                <li key={s.name}>
                  <span className="tall process__n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="h3">{s.name}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </Animate>
      </section>

      {/* ── Facts plate ───────────────────────────────────────────────────── */}
      <section className="sec sec--tight on-ink" id="facts">
        <Animate className="wrap">
          <h2 className="sr">{t("stats.title")}</h2>
          <dl className="plate">
            <div>
              {/* Final values are in the server HTML. The count-up only runs in the browser. */}
              <dd className="tall">
                <span data-count={business.yearsExperience} data-suffix="+">
                  {business.yearsExperience}+
                </span>
              </dd>
              <dt>{t("stats.years")}</dt>
            </div>
            <div>
              <dd className="tall">
                <span data-count={business.google.rating.toFixed(1)}>{business.google.rating.toFixed(1)}</span>
                <StarIcon />
              </dd>
              <dt>{t("stats.rating")}</dt>
            </div>
            <div>
              <dd className="tall">#{business.license}</dd>
              <dt>
                {t("stats.license")}
                <a href={business.licenseLookup} target="_blank" rel="noopener">
                  {t("stats.verify")}
                </a>
              </dt>
            </div>
            <div>
              <dd className="tall">{t("stats.free")}</dd>
              <dt>{t("stats.estimate")}</dt>
            </div>
          </dl>
        </Animate>
      </section>

      {/* ── Gallery + reels ───────────────────────────────────────────────── */}
      <section className="sec on-ink" id="work" style={{ paddingTop: 0 }}>
        <Animate className="wrap">
          <div className="sec-head sec-head--split">
            <div>
              <h2 className="display h2" data-split>
                {t("gallery.title")}
              </h2>
              <span className="bar" />
            </div>
            <p className="lead">{t("gallery.lead")}</p>
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
          <Gallery
            items={homeGallery.map((k) => {
              const p = photo(k);
              return { key: p.key, src: p.src, width: p.width, height: p.height, alt: p.alt[locale], blur: p.blur, category: p.category, stage: p.stage, project: p.project };
            })}
            labels={galleryLabels(t)}
          />
          <p className="center-cta">
            <Link href="/gallery" className="btn btn--line" data-magnetic>
              {t("gallery.viewAll")} ({photos.length})
            </Link>
          </p>
        </Animate>
      </section>

      {/* ── Reviews ───────────────────────────────────────────────────────── */}
      <section className="sec on-bone" id="reviews">
        <Animate className="wrap">
          <Reviews locale={locale} reviews={reviews} />
        </Animate>
      </section>

      {/* ── Service areas ─────────────────────────────────────────────────── */}
      <section className="sec on-ink" id="areas">
        <Animate className="wrap areas">
          <div>
            <h2 className="display h2" data-split>
              {t("areas.title")}
            </h2>
            <span className="bar" />
            <p className="lead" style={{ marginTop: 22 }}>
              {t("areas.lead")}
            </p>
            <ul className="citylist" data-stagger>
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link href={`/service-areas/${a.slug}`}>
                    <span>{a.city}</span>
                    <span className="tall">{a.milesFromVallejo === 0 ? t("areas.base") : t("areas.miles", { miles: a.milesFromVallejo })}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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
        </Animate>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="sec on-bone" id="faq">
        <Animate className="wrap faqwrap">
          <div>
            <h2 className="display h2" data-split>
              {t("faq.title")}
            </h2>
            <span className="bar" />
            <div className="faqwrap__cta">
              <a href={tel} className="btn btn--ink" data-track="click_call" data-track-at="faq">
                <PhoneIcon />
                {business.phone.display}
              </a>
              <a href={sms(defaultSms[locale])} className="link" data-track="click_text" data-track-at="faq">
                <TextIcon width={18} height={18} />
                {t("common.textUs")}
              </a>
            </div>
          </div>
          <Faq items={faqs[locale]} />
        </Animate>
      </section>

      <FinalCta locale={locale} />
    </>
  );
}
