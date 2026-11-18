// Full-page screenshots of the representative pages at 390, 768 and 1440 px → docs/screenshots/
//   pnpm build && pnpm start -p 3105   then   node scripts/screenshots.mjs
// Each page is scrolled through first so scroll-triggered content has played before the capture.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3105";
const OUT = "docs/screenshots";
const PAGES = [
  ["home", "/"],
  ["home-es", "/es"],
  ["services", "/services"],
  ["service-bathroom", "/services/bathroom-remodeling"],
  ["service-kitchen", "/services/kitchen-remodeling"],
  ["areas", "/service-areas"],
  ["area-vallejo", "/service-areas/vallejo-ca"],
  ["gallery", "/gallery"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["privacy", "/privacy"],
  ["not-found", "/this-page-does-not-exist"],
];
const WIDTHS = [
  [390, 844],
  [768, 1024],
  [1440, 900],
];
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const errors = [];
for (const [w, h] of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 700, hasTouch: w < 700 });
  for (const [name, route] of PAGES) {
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push(`${name}@${w}: ${e.message}`));
    page.on("console", (m) => {
      // the Vercel Analytics script only exists on Vercel
      if (m.type() === "error" && !/insights|404/.test(m.text())) errors.push(`${name}@${w}: ${m.text()}`);
    });
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(3200);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 600) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(110);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, `${name}-${w}.jpg`), fullPage: true, type: "jpeg", quality: 72 });
    await page.close();
    console.log(`${name}-${w}.jpg`);
  }
  await ctx.close();
}
await browser.close();
console.log(errors.length ? `\nConsole / page errors:\n${errors.join("\n")}` : "\nNo console or page errors.");
