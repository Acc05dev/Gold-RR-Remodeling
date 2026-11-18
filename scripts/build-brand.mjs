// Builds the vector logo and every derived brand asset from Logo/logo-goldrr-transparent.png.
//   node scripts/build-brand.mjs
// House lines + gold bar: redrawn by hand as constant-width strokes (the original is pure
// 45° geometry, 26 px stroke in the 636×381 source). Lettering: see section 1.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import opentype from "opentype.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "Logo/logo-goldrr-transparent.png");
const OUT = path.join(ROOT, "public/brand");
fs.mkdirSync(OUT, { recursive: true });

const W = 636, H = 381;
const GOLD = "#BF9643", INK = "#0E0E0E";

// ── 1. Lettering ─────────────────────────────────────────────────────────────
// Each glyph is taken from the closest open-source face (Bebas Neue for the tall G, League
// Spartan for the rest; chosen by pixel diff against the original) and fitted to the exact bounding box measured in the client's
// original, letter by letter. Clean outlines, original positions and proportions.
const loadFont = (p) => {
  const b = fs.readFileSync(path.join(ROOT, "node_modules", p));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
const bebas = loadFont("@fontsource/bebas-neue/files/bebas-neue-latin-400-normal.woff");
const ls700 = loadFont("@fontsource/league-spartan/files/league-spartan-latin-700-normal.woff");
const ls600 = loadFont("@fontsource/league-spartan/files/league-spartan-latin-600-normal.woff");

/** [char, x0, y0, x1, y1] measured on Logo/logo-goldrr-transparent.png (636×381) */
const GLYPHS = {
  "letter-g": [bebas, [["G", 122, 146, 181, 275]]],
  "text-old": [ls600, [["O", 189, 232, 229, 274], ["L", 238, 232, 263, 274], ["D", 271, 232, 305, 274]]],
  "text-rr-1": [ls700, [["R", 344, 163, 431, 270]]],
  "text-rr-2": [ls700, [["R", 495, 163, 582, 270]]],
  "text-remodeling": [ls700, [
    ["R", 314, 292, 339, 324], ["E", 344, 292, 363, 324], ["M", 367, 292, 403, 324], ["O", 407, 291, 439, 324.5],
    ["D", 445, 292, 471, 324], ["E", 477, 292, 495, 324], ["L", 501, 292, 520, 324], ["I", 525, 292, 533, 324],
    ["N", 540, 292, 568, 324], ["G", 573, 291, 604, 324.5],
  ]],
};
const r2 = (v) => Math.round(v * 100) / 100;
function fitGlyph(font, [ch, x0, y0, x1, y1]) {
  const p = font.charToGlyph(ch).getPath(0, 0, 1000);
  const b = p.getBoundingBox();
  const sx = (x1 - x0) / (b.x2 - b.x1), sy = (y1 - y0) / (b.y2 - b.y1);
  const X = (x) => r2((x - b.x1) * sx + x0), Y = (y) => r2((y - b.y1) * sy + y0);
  return p.commands.map((c) => {
    if (c.type === "M" || c.type === "L") return `${c.type}${X(c.x)} ${Y(c.y)}`;
    if (c.type === "Q") return `Q${X(c.x1)} ${Y(c.y1)} ${X(c.x)} ${Y(c.y)}`;
    if (c.type === "C") return `C${X(c.x1)} ${Y(c.y1)} ${X(c.x2)} ${Y(c.y2)} ${X(c.x)} ${Y(c.y)}`;
    return "Z";
  }).join("");
}
const paths = {};
const letters = {};
for (const [name, [font, list]] of Object.entries(GLYPHS)) {
  letters[name] = list.map((g) => fitGlyph(font, g));
  paths[name] = letters[name].join("");
}

// ── 2. Geometry (hand-drawn, exact 45° construction) ─────────────────────────
const STROKE = 26;
const LINES = {
  "roof-outer": "M26 368V135.4L130 31.4L252.8 154.2",
  "roof-inner": "M307 306H75V155.4L147.2 83.2",
  "roof-slab": "M180.2 50.7L199.5 31.4L321.8 153.7",
};
const BAR = { x: 13, y: 342, w: 610, h: 26, gradFrom: 441 };

function svg({ dark = false, pad = 0, mark = false, id = "g" } = {}) {
  const text = dark ? "#FFFFFF" : INK;
  const vb = mark ? `0 0 344 344` : `${-pad} ${-pad} ${W + pad * 2} ${H + pad * 2}`;
  const lines = Object.entries(LINES)
    .map(([k, d]) => `<path id="${k}" d="${d}" fill="none" stroke="${GOLD}" stroke-width="${STROKE}" stroke-linejoin="miter" stroke-miterlimit="4"/>`)
    .join("\n    ");
  const defs = `<defs>
    <linearGradient id="${id}-bar" gradientUnits="userSpaceOnUse" x1="${BAR.gradFrom}" y1="348" x2="${BAR.x + BAR.w}" y2="364">
      <stop offset="0" stop-color="#E3AB58"/><stop offset=".3" stop-color="#DA9E4C"/><stop offset=".62" stop-color="#CF9241"/><stop offset="1" stop-color="#CA8A30"/>
    </linearGradient>
  </defs>`;
  if (mark) {
    // Favicon mark: the house and the G, on the bar. Cropped and re-centred from the full logo.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 356 381" role="img" aria-label="Gold R.R Remodeling">
  ${defs}
  <g id="house">
    ${lines}
  </g>
  <path id="gold-bar" d="M13 342H343V368H13z" fill="${GOLD}"/>
  <path id="letter-g" d="${paths["letter-g"]}" fill="${text}" fill-rule="evenodd"/>
</svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="Gold R.R Remodeling">
  ${defs}
  <g id="house">
    ${lines}
  </g>
  <g id="gold-bar">
    <path id="gold-bar-solid" d="M${BAR.x} ${BAR.y}H${BAR.gradFrom + 1}V${BAR.y + BAR.h}H${BAR.x}z" fill="${GOLD}"/>
    <path id="gold-bar-gradient" d="M${BAR.gradFrom} ${BAR.y}H${BAR.x + BAR.w}V${BAR.y + BAR.h}H${BAR.gradFrom}z" fill="url(#${id}-bar)"/>
  </g>
  <path id="letter-g" d="${paths["letter-g"]}" fill="${text}" fill-rule="evenodd"/>
  <path id="text-old" d="${paths["text-old"]}" fill="${text}" fill-rule="evenodd"/>
  <g id="text-rr" fill="${GOLD}">
    <path d="${paths["text-rr-1"]}" fill-rule="evenodd"/>
    <circle cx="458" cy="257" r="15"/>
    <path d="${paths["text-rr-2"]}" fill-rule="evenodd"/>
  </g>
  <path id="text-remodeling" d="${paths["text-remodeling"]}" fill="${text}" fill-rule="evenodd"/>
</svg>`;
}

fs.writeFileSync(path.join(OUT, "logo.svg"), svg({ id: "l" }));
fs.writeFileSync(path.join(OUT, "logo-dark.svg"), svg({ dark: true, id: "d" }));
fs.writeFileSync(path.join(OUT, "logo-mark.svg"), svg({ mark: true, dark: true, id: "m" }));
// Paths for the animated React logo (preloader, header)
fs.writeFileSync(
  path.join(ROOT, "data/logo.generated.ts"),
  `// AUTO-GENERATED by scripts/build-brand.mjs — do not edit by hand.
export const LOGO = ${JSON.stringify({ width: W, height: H, stroke: STROKE, lines: LINES, bar: BAR, paths, remodeling: letters["text-remodeling"], old: letters["text-old"] }, null, 2)} as const;
`,
);

// ── 3. Fidelity check: render the SVG over white and diff against the original at 300 px ──
const ref = await sharp(SRC).flatten({ background: "#fff" }).resize({ width: 300 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const mine = await sharp(Buffer.from(svg({ id: "c" })), { density: 300 }).flatten({ background: "#fff" }).resize({ width: 300, height: ref.info.height, fit: "fill" }).removeAlpha().raw().toBuffer();
let sum = 0, big = 0;
for (let i = 0; i < mine.length; i++) {
  const d = Math.abs(mine[i] - ref.data[i]);
  sum += d;
  if (d > 64) big++;
}
const mae = sum / mine.length;
console.log(`logo diff @300px — mean abs error ${mae.toFixed(2)}/255, channels off by >64: ${((big / mine.length) * 100).toFixed(2)} %`);
const diffImg = Buffer.alloc(mine.length);
for (let i = 0; i < mine.length; i++) diffImg[i] = 255 - Math.min(255, Math.abs(mine[i] - ref.data[i]) * 3);
fs.mkdirSync(path.join(ROOT, "docs/brand"), { recursive: true });
await sharp(diffImg, { raw: { width: 300, height: ref.info.height, channels: 3 } }).png().toFile(path.join(ROOT, "docs/brand/logo-diff-300.png"));
await sharp(Buffer.from(svg({ id: "c" })), { density: 400 }).flatten({ background: "#fff" }).resize({ width: 1272 }).png().toFile(path.join(ROOT, "docs/brand/logo-vector-render.png"));

// ── 4. Favicons, app icons, OG default ───────────────────────────────────────
const APP = path.join(ROOT, "app");
fs.mkdirSync(APP, { recursive: true });
const markSvg = Buffer.from(svg({ mark: true, dark: true, id: "i" }));
async function icon(size, file, { padding = 0.16, bg = INK } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const m = await sharp(markSvg, { density: 600 }).resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: bg } }).composite([{ input: m, gravity: "center" }]).png().toFile(file);
}
await icon(180, path.join(APP, "apple-icon.png"));
await icon(192, path.join(ROOT, "public/icon-192.png"));
await icon(512, path.join(ROOT, "public/icon-512.png"));
await icon(512, path.join(ROOT, "public/icon-maskable-512.png"), { padding: 0.24 });
// icon.svg: mark on an ink tile with the 45° chamfer used across the site
const markInner = svg({ mark: true, dark: true, id: "s" }).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
fs.writeFileSync(
  path.join(APP, "icon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 0H416L512 96V512H0z" fill="${INK}"/><g transform="translate(92 76) scale(.92)">${markInner}</g></svg>`,
);
// favicon.ico (PNG-in-ICO, 48 px)
const png48 = await (async () => {
  const tmp = path.join(OUT, ".f48.png");
  await icon(48, tmp, { padding: 0.1 });
  const b = fs.readFileSync(tmp);
  fs.rmSync(tmp);
  return b;
})();
const ico = Buffer.alloc(22);
ico.writeUInt16LE(0, 0); ico.writeUInt16LE(1, 2); ico.writeUInt16LE(1, 4);
ico.writeUInt8(48, 6); ico.writeUInt8(48, 7); ico.writeUInt8(0, 8); ico.writeUInt8(0, 9);
ico.writeUInt16LE(1, 10); ico.writeUInt16LE(32, 12); ico.writeUInt32LE(png48.length, 14); ico.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(APP, "favicon.ico"), Buffer.concat([ico, png48]));

// Static OG fallback (dynamic per-page OG images are rendered by next/og)
const logoDark = await sharp(Buffer.from(svg({ dark: true, id: "o" })), { density: 300 }).resize({ width: 560 }).png().toBuffer();
const ogBg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="${INK}"/><path d="M60 570V60H1044L1140 156V570" fill="none" stroke="${GOLD}" stroke-width="3"/><rect x="60" y="556" width="1080" height="14" fill="${GOLD}"/></svg>`,
);
await sharp(ogBg).composite([{ input: logoDark, gravity: "center" }]).jpeg({ quality: 90 }).toFile(path.join(ROOT, "public/og-default.jpg"));
console.log("brand assets written");
