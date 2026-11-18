import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  // English lives at the root (/services), Spanish under /es (/es/services)
  localePrefix: "as-needed",
  // The URL decides the language. No Accept-Language redirects, so crawlers and shared links are stable.
  localeDetection: false,
});
