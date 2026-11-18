// SEO / content QA over the built site, reading raw server HTML (no JavaScript executed).
//   pnpm build && pnpm start -p 3105   then   node scripts/qa.mjs
// Checks every URL in the sitemap for: status 200, exactly one <h1>, title ≤ 60, description ≤ 155,
// canonical on SITE_URL, hreflang pairs, valid JSON-LD with expected types, images with alt text.
// On the home page it also checks that counters carry their final values without JS.
import fs from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3105";
const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const site = new URL(locs[0]).origin;
const problems = [];
const rows = [];
const strip = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

for (const loc of locs) {
  const path = loc.replace(site, "") || "/";
  const res = await fetch(BASE + path, { redirect: "manual" });
  const html = await res.text();
  const fail = (m) => problems.push(`${path}: ${m}`);
  if (res.status !== 200) {
    fail(`status ${res.status}`);
    continue;
  }
  const h1 = [...html.matchAll(/<h1[\s>]/g)].length;
  if (h1 !== 1) fail(`${h1} <h1> elements`);
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  if (!title) fail("no title");
  if (title.length > 60) fail(`title ${title.length} chars: ${title}`);
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  if (!desc && !/privacy|terms/.test(path)) fail("no meta description");
  if (desc.length > 155) fail(`description ${desc.length} chars`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical !== loc) fail(`canonical ${canonical} ≠ ${loc}`);
  const hreflang = [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/gi)].map((m) => m[1]);
  for (const l of ["en-US", "es-US", "x-default"]) if (!hreflang.includes(l)) fail(`missing hreflang ${l}`);
  if (!/property="og:image"/.test(html)) fail("no og:image");
  const lang = html.match(/<html[^>]* lang="([^"]+)"/)?.[1];
  if (lang !== (path.startsWith("/es") ? "es-US" : "en-US")) fail(`html lang ${lang}`);

  const types = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      types.push([].concat(j["@type"]).join("+"));
      if (JSON.stringify(j).includes("AggregateRating")) fail("AggregateRating present");
    } catch (e) {
      fail(`invalid JSON-LD: ${e.message}`);
    }
  }
  if (!types.some((t) => t.includes("HomeAndConstructionBusiness"))) fail("no business JSON-LD");
  if (/\/services\/./.test(path) && !types.includes("Service")) fail("no Service JSON-LD");
  if (path !== "/" && path !== "/es" && !types.includes("BreadcrumbList")) fail("no BreadcrumbList JSON-LD");
  if ((path === "/" || path === "/es") && !types.includes("WebSite")) fail("no WebSite JSON-LD");

  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = imgs.filter((i) => !/\balt="/.test(i)).length;
  if (noAlt) fail(`${noAlt} images without alt attribute`);

  if (path === "/") {
    const text = strip(html);
    for (const needle of ["13+", "4.7", "#1149164", "(707) 430-8295", "Vallejo, CA 94591"]) if (!text.includes(needle)) fail(`server HTML is missing "${needle}"`);
    if (/>0\+?</.test(html)) fail('a counter renders "0" in server HTML');
  }
  const words = strip(html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "")).split(" ").length;
  rows.push({ path, title: title.length, desc: desc.length, h1, jsonld: types.join(", "), words });
}

console.table(rows);
console.log(problems.length ? `\n${problems.length} problem(s):\n` + problems.join("\n") : `\nAll ${rows.length} pages pass.`);
fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync("docs/qa-report.json", JSON.stringify({ checked: new Date().toISOString(), pages: rows, problems }, null, 2));
process.exit(problems.length ? 1 : 0);
