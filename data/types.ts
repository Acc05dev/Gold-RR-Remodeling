export type Locale = "en" | "es";

/** A value available in both site languages. */
export type L<T = string> = Record<Locale, T>;

export type ServiceSlug =
  | "bathroom-remodeling"
  | "kitchen-remodeling"
  | "tile-installation"
  | "flooring-installation"
  | "interior-exterior-painting"
  | "drywall-repair-texture"
  | "finish-carpentry"
  | "countertops"
  | "repairs-restoration";

export type Faq = { q: string; a: string };

export type ServiceContent = {
  slug: ServiceSlug;
  /** Display name, e.g. "Bathroom Remodeling" / "Remodelación de baños" */
  name: L;
  /** One-line summary for cards, max 110 characters */
  short: L;
  /** <title>, max 60 characters, service + city + brand */
  metaTitle: L;
  /** Meta description, max 155 characters */
  metaDescription: L;
  /** Page H1 — includes the service and "Vallejo, CA" */
  h1: L;
  /** Two opening paragraphs */
  intro: L<string[]>;
  /** "What's included" — 5 to 7 items */
  includes: L<{ title: string; text: string }[]>;
  /** How the crew approaches this kind of job, 2–3 paragraphs */
  approach: L<{ title: string; paragraphs: string[] }>;
  /** Materials and finishes: 1–2 paragraphs + a short list of options */
  finishes: L<{ title: string; paragraphs: string[]; options: string[] }>;
  /** Honest note on timing. Never a number of days or a price. */
  timeline: L;
  /** 4–5 service-specific questions */
  faqs: L<Faq[]>;
  /** Pre-filled SMS text, first person, one sentence */
  smsBody: L;
};

export type AreaContent = {
  /** e.g. "vallejo-ca" */
  slug: string;
  city: string;
  county: string;
  lat: number;
  lng: number;
  /** Approximate straight-line miles from Vallejo, 0 for Vallejo */
  milesFromVallejo: number;
  /** e.g. "Home base" or "About 15 minutes from our base in Vallejo via I-780" */
  drive: L;
  metaTitle: L;
  metaDescription: L;
  h1: L;
  /** Two opening paragraphs, specific to this city */
  intro: L<string[]>;
  /** The local housing stock and what it means for remodeling work */
  homes: L<{ title: string; paragraphs: string[] }>;
  /** Well-known neighborhoods or districts (proper names, not translated) */
  neighborhoods: string[];
  /** Three services that fit this city's homes, each with a one-sentence reason */
  popular: { slug: ServiceSlug; why: L }[];
  faqs: L<Faq[]>;
};

export type LegalDoc = {
  title: L;
  updated: string;
  sections: L<{ heading: string; paragraphs: string[] }[]>;
};
