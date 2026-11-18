import type { ServiceContent, ServiceSlug } from "./types";
import bathroom from "./services/bathroom-remodeling";
import kitchen from "./services/kitchen-remodeling";
import tile from "./services/tile-installation";
import flooring from "./services/flooring-installation";
import painting from "./services/interior-exterior-painting";
import drywall from "./services/drywall-repair-texture";
import carpentry from "./services/finish-carpentry";
import countertops from "./services/countertops";
import repairs from "./services/repairs-restoration";

export type PatternName =
  | "pebble"
  | "shaker"
  | "subway"
  | "plank"
  | "roller"
  | "orange-peel"
  | "molding"
  | "vein"
  | "patch";

export type Service = ServiceContent & {
  /** Photo keys (data/media.generated.ts) for cards and the service page. Empty = no client photos yet. */
  photos: string[];
  /** Line pattern drawn as the service's swatch. Stands in wherever there is no photo. */
  pattern: PatternName;
};

/**
 * To edit copy, open the matching file in data/services/.
 * To give a service photos, add photo keys here (first key = card image).
 *
 * Every photo is from the client's own jobs. Trades without dedicated photos use the jobs where
 * that work is visible: the bedroom that was patched and repainted (drywall, painting), the rooms
 * with new baseboards and crown molding (carpentry), the vanity tops (countertops), the gut
 * demolition (repairs). Kitchens have no photos yet, so that card shows the drawn material.
 */
export const services: Service[] = [
  {
    ...bathroom,
    pattern: "pebble",
    photos: ["walkin-after-shower", "tub-after-door", "blue-after", "slate-after", "bench-after", "walkin-after-room", "tub-after-glass", "tub-after-mirror"],
  },
  { ...kitchen, pattern: "shaker", photos: [] },
  {
    ...tile,
    pattern: "subway",
    photos: ["walkin-after-niche", "walkin-tile", "slate-pebble", "blue-tile-progress", "walkin-waterproof", "double-floor", "walkin-after-pebble", "slate-shower"],
  },
  {
    ...flooring,
    pattern: "plank",
    photos: ["marble-floor", "plank-after", "marble-stairs", "plank-room", "marble-progress", "plank-closet", "double-threshold", "plank-hall"],
  },
  { ...painting, pattern: "roller", photos: ["plank-after", "plank-room", "plank-closet", "plank-room-b"] },
  { ...drywall, pattern: "orange-peel", photos: ["plank-before", "walkin-floor-prep", "plank-after"] },
  { ...carpentry, pattern: "molding", photos: ["plank-room", "double-threshold", "plank-closet", "plank-hall"] },
  { ...countertops, pattern: "vein", photos: ["tub-after-mirror", "walkin-after-vanity", "bench-after", "tub-after-door"] },
  { ...repairs, pattern: "patch", photos: ["walkin-demo", "walkin-floor-prep", "plank-before", "walkin-backer"] },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const serviceSlugs = services.map((s) => s.slug) as ServiceSlug[];
