import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { business, mailto, tel, sms, defaultSms } from "@/data/business";
import { services } from "@/data/services";
import { faqs } from "@/data/faqs";
import type { Locale } from "@/data/types";
import { pageMeta, faqLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Animate } from "@/components/Animate";
import { EstimateForm } from "@/components/EstimateForm";
import { Faq } from "@/components/Faq";
import { MailIcon, PhoneIcon, TextIcon } from "@/components/Icons";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMeta({ locale, path: "/contact", title: t("contactTitle"), description: t("contactDescription") });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const short = faqs[locale].slice(0, 4);
  return (
    <>
      <JsonLd data={faqLd(short)} />
      <PageHero
        locale={locale}
        title={t("contactPage.h1")}
        lead={t("contactPage.lead")}
        meta={[t("common.license"), t("common.seHabla")]}
        crumbs={[
          { name: t("common.home"), path: "/" },
          { name: t("nav.contact"), path: "/contact" },
        ]}
      />
      <section className="sec on-ink">
        <div className="wrap contact">
          <div>
            <h2 className="display h2--sm">{t("contactPage.direct")}</h2>
            <span className="bar" style={{ marginBottom: 28 }} />
            <div className="direct">
              <a href={tel} className="chamfer" data-track="click_call" data-track-at="contact">
                <PhoneIcon />
                <strong>{business.phone.display}</strong>
                <span>{t("contactPage.callSub")}</span>
              </a>
              <a href={sms(defaultSms[locale])} className="chamfer" data-track="click_text" data-track-at="contact">
                <TextIcon />
                <strong>{t("common.textUs")}</strong>
                <span>{t("contactPage.textSub")}</span>
              </a>
              <a href={mailto} className="chamfer" data-track="click_email" data-track-at="contact">
                <MailIcon />
                <strong style={{ textTransform: "none", fontSize: ".95rem" }}>{business.email}</strong>
                <span>{t("contactPage.emailSub")}</span>
              </a>
            </div>
            <div className="contact__info">
              <div>
                <h2>{t("footer.hours")}</h2>
                <p>{business.hours.note[locale]}</p>
              </div>
              <div>
                <h2>{t("contactPage.areaTitle")}</h2>
                <p>{t("contactPage.areaBody")}</p>
                <p style={{ marginTop: 6, color: "var(--color-mute)" }}>{t("footer.serviceArea")}</p>
              </div>
              <div>
                <h2>{t("common.licensed")}</h2>
                <p>
                  {business.legalName}
                  <br />
                  <a href={business.licenseLookup} target="_blank" rel="noopener" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                    {t("common.license")}
                  </a>
                </p>
              </div>
            </div>
          </div>
          <EstimateForm services={services.map((s) => ({ value: s.slug, label: s.name[locale] }))} />
        </div>
      </section>
      <section className="sec on-bone">
        <Animate className="wrap faqwrap">
          <div>
            <h2 className="display h2--sm" data-split>
              {t("faq.title")}
            </h2>
            <span className="bar" />
          </div>
          <Faq items={short} name="faq-contact" />
        </Animate>
      </section>
    </>
  );
}
