// Prepares start / end frames for image-to-video tools (Google Flow "Frames to Video" and similar):
// the client's real before and after photos, cropped to 9:16 at 1080×1920 so both frames of a pair
// share the same shape.   node scripts/build-flow-frames.mjs   →   flow-frames/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "public/media/photos");
const OUT = path.join(ROOT, "flow-frames");
fs.mkdirSync(OUT, { recursive: true });

// [output name, processed photo, horizontal focus 0–1 for the 9:16 crop]
const FRAMES = [
  ["1-tub-to-walk-in-shower_START", "bathroom-before-pink-tile-tub-gold-rr-remodeling.jpg", 0.5],
  ["1-tub-to-walk-in-shower_END", "walk-in-tile-shower-pebble-floor-glass-panel-gold-rr-remodeling.jpg", 0.55],
  ["2-hall-bathroom_START", "bathroom-before-pink-floor-tile-gold-rr-remodeling.jpg", 0.45],
  ["2-hall-bathroom_END", "bathroom-remodel-navy-vanity-gray-tile-gold-rr-remodeling.jpg", 0.45],
  ["3-blue-tile-shower_START", "bathroom-before-mauve-tile-gold-rr-remodeling.jpg", 0.5],
  ["3-blue-tile-shower_END", "blue-tile-shower-brass-fixtures-gold-rr-remodeling.jpg", 0.5],
];

for (const [name, file, focus] of FRAMES) {
  const src = path.join(SRC, file);
  const m = await sharp(src).metadata();
  const w = Math.round((m.height * 9) / 16);
  const left = Math.max(0, Math.min(m.width - w, Math.round(m.width * focus - w / 2)));
  const info = await sharp(src)
    .extract({ left, top: 0, width: w, height: m.height })
    .resize({ width: 1080, height: 1920, kernel: "lanczos3" })
    .jpeg({ quality: 92 })
    .toFile(path.join(OUT, `${name}.jpg`));
  console.log(`${name}.jpg`, `${info.width}x${info.height}`);
}
