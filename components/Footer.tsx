import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { business, mailto, tel, sms, defaultSms } from "@/data/business";
import { services } from "@/data/services";
import { areas } from "@/data/areas";
import type { Locale } from "@/data/types";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <footer className="footer on-ink">
      <div className="wrap">
        <div className="footer__grid">
          <div className="footer__brand">
            <Image src="/brand/logo-dark.svg" alt={business.name} width={636} height={381} unoptimized />
            <p>{t("footer.blurb")}</p>
          </div>
          <div>
            <h2>{t("footer.contact")}</h2>
            {/* NAP: identical to the Google Business Profile. No street address (service-area business). */}
            <address>
              <ul>
                <li>
                  <strong>{business.legalName}</strong>
                </li>
                <li>
                  {business.address.locality}, {business.address.region} {business.address.postalCode}
                </li>
                <li>
                  <a href={tel} data-track="click_call" data-track-at="footer">
                    {business.phone.display}
                  </a>
                </li>
                <li>
                  <a href={sms(defaultSms[locale])} data-track="click_text" data-track-at="footer">
                    {t("common.textUs")}
                  </a>
                </li>
                <li>
                  <a href={mailto} data-track="click_email" data-track-at="footer" className="footer__mail">
                    {business.email}
                  </a>
                </li>
              </ul>
            </address>
          </div>
          <div>
            <h2>{t("footer.services")}</h2>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}>{s.name[locale]}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{t("footer.areas")}</h2>
            <ul>
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link href={`/service-areas/${a.slug}`}>{a.city}, CA</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{t("footer.company")}</h2>
            <ul>
              <li>
                <Link href="/about">{t("nav.about")}</Link>
              </li>
              <li>
                <Link href="/gallery">{t("nav.gallery")}</Link>
              </li>
              <li>
                <Link href="/contact">{t("common.freeEstimate")}</Link>
              </li>
              <li>
                <a href={business.google.profile} target="_blank" rel="noopener" data-track="click_directions" data-track-at="footer">
                  {t("footer.google")}
                </a>
              </li>
              {business.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <h2 style={{ marginTop: 28 }}>{t("footer.hours")}</h2>
            <p>{business.hours.note[locale]}</p>
          </div>
        </div>
        <div className="footer__base">
          <p>
            © {new Date().getFullYear()} {business.legalName}. {t("footer.rights")}{" "}
            <a href={business.licenseLookup} target="_blank" rel="noopener">
              {t("common.license")}
            </a>
          </p>
          <ul>
            <li>
              <Link href="/privacy">{t("footer.privacy")}</Link>
            </li>
            <li>
              <Link href="/terms">{t("footer.terms")}</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
