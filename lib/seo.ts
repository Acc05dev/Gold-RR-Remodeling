import type { Metadata } from "next";
import { SITE_URL, business } from "@/data/business";
import { areas } from "@/data/areas";
import type { Locale } from "@/data/types";

/** Absolute URL for a path in a locale. English is unprefixed, Spanish lives under /es. */
export function url(path = "/", locale: Locale = "en") {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  return `${SITE_URL}${locale === "es" ? "/es" : ""}${clean}` || SITE_URL;
}

export function ogImage(title: string, kicker?: string) {
  const q = new URLSearchParams({ title });
  if (kicker) q.set("kicker", kicker);
  return `${SITE_URL}/og?${q.toString()}`;
}

/** Per-page metadata: canonical, hreflang pairs, Open Graph and Twitter card. */
export function pageMeta({
  locale,
  path,
  title,
  description,
  ogTitle,
  kicker,
  noindex,
}: {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
  ogTitle?: string;
  kicker?: string;
  noindex?: boolean;
}): Metadata {
  const canonical = url(path, locale);
  const image = ogImage(ogTitle ?? title.split(" | ")[0], kicker);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: { "en-US": url(path, "en"), "es-US": url(path, "es"), "x-default": url(path, "en") },
    },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      url: canonical,
      siteName: business.name,
      title,
      description,
      locale: locale === "es" ? "es_US" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_US",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

// ── JSON-LD ──────────────────────────────────────────────────────────────────
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function businessLd(locale: Locale) {
  const hours = business.hours.days.map((d) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: d.days,
    opens: d.opens,
    closes: d.closes,
  }));
  return {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "GeneralContractor"],
    "@id": BUSINESS_ID,
    name: business.legalName,
    alternateName: business.name,
    url: url("/", locale),
    logo: `${SITE_URL}/icon-512.png`,
    image: `${SITE_URL}/og-default.jpg`,
    telephone: business.phone.schema,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    areaServed: areas.map((a) => ({ "@type": "City", name: `${a.city}, CA` })),
    hasMap: business.google.profile,
    sameAs: [business.google.profile, ...business.social.map((s) => s.href)],
    knowsLanguage: business.languages,
    ...(hours.length ? { openingHoursSpecification: hours } : {}),
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: `California Contractor License #${business.license}`,
      identifier: business.license,
      recognizedBy: {
        "@type": "GovernmentOrganization",
        name: "California Contractors State License Board",
        url: "https://www.cslb.ca.gov",
      },
    },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: business.name,
    inLanguage: ["en-US", "es-US"],
    publisher: { "@id": BUSINESS_ID },
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceLd({ name, description, path, locale }: { name: string; description: string; path: string; locale: Locale }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    url: url(path, locale),
    provider: { "@id": BUSINESS_ID },
    areaServed: areas.map((a) => ({ "@type": "City", name: `${a.city}, CA` })),
  };
}
