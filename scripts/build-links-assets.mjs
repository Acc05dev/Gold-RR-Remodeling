// Produces the images used by the link-in-bio page (links/public) from the processed site media
// and the vector logo. Run after scripts/process-media.mjs and scripts/build-brand.mjs:
//   node scripts/build-links-assets.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "links/public");
const IMG = path.join(OUT, "img");
fs.mkdirSync(IMG, { recursive: true });

// [output name, processed photo, vertical focus 0–1 for the landscape crop]
const HERO = [
  ["walk-in-tile-shower", "walk-in-tile-shower-pebble-floor-glass-panel-gold-rr-remodeling.jpg", 0.62],
  ["bathroom-vanity-lit-mirror", "bathroom-vanity-led-mirror-gold-rr-remodeling.jpg", 0.42],
  ["slate-tile-bathroom", "slate-tile-bathroom-mosaic-border-gold-rr-remodeling.jpg", 0.45],
];
for (const [name, file, focus] of HERO) {
  const src = path.join(ROOT, "public/media/photos", file);
  const m = await sharp(src).metadata();
  const h = Math.round(m.width * (640 / 944));
  const top = Math.max(0, Math.min(m.height - h, Math.round(m.height * focus - h / 2)));
  const base = sharp(src).extract({ left: 0, top, width: m.width, height: h }).resize({ width: 944, height: 640 });
  const webp = await base.clone().webp({ quality: 72 }).toFile(path.join(IMG, `${name}.webp`));
  const jpg = await base.clone().jpeg({ quality: 76, mozjpeg: true }).toFile(path.join(IMG, `${name}.jpg`));
  console.log(name, `${Math.round(webp.size / 1024)}KB webp`, `${Math.round(jpg.size / 1024)}KB jpg`);
}

// Logo, icons, OG image
fs.copyFileSync(path.join(ROOT, "public/brand/logo-dark.svg"), path.join(OUT, "logo.svg"));
fs.copyFileSync(path.join(ROOT, "app/icon.svg"), path.join(OUT, "icon.svg"));
fs.copyFileSync(path.join(ROOT, "public/icon-512.png"), path.join(IMG, "icon-512.png"));
fs.copyFileSync(path.join(ROOT, "app/apple-icon.png"), path.join(IMG, "apple-icon.png"));

const logo = await sharp(path.join(ROOT, "public/brand/logo-dark.svg"), { density: 300 }).resize({ width: 520 }).png().toBuffer();
const first = await sharp(path.join(IMG, `${HERO[0][0]}.jpg`)).resize({ width: 1200, height: 630, fit: "cover" }).modulate({ brightness: 0.42 }).toBuffer();
const frame = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect x="0" y="606" width="820" height="24" fill="#BF9643"/><rect x="820" y="606" width="380" height="24" fill="#DFA553"/><rect x="1060" y="606" width="140" height="24" fill="#CC8C32"/></svg>`,
);
await sharp(first).composite([{ input: logo, gravity: "center" }, { input: frame }]).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(IMG, "og.jpg"));

// Small logo on ink for the vCard photo
const vlogo = await sharp(path.join(ROOT, "public/brand/logo-dark.svg"), { density: 200 }).resize({ width: 220 }).png().toBuffer();
const vcard = await sharp({ create: { width: 256, height: 256, channels: 3, background: "#0E0E0E" } }).composite([{ input: vlogo, gravity: "center" }]).png({ compressionLevel: 9, palette: true }).toBuffer();
fs.writeFileSync(path.join(IMG, "vcard-logo.b64"), vcard.toString("base64"));
console.log("links assets written");
