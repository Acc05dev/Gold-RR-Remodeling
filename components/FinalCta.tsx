import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { business, tel, sms, defaultSms } from "@/data/business";
import type { Locale } from "@/data/types";
import { Animate } from "./Animate";
import { PhoneIcon, TextIcon } from "./Icons";

/** Closing band, set on the gold of the logo's bar. The owner's own sign-off, word for word. */
export async function FinalCta({ locale, smsBody }: { locale: Locale; smsBody?: string }) {
  const t = await getTranslations({ locale });
  return (
    <section className="cta on-gold">
      <Animate className="wrap cta__in">
        <p className="display cta__title" data-split>
          {t("cta.title")} {t("cta.sub")}
        </p>
        <div className="cta__side">
          <p>{t("cta.body")}</p>
          <div className="cta__btns">
            <Link href="/contact" className="btn btn--ink" data-magnetic>
              {t("common.getEstimate")}
            </Link>
            <a href={tel} className="btn btn--ink" data-track="click_call" data-track-at="final-cta" data-magnetic>
              <PhoneIcon />
              {business.phone.display}
            </a>
            <a href={sms(smsBody ?? defaultSms[locale])} className="link" data-track="click_text" data-track-at="final-cta">
              <TextIcon width={18} height={18} />
              {t("common.textUs")}
            </a>
          </div>
          <p className="cta__lic">
            {business.legalName}, {t("common.license")}
          </p>
        </div>
      </Animate>
    </section>
  );
}
