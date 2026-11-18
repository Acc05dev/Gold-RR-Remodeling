import type { AreaContent } from "./types";
import vallejo from "./areas/vallejo-ca";
import benicia from "./areas/benicia-ca";
import americanCanyon from "./areas/american-canyon-ca";
import fairfield from "./areas/fairfield-ca";
import suisun from "./areas/suisun-city-ca";
import vacaville from "./areas/vacaville-ca";
import napa from "./areas/napa-ca";
import sonoma from "./areas/sonoma-ca";
import petaluma from "./areas/petaluma-ca";
import santaRosa from "./areas/santa-rosa-ca";
import rohnertPark from "./areas/rohnert-park-ca";

/**
 * Service area. Add, remove or reorder cities here; the index page, the map,
 * the sitemap and JSON-LD areaServed all follow. Each city's copy is in data/areas/.
 */
export const areas: AreaContent[] = [
  vallejo,
  benicia,
  americanCanyon,
  fairfield,
  suisun,
  vacaville,
  napa,
  sonoma,
  petaluma,
  santaRosa,
  rohnertPark,
];

export const areaBySlug = (slug: string) => areas.find((a) => a.slug === slug);
