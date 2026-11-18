import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { tel } from "@/data/business";
import { heroPanels, reels } from "@/data/media";
import { services } from "@/data/services";
import type { Locale } from "@/data/types";
import { PhoneIcon, StarIcon } from "../Icons";
import { QuickEstimate } from "../QuickEstimate";
import { HeroMotion } from "./HeroMotion";

/**
 * Full-bleed moving hero. All the footage is vertical, so instead of stretching one clip across a
 * desktop screen, three play side by side. Phones show only the first panel.
 * Two panels are before→after transformations generated with Google Flow from the client's real
 * before and after photos; each loop opens and ends on the real finished room.
 * The poster of the first panel is the LCP element; videos are attached after load by HeroMotion.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const lines = t.raw("hero.h1Lines") as string[];
  const chips = [
    t("hero.chips.years"),
    t("hero.chips.licensed"),
    t("hero.chips.rating"),
    t("hero.chips.latino"),
    t("hero.chips.spanish"),
  ];
  // Which clips play is decided in scripts/media-map.mjs (HERO_PANELS). The first panel is the
  // only one phones load, so it also carries a lighter file.
  const panels = heroPanels.map((p) => {
    if ("reel" in p) {
      const r = reels.find((x) => x.key === p.reel)!;
      return { poster: r.poster, wide: { webm: r.webm, mp4: r.mp4 }, narrow: undefined };
    }
    return { poster: p.poster, wide: p.wide, narrow: p.narrow };
  });

  return (
    <section className="hero on-ink">
      <HeroMotion labels={{ pause: t("hero.pause"), play: t("hero.play") }}>
        <div className="hero__bg" aria-hidden="true">
          {panels.map((p, i) => (
            <div className="hero__panel" key={i} data-hero-panel>
              <Image
                {...(i === 0 ? { "data-hero-poster": true, priority: true, fetchPriority: "high" as const } : { loading: "lazy" as const })}
                src={p.poster.src}
                alt=""
                fill
                quality={75}
                sizes="(max-width: 899px) 100vw, 34vw"
                placeholder="blur"
                blurDataURL={p.poster.blur}
              />
              <video
                data-hero-video
                data-wide-webm={p.wide.webm}
                data-wide-mp4={p.wide.mp4}
                data-narrow-webm={p.narrow?.webm}
                data-narrow-mp4={p.narrow?.mp4}
                muted
                loop
                playsInline
                preload="none"
                tabIndex={-1}
              />
            </div>
          ))}
        </div>
        <div className="hero__shade" aria-hidden="true" />

        <div className="hero__stage">
          <div className="hero__copy">
            <h1 className="display h1" data-hero-title>
              {lines.map((l, i) => (
                <span className="hero__line" key={i}>
                  <span>{l}</span>
                  {i < lines.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>
            <p className="hero__tag" data-hero-fade>
              {t("hero.tagline")}
            </p>
            <p className="lead" data-hero-fade>
              {t("hero.body")}
            </p>
            <div className="hero__cta" data-hero-fade>
              <Link href="/contact" className="btn btn--gold" data-magnetic>
                {t("common.getEstimate")}
              </Link>
              <a href={tel} className="btn btn--line" data-track="click_call" data-track-at="hero" data-magnetic>
                <PhoneIcon />
                {t("common.callNumber")}
              </a>
            </div>
          </div>
          <div className="hero__card" data-hero-card>
            <QuickEstimate options={services.map((s) => ({ value: s.slug, label: s.name[locale] }))} />
          </div>
        </div>

        {/* The bar from the logo. It carries the facts a homeowner checks first. */}
        <div className="hero__floor on-gold" data-hero-floor>
          <ul className="wrap">
            {chips.map((c, i) => (
              <li key={c}>
                {i === 2 ? <StarIcon /> : null}
                {c}
              </li>
            ))}
          </ul>
        </div>
      </HeroMotion>
    </section>
  );
}
