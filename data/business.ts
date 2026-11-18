import type { L } from "./types";

/**
 * Single source of truth for name, phone, license, hours and links.
 * Every page, the footer, JSON-LD and the vCard read from here.
 */

/** One constant for the public URL. Set NEXT_PUBLIC_SITE_URL in Vercel when the domain is confirmed. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.goldrrremodeling.com").replace(/\/$/, "");

export const business = {
  /** Exactly as it appears on the Google Business Profile */
  legalName: "GOLD R R REMODELING",
  /** For running text */
  name: "Gold R.R Remodeling",
  shortName: "Gold R.R",
  license: "1149164",
  licenseLabel: "CA Lic. #1149164",
  licenseLookup: "https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum=1149164",
  phone: {
    display: "(707) 430-8295",
    e164: "+17074308295",
    schema: "+1-707-430-8295",
  },
  email: "goldrrremodeling2@gmail.com",
  /** Service-area business: no street address is published. */
  address: {
    locality: "Vallejo",
    region: "CA",
    postalCode: "94591",
    country: "US",
  },
  geo: { lat: 38.1041, lng: -122.2566 },
  yearsExperience: 13,
  google: {
    rating: 4.7,
    /** Stable link by CID */
    profile: "https://maps.google.com/?cid=15158176856236819516",
    short: "https://maps.app.goo.gl/RfiixBxeqjtmqqDeA",
    /** TODO(client): replace with the "Ask for reviews" link from the Business Profile dashboard */
    review: "https://maps.google.com/?cid=15158176856236819516",
    embed: "https://www.google.com/maps?q=Vallejo,+CA+94591&z=9&output=embed",
  },
  /**
   * Opening hours. Only "opens at 8:00 AM" is confirmed (see CONTENT-TODO.md).
   * When the full schedule is known, fill `days` and it appears in the footer, contact page and JSON-LD.
   */
  hours: {
    opens: "08:00",
    days: [] as { days: string[]; opens: string; closes: string }[],
    note: {
      en: "Opens at 8:00 AM. Call or text to schedule.",
      es: "Abrimos a las 8:00 AM. Llame o mande mensaje para agendar.",
    } satisfies L,
  },
  languages: ["en", "es"],
  /** Add profile URLs here when they exist; they render in the footer and in JSON-LD sameAs. */
  social: [] as { label: string; href: string }[],
};

export const tel = `tel:${business.phone.e164}`;
export const mailto = `mailto:${business.email}`;
export function sms(body?: string) {
  return body ? `sms:${business.phone.e164}?&body=${encodeURIComponent(body)}` : `sms:${business.phone.e164}`;
}
export const defaultSms: L = {
  en: "Hi Gold R.R, I'd like a free estimate.",
  es: "Hola Gold R.R, quisiera un presupuesto gratis.",
};
