import { photos, type Photo } from "./media.generated";

export * from "./media.generated";

const byKey = new Map(photos.map((p) => [p.key, p]));
export function photo(key: string): Photo {
  const p = byKey.get(key);
  if (!p) throw new Error(`Unknown photo key: ${key}`);
  return p;
}

/** Before/after pairs, shot from (nearly) the same spot in the same room. */
export const beforeAfter = [
  { key: "tub-surround", before: "tub-before-vanity", after: "tub-after-mirror" },
  { key: "blue-tile-shower", before: "blue-before", after: "blue-after" },
  { key: "walk-in-shower", before: "walkin-before", after: "walkin-after-shower" },
  { key: "slate-shower", before: "slate-before", after: "slate-after" },
] as const;

/** One bathroom, documented from the first day to the last. It is a real sequence, so order matters. */
export const buildSequence = [
  { id: "before", photo: "walkin-before" },
  { id: "demolition", photo: "walkin-demo" },
  { id: "substrate", photo: "walkin-backer" },
  { id: "waterproofing", photo: "walkin-waterproof" },
  { id: "tile", photo: "walkin-tile" },
  { id: "finished", photo: "walkin-after-room" },
] as const;

/** Home page selection: finished work, in a deliberate order. */
export const homeGallery = [
  "tub-after-door",
  "walkin-after-shower",
  "marble-floor",
  "slate-after",
  "bench-after",
  "plank-after",
  "tub-after-glass",
  "marble-stairs",
];
