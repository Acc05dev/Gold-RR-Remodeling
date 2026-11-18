import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { areas } from "@/data/areas";
import { url } from "@/lib/seo";

/** Every page once, with its English and Spanish alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; freq: "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/services", priority: 0.9, freq: "monthly" },
    ...services.map((s) => ({ path: `/services/${s.slug}`, priority: 0.9, freq: "monthly" as const })),
    { path: "/service-areas", priority: 0.8, freq: "monthly" },
    ...areas.map((a) => ({ path: `/service-areas/${a.slug}`, priority: 0.8, freq: "monthly" as const })),
    { path: "/gallery", priority: 0.7, freq: "weekly" },
    { path: "/about", priority: 0.6, freq: "yearly" },
    { path: "/contact", priority: 0.8, freq: "yearly" },
    { path: "/privacy", priority: 0.2, freq: "yearly" },
    { path: "/terms", priority: 0.2, freq: "yearly" },
  ];
  const lastModified = new Date();
  return pages.flatMap((p) =>
    (["en", "es"] as const).map((locale) => ({
      url: url(p.path, locale),
      lastModified,
      changeFrequency: p.freq,
      priority: locale === "en" ? p.priority : Math.max(0.1, p.priority - 0.1),
      alternates: { languages: { "en-US": url(p.path, "en"), "es-US": url(p.path, "es"), "x-default": url(p.path, "en") } },
    })),
  );
}
