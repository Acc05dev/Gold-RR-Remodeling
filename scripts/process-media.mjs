// Processes the client's originals (Img/) into optimized site media.
//   node scripts/process-media.mjs            → photos + videos
//   node scripts/process-media.mjs --photos   → photos only
//   node scripts/process-media.mjs --videos   → videos only
//   node scripts/process-media.mjs --panels   → hero panels only (Img/VIdeoFlow)
// Originals are read-only. Output: public/media/**, media-masters/**, media-manifest.json,
// data/media.generated.ts
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import ffmpegStatic from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";
import { PHOTOS, PROJECTS, HERO, REELS, HERO_PANELS } from "./media-map.mjs";

// ffmpeg-static only has its binary after its install script has run (see README). Otherwise use ffmpeg from PATH.
const ffmpegPath = ffmpegStatic && fs.existsSync(ffmpegStatic) ? ffmpegStatic : "ffmpeg";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMG = path.join(ROOT, "Img");
const OUT_PHOTOS = path.join(ROOT, "public/media/photos");
const OUT_VIDEO = path.join(ROOT, "public/media/video");
const MASTERS = path.join(ROOT, "media-masters");
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "goldrr-media-"));
for (const d of [OUT_PHOTOS, OUT_VIDEO, MASTERS]) fs.mkdirSync(d, { recursive: true });

const args = process.argv.slice(2);
const only = args.find((a) => ["--photos", "--videos", "--panels"].includes(a));
const doPhotos = !only || only === "--photos";
const doVideos = !only || only === "--videos";
const doPanels = !only || only === "--panels";

const ff = (a, opts = {}) => execFileSync(ffmpegPath, ["-y", "-v", "error", ...a], { stdio: ["ignore", "pipe", "pipe"], ...opts });
const probe = (p) => JSON.parse(execFileSync(ffprobeStatic.path, ["-v", "error", "-print_format", "json", "-show_streams", "-show_format", p]).toString());

function folderName(n) {
  return n === 1 ? "Nueva carpeta" : `Nueva carpeta (${n})`;
}
function original(folder, index) {
  const dir = path.join(IMG, folderName(folder));
  const files = fs.readdirSync(dir).sort();
  const f = files[index - 1];
  if (!f) throw new Error(`No file ${index} in ${dir}`);
  return path.join(dir, f);
}
const rel = (p) => path.relative(ROOT, p).replaceAll("\\", "/");

// ── Photos ───────────────────────────────────────────────────────────────────
// Subtle, non-destructive-looking corrections: EXIF orientation, a partial gray-world
// white balance (30 % of the way, capped at ±7 %), gentle contrast stretch, 1.5× Lanczos
// upscale for the 768 px WhatsApp files, light sharpening.
async function gradePhoto(input) {
  const base = sharp(input).rotate();
  const { channels } = await base.clone().stats();
  const [r, g, b] = channels.map((c) => c.mean);
  const avg = (r + g + b) / 3;
  const gain = (m) => Math.min(1.07, Math.max(0.93, 1 + 0.3 * (avg / m - 1)));
  const meta = await sharp(input).metadata();
  const w = meta.orientation && meta.orientation >= 5 ? meta.height : meta.width;
  const targetW = w <= 800 ? Math.round(w * 1.5) : Math.min(w, 1440);
  return base
    .linear([gain(r), gain(g), gain(b)], [0, 0, 0])
    .normalise({ lower: 0.4, upper: 99.6 })
    .resize({ width: targetW, kernel: "lanczos3" })
    .sharpen({ sigma: 0.7, m1: 0.6, m2: 1.4 });
}

async function processPhotos() {
  const entries = [];
  const counters = {};
  for (const p of PHOTOS) {
    let input;
    let originalRel;
    if (p.src) {
      input = original(...p.src);
      originalRel = rel(input);
    } else {
      // Still frame pulled from a client video, cropped to 3:4 to match the photos.
      const [folder, index, t] = p.video;
      const vid = original(folder, index);
      originalRel = `${rel(vid)} @ ${t}s`;
      input = path.join(TMP, `${p.key}.png`);
      ff(["-ss", String(t), "-i", vid, "-frames:v", "1", "-vf", "crop=iw:iw*4/3", input]);
    }
    counters[p.name] = (counters[p.name] || 0) + 1;
    const file = `${p.name}-gold-rr-remodeling.jpg`;
    const out = path.join(OUT_PHOTOS, file);
    const pipeline = await gradePhoto(input);
    const info = await pipeline.clone().jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(out);
    const blur = await pipeline.clone().resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
    // Dominant colour, used for brand palette notes.
    const { dominant } = await sharp(out).stats();
    entries.push({
      key: p.key,
      src: `/media/photos/${file}`,
      width: info.width,
      height: info.height,
      category: p.category,
      stage: p.stage,
      project: p.project,
      alt: { en: p.en, es: p.es },
      blur: `data:image/webp;base64,${blur.toString("base64")}`,
      original: originalRel,
      dominant: `#${[dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("")}`,
      bytes: info.size,
    });
    console.log("photo", file, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
  }
  return entries;
}

// ── Videos ───────────────────────────────────────────────────────────────────
const GRADE = "eq=contrast=1.05:saturation=1.07:gamma=0.98,colorbalance=rm=0.025:bm=-0.03:rh=0.015:bh=-0.02";

/** Cut one segment, stabilize it (two-pass vidstab), grade it, return an intermediate. */
function segment(folder, index, start, dur, w, h, tag) {
  const src = original(folder, index);
  const raw = path.join(TMP, `${tag}-raw.mp4`);
  const out = path.join(TMP, `${tag}.mp4`);
  ff(["-ss", String(start), "-t", String(dur), "-i", src, "-an", "-vf", "fps=30", "-c:v", "libx264", "-crf", "8", "-preset", "veryfast", raw]);
  // vidstab writes/reads its transform file relative to cwd (Windows drive colons break filter args)
  ff(["-i", path.basename(raw), "-vf", "vidstabdetect=shakiness=6:accuracy=12:result=t.trf:fileformat=ascii", "-f", "null", "-"], { cwd: TMP });
  ff(["-i", path.basename(raw), "-vf",
    `vidstabtransform=input=t.trf:smoothing=14:zoom=2:optzoom=1:interpol=bicubic,${GRADE},scale=${w}:${h}:flags=lanczos,unsharp=3:3:0.35,format=yuv420p`,
    "-an", "-c:v", "libx264", "-crf", "8", "-preset", "veryfast", path.basename(out)], { cwd: TMP });
  return out;
}

function encode(input, base, { crf, vp9crf, maxrate }) {
  const mp4 = path.join(OUT_VIDEO, `${base}.mp4`);
  const webm = path.join(OUT_VIDEO, `${base}.webm`);
  ff(["-i", input, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-maxrate", maxrate, "-bufsize", "4M",
    "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4]);
  ff(["-i", input, "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", String(vp9crf), "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-pix_fmt", "yuv420p", webm]);
  return { mp4, webm };
}

async function poster(input, base, t = 0) {
  const png = path.join(TMP, `${base}.png`);
  ff(["-ss", String(t), "-i", input, "-frames:v", "1", png]);
  const out = path.join(OUT_VIDEO, `${base}-poster.jpg`);
  const info = await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
  const blur = await sharp(png).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  return { src: `/media/video/${base}-poster.jpg`, width: info.width, height: info.height, blur: `data:image/webp;base64,${blur.toString("base64")}` };
}

async function processVideos() {
  const inventory = [];
  for (const dir of fs.readdirSync(IMG)) {
    for (const f of fs.readdirSync(path.join(IMG, dir))) {
      if (!/\.(mp4|mov|m4v)$/i.test(f)) continue;
      const p = path.join(IMG, dir, f);
      const j = probe(p);
      const v = j.streams.find((s) => s.codec_type === "video");
      const rot = Math.abs(Number(v.side_data_list?.[0]?.rotation ?? 0)) === 90;
      inventory.push({
        original: rel(p),
        width: rot ? v.height : v.width,
        height: rot ? v.width : v.height,
        fps: v.r_frame_rate,
        duration: Number(Number(j.format.duration).toFixed(2)),
        audio: j.streams.some((s) => s.codec_type === "audio"),
        orientation: "portrait",
      });
    }
  }

  // Hero reel: seamless loop. The first clip is split so the last crossfade lands
  // exactly on the frame the video starts with.
  const X = HERO.xfade;
  const W = 720, H = 1280;
  const segs = HERO.segments.map(([f, i, s, d], n) => ({ file: segment(f, i, s, d, W, H, `hero${n}`), dur: d }));
  const inputs = segs.flatMap((s) => ["-i", s.file]);
  let filter = `[0:v]trim=start=${X},setpts=PTS-STARTPTS[a1];[0:v]trim=end=${X},setpts=PTS-STARTPTS[a0];`;
  let prev = "a1";
  let len = segs[0].dur - X;
  for (let n = 1; n < segs.length; n++) {
    filter += `[${prev}][${n}:v]xfade=transition=fade:duration=${X}:offset=${(len - X).toFixed(3)}[x${n}];`;
    len += segs[n].dur - X;
    prev = `x${n}`;
  }
  filter += `[${prev}][a0]xfade=transition=fade:duration=${X}:offset=${(len - X).toFixed(3)},format=yuv420p[out]`;
  const heroMaster = path.join(MASTERS, "hero-reel-master.mp4");
  ff([...inputs, "-filter_complex", filter, "-map", "[out]", "-an", "-c:v", "libx264", "-crf", "10", "-preset", "medium", heroMaster]);
  encode(heroMaster, "hero-reel-720", { crf: 23, vp9crf: 35, maxrate: "2600k" });
  const heroMobile = path.join(TMP, "hero-mobile.mp4");
  ff(["-i", heroMaster, "-vf", "scale=540:960:flags=lanczos", "-an", "-c:v", "libx264", "-crf", "10", "-preset", "veryfast", heroMobile]);
  encode(heroMobile, "hero-reel-540", { crf: 26, vp9crf: 38, maxrate: "1300k" });
  const heroPoster = await poster(heroMaster, "hero-reel");
  const hero = {
    poster: heroPoster,
    duration: Number(len.toFixed(2)),
    sources: {
      desktop: { webm: "/media/video/hero-reel-720.webm", mp4: "/media/video/hero-reel-720.mp4", width: W, height: H },
      mobile: { webm: "/media/video/hero-reel-540.webm", mp4: "/media/video/hero-reel-540.mp4", width: 540, height: 960 },
    },
  };
  console.log("hero", hero.duration + "s");

  const reels = [];
  for (const r of REELS) {
    const parts = r.cuts.map(([f, i, s, d], n) => segment(f, i, s, d, 576, 1024, `${r.key}${n}`));
    const list = path.join(TMP, `${r.key}.txt`);
    fs.writeFileSync(list, parts.map((p) => `file '${p.replaceAll("\\", "/")}'`).join("\n"));
    const master = path.join(MASTERS, `${r.name}-master.mp4`);
    ff(["-f", "concat", "-safe", "0", "-i", list, "-an", "-c:v", "libx264", "-crf", "10", "-preset", "medium", master]);
    encode(master, r.name, { crf: 25, vp9crf: 37, maxrate: "1800k" });
    const p = await poster(master, r.name, 0.4);
    const duration = r.cuts.reduce((a, c) => a + c[3], 0);
    reels.push({ key: r.key, project: r.project, title: { en: r.en, es: r.es }, duration, poster: p,
      webm: `/media/video/${r.name}.webm`, mp4: `/media/video/${r.name}.mp4`, width: 576, height: 1024 });
    console.log("reel", r.name, duration + "s");
  }
  return { inventory, hero, reels };
}

// ── Hero panels ──────────────────────────────────────────────────────────────
// A generated before→after clip becomes a seamless loop that opens on the finished room:
// the last frame is held, dissolves to the first frame, the transformation plays, and it ends
// on the frame it started with. The poster (and LCP image) is therefore the finished bathroom.
function buildPanelLoop(src, tag) {
  const HOLD = 1.5, X = 0.6, FPS = 24;
  const frames = Number(execFileSync(ffprobeStatic.path, ["-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", src]).toString().trim());
  const last = path.join(TMP, `${tag}-last.png`);
  ff(["-i", src, "-vf", `select=eq(n\\,${frames - 1})`, "-fps_mode", "passthrough", "-frames:v", "1", last]);
  const master = path.join(MASTERS, `hero-panel-${tag}-master.mp4`);
  ff([
    "-loop", "1", "-framerate", String(FPS), "-t", String(HOLD), "-i", last,
    "-i", src,
    "-filter_complex",
    `[0:v]format=yuv420p,setsar=1,settb=AVTB[h];[1:v]fps=${FPS},format=yuv420p,setsar=1,settb=AVTB[m];[h][m]xfade=transition=fade:duration=${X}:offset=${HOLD - X},format=yuv420p[out]`,
    "-map", "[out]", "-an", "-c:v", "libx264", "-crf", "10", "-preset", "medium", master,
  ]);
  return { master, duration: Number((HOLD - X + frames / FPS).toFixed(2)) };
}

async function processPanels() {
  const dir = path.join(IMG, "VIdeoFlow");
  const panels = [];
  for (const [i, p] of HERO_PANELS.entries()) {
    if (p.reel) {
      panels.push({ key: p.key, reel: p.reel });
      continue;
    }
    const file = fs.readdirSync(dir).find((f) => f.includes(p.flow));
    if (!file) throw new Error(`No file containing "${p.flow}" in ${dir}`);
    const { master, duration } = buildPanelLoop(path.join(dir, file), p.key);
    const base = `hero-panel-${p.key}`;
    const wideSrc = path.join(TMP, `${base}-720.mp4`);
    ff(["-i", master, "-vf", "scale=720:1280:flags=lanczos", "-an", "-c:v", "libx264", "-crf", "10", "-preset", "veryfast", wideSrc]);
    encode(wideSrc, `${base}-720`, { crf: 24, vp9crf: 36, maxrate: "2400k" });
    const panel = {
      key: p.key,
      generated: true,
      original: rel(path.join(dir, file)),
      duration,
      poster: await poster(master, base),
      wide: { webm: `/media/video/${base}-720.webm`, mp4: `/media/video/${base}-720.mp4` },
    };
    if (i === 0) {
      // phones only ever load the first panel
      const narrowSrc = path.join(TMP, `${base}-540.mp4`);
      ff(["-i", master, "-vf", "scale=540:960:flags=lanczos", "-an", "-c:v", "libx264", "-crf", "10", "-preset", "veryfast", narrowSrc]);
      encode(narrowSrc, `${base}-540`, { crf: 26, vp9crf: 38, maxrate: "1300k" });
      panel.narrow = { webm: `/media/video/${base}-540.webm`, mp4: `/media/video/${base}-540.mp4` };
    }
    panels.push(panel);
    console.log("panel", base, duration + "s");
  }
  return panels;
}

// ── Run ──────────────────────────────────────────────────────────────────────
const manifestPath = path.join(ROOT, "media-manifest.json");
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
if (doPhotos) manifest.photos = await processPhotos();
if (doVideos) Object.assign(manifest, await processVideos());
if (doPanels) manifest.heroPanels = await processPanels();
manifest.projects = PROJECTS;
manifest.generated = new Date().toISOString();
manifest.notes = [
  "Client photos are 768×1024 WhatsApp exports (five are 1080×1440). They are upscaled 1.5× with Lanczos and must not be displayed wider than ~600 CSS px on desktop.",
  "Client videos are 576×1024 portrait. No landscape or 1080p footage exists, so the hero reel is portrait (720×1280) by design.",
];
for (const dir of [OUT_VIDEO]) {
  if (!fs.existsSync(dir)) continue;
  manifest.videoBytes = Object.fromEntries(fs.readdirSync(dir).map((f) => [f, fs.statSync(path.join(dir, f)).size]));
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

const strip = ({ original, dominant, bytes, ...rest }) => rest;
const ts = `// AUTO-GENERATED by scripts/process-media.mjs — do not edit by hand.
import type { Locale } from "./types";

export type Photo = {
  key: string; src: string; width: number; height: number;
  category: "bathroom" | "tile" | "flooring" | "crew";
  stage: "before" | "progress" | "after";
  project: string; alt: Record<Locale, string>; blur: string;
};
export type Poster = { src: string; width: number; height: number; blur: string };
export type Reel = {
  key: string; project: string; title: Record<Locale, string>; duration: number;
  poster: Poster; webm: string; mp4: string; width: number; height: number;
};

export const photos: Photo[] = ${JSON.stringify((manifest.photos ?? []).map(strip), null, 2)};

export const projects: Record<string, Record<Locale, string>> = ${JSON.stringify(PROJECTS, null, 2)};

export const hero = ${JSON.stringify(manifest.hero ?? null, null, 2)} as const;

export const reels: Reel[] = ${JSON.stringify(manifest.reels ?? [], null, 2)};

/** Hero panels, left to right. Clips marked generated come from Google Flow (see scripts/media-map.mjs). */
export type HeroPanel =
  | { key: string; reel: string }
  | { key: string; generated: true; duration: number; poster: Poster; wide: { webm: string; mp4: string }; narrow?: { webm: string; mp4: string } };
export const heroPanels: HeroPanel[] = ${JSON.stringify((manifest.heroPanels ?? []).map(({ original, ...rest }) => rest), null, 2)};
`;
fs.writeFileSync(path.join(ROOT, "data/media.generated.ts"), ts);
fs.rmSync(TMP, { recursive: true, force: true });
console.log("done");
