import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { tel, sms, defaultSms } from "@/data/business";
import type { Locale } from "@/data/types";
import { EstimateIcon, PhoneIcon, TextIcon } from "./Icons";

/** Phones: fixed Call / Text / Estimate bar. Desktop: one floating "Text us" button. */
export async function MobileBar({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "common" });
  return (
    <>
      <nav className="mbar" aria-label={t("freeEstimate")}>
        <a href={tel} data-track="click_call" data-track-at="mobile-bar">
          <PhoneIcon />
          {t("call")}
        </a>
        <a href={sms(defaultSms[locale])} data-track="click_text" data-track-at="mobile-bar">
          <TextIcon />
          {t("text")}
        </a>
        <Link href="/contact">
          <EstimateIcon />
          {t("estimate")}
        </Link>
      </nav>
      <a className="btn btn--gold float-text" href={sms(defaultSms[locale])} data-track="click_text" data-track-at="floating" data-magnetic>
        <TextIcon />
        {t("textUs")}
      </a>
    </>
  );
}
