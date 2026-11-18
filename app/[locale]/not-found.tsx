import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { business, tel } from "@/data/business";
import { services } from "@/data/services";
import type { Locale } from "@/data/types";
import { PhoneIcon } from "@/components/Icons";

export async function generateMetadata() {
  const t = await getTranslations("meta");
  return { title: t("notFoundTitle"), robots: { index: false } };
}

export default async function NotFound() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  return (
    <section className="nf on-ink">
      <div className="wrap">
        <p className="tall nf__code" aria-hidden="true">
          404
        </p>
        <h1 className="display h1--page">{t("notFound.h1")}</h1>
        <p className="lead">{t("notFound.body")}</p>
        <p style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href="/" className="btn btn--gold">
            {t("notFound.home")}
          </Link>
          <Link href="/contact" className="btn btn--line">
            {t("common.getEstimate")}
          </Link>
          <a href={tel} className="btn btn--line" data-track="click_call" data-track-at="404">
            <PhoneIcon />
            {business.phone.display}
          </a>
        </p>
        <nav className="linkrow" aria-label={t("nav.services")}>
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`}>
              {s.name[locale]}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
