// Single source of truth for how the client's original files (Img/) map to site media.
// Originals are never modified. `src` = [folder number, index of the file inside the
// folder when file names are sorted A→Z, 1-based]. Folder 1 is "Nueva carpeta".

export const PROJECTS = {
  "walk-in-shower": {
    en: "Walk-in shower with pebble floor",
    es: "Regadera abierta con piso de piedra",
  },
  "tub-surround": {
    en: "Tub surround, sliding glass and lit mirror",
    es: "Tina con azulejo, puerta de vidrio y espejo con luz",
  },
  "blue-tile-shower": {
    en: "Blue tile shower with brass fixtures",
    es: "Regadera de azulejo azul con llaves doradas",
  },
  "slate-shower": {
    en: "Slate tile bath with stacked-stone wall",
    es: "Baño en pizarra con muro de piedra",
  },
  "double-vanity-bath": {
    en: "Primary bath floor and bench shower",
    es: "Piso de baño principal y regadera con banca",
  },
  "porcelain-floor": {
    en: "Large-format porcelain floor and stairs",
    es: "Piso y escalones de porcelanato gran formato",
  },
  "plank-floors": {
    en: "Vinyl plank bedroom floors",
    es: "Pisos de vinil en recámaras",
  },
  "on-site": { en: "On the job", es: "En la obra" },
};

const BY = "Gold R.R Remodeling, Vallejo, CA";
const POR = "Gold R.R Remodeling, Vallejo, CA";

/** category: bathroom | tile | flooring | crew ; stage: before | progress | after */
export const PHOTOS = [
  // ── Walk-in shower (same bathroom documented start to finish) ──────────────
  { key: "walkin-before", src: [19, 1], name: "bathroom-before-pink-tile-tub", category: "bathroom", stage: "before", project: "walk-in-shower",
    en: `Original bathroom with pink tile tub surround before the remodel by ${BY}`, es: `Baño original con tina de azulejo rosa antes de la remodelación de ${POR}` },
  { key: "walkin-demo", video: [14, 1, 24.5], name: "bathroom-demolition-to-studs", category: "bathroom", stage: "progress", project: "walk-in-shower",
    en: `Bathroom taken down to the studs and subfloor during a remodel by ${BY}`, es: `Baño demolido hasta la estructura durante una remodelación de ${POR}` },
  { key: "walkin-floor-prep", src: [8, 2], name: "bathroom-floor-leveled-open-framing", category: "bathroom", stage: "progress", project: "walk-in-shower",
    en: `Leveled bathroom floor with wall framing open for new shower plumbing`, es: `Piso de baño nivelado con la estructura abierta para la nueva plomería de la regadera` },
  { key: "walkin-backer", src: [8, 1], name: "shower-cement-backer-board-uncoupling-membrane", category: "tile", stage: "progress", project: "walk-in-shower",
    en: `Cement backer board on shower walls and uncoupling membrane on the floor before tile`, es: `Tablero de cemento en los muros de la regadera y membrana en el piso antes del azulejo` },
  { key: "walkin-waterproof", src: [7, 3], name: "shower-waterproofing-membrane-niches", category: "tile", stage: "progress", project: "walk-in-shower",
    en: `Shower walls, niches and pan coated in waterproofing membrane before tile`, es: `Muros, nichos y base de la regadera impermeabilizados antes de colocar el azulejo` },
  { key: "walkin-waterproof-floor", src: [7, 2], name: "bathroom-floor-tile-leveling-clips", category: "tile", stage: "progress", project: "walk-in-shower",
    en: `Wood-look floor tile set with leveling clips, waterproofed shower beyond`, es: `Azulejo tipo madera colocado con niveladores y la regadera impermeabilizada al fondo` },
  { key: "walkin-niche", src: [7, 1], name: "shower-niche-tile-in-progress", category: "tile", stage: "progress", project: "walk-in-shower",
    en: `Large-format wall tile going up around a recessed shower niche`, es: `Azulejo gran formato alrededor de un nicho de regadera` },
  { key: "walkin-tile", src: [7, 4], name: "shower-wall-tile-installation", category: "tile", stage: "progress", project: "walk-in-shower",
    en: `Shower wall tile being set with spacers over a finished pebble shower floor`, es: `Azulejo de muro en proceso sobre el piso de piedra de la regadera ya terminado` },
  { key: "walkin-after-shower", src: [16, 2], name: "walk-in-tile-shower-pebble-floor-glass-panel", category: "bathroom", stage: "after", project: "walk-in-shower",
    en: `Walk-in tile shower with pebble floor, glass panel and rain head, remodel by ${BY}`, es: `Regadera abierta con piso de piedra, panel de vidrio y regadera de lluvia, obra de ${POR}` },
  { key: "walkin-after-room", src: [16, 5], name: "bathroom-remodel-walk-in-shower-skylight", category: "bathroom", stage: "after", project: "walk-in-shower",
    en: `Finished bathroom remodel with walk-in shower, gray vanity and wood-look tile floor`, es: `Baño terminado con regadera abierta, mueble gris y piso de azulejo tipo madera` },
  { key: "walkin-after-vanity", src: [16, 4], name: "bathroom-vanity-toilet-glass-shower", category: "bathroom", stage: "after", project: "walk-in-shower",
    en: `New gray vanity, toilet and glass shower in a remodeled bathroom`, es: `Mueble gris nuevo, sanitario y regadera con vidrio en un baño remodelado` },
  { key: "walkin-after-niche", src: [16, 3], name: "tile-shower-double-niche", category: "tile", stage: "after", project: "walk-in-shower",
    en: `Tile shower wall with a stacked double niche and pebble floor`, es: `Muro de regadera con doble nicho y piso de piedra` },
  { key: "walkin-after-door", src: [16, 6], name: "bathroom-remodel-from-doorway", category: "bathroom", stage: "after", project: "walk-in-shower",
    en: `Remodeled bathroom seen from the doorway, shower at the far end`, es: `Baño remodelado visto desde la puerta, con la regadera al fondo` },
  { key: "walkin-after-pebble", src: [16, 7], name: "pebble-shower-floor-detail", category: "tile", stage: "after", project: "walk-in-shower",
    en: `Pebble-stone shower floor meeting large-format wall tile`, es: `Piso de piedra de río junto al azulejo de muro gran formato` },
  { key: "walkin-after-glass", src: [16, 1], name: "glass-shower-panel-wood-look-tile", category: "bathroom", stage: "after", project: "walk-in-shower",
    en: `Frameless glass shower panel beside the toilet on a wood-look tile floor`, es: `Panel de vidrio sin marco junto al sanitario sobre piso tipo madera` },

  // ── Tub surround / lit mirror ──────────────────────────────────────────────
  { key: "tub-before-door", src: [15, 4], name: "bathroom-before-pink-floor-tile", category: "bathroom", stage: "before", project: "tub-surround",
    en: `Hall bathroom with pink floor tile and white vanity before the remodel`, es: `Baño con piso rosa y mueble blanco antes de la remodelación` },
  { key: "tub-before-vanity", src: [15, 3], name: "bathroom-before-old-vanity", category: "bathroom", stage: "before", project: "tub-surround",
    en: `Old vanity top and pink tile floor before the remodel`, es: `Mueble viejo y piso rosa antes de la remodelación` },
  { key: "tub-after-door", src: [15, 2], name: "bathroom-remodel-navy-vanity-gray-tile", category: "bathroom", stage: "after", project: "tub-surround",
    en: `Remodeled hall bathroom with navy vanity, stone-look top and gray floor tile by ${BY}`, es: `Baño remodelado con mueble azul marino, cubierta tipo piedra y piso gris, obra de ${POR}` },
  { key: "tub-after-mirror", src: [15, 1], name: "bathroom-vanity-led-mirror", category: "bathroom", stage: "after", project: "tub-surround",
    en: `Navy vanity under a round backlit mirror in a remodeled bathroom`, es: `Mueble azul marino bajo un espejo redondo con luz en un baño remodelado` },
  { key: "tub-after-tub", src: [15, 5], name: "bathtub-tile-surround-niche", category: "bathroom", stage: "after", project: "tub-surround",
    en: `New bathtub with gray tile surround, recessed niche and matching floor tile`, es: `Tina nueva con azulejo gris, nicho y piso a juego` },
  { key: "tub-after-glass", src: [15, 6], name: "bathtub-sliding-glass-door-tile-surround", category: "bathroom", stage: "after", project: "tub-surround",
    en: `Tub with sliding glass doors, grab bar and tiled surround`, es: `Tina con puertas corredizas de vidrio, barra de apoyo y muros de azulejo` },

  // ── Blue tile shower ───────────────────────────────────────────────────────
  { key: "blue-before", src: [11, 1], name: "bathroom-before-mauve-tile", category: "bathroom", stage: "before", project: "blue-tile-shower",
    en: `Bathroom with mauve floor and wall tile before the remodel`, es: `Baño con azulejo malva en piso y muros antes de la remodelación` },
  { key: "blue-pan", src: [2, 1], name: "shower-pan-waterproofing-floor-tile", category: "tile", stage: "progress", project: "blue-tile-shower",
    en: `Waterproofed shower walls and curb with new floor tile set on spacers`, es: `Muros y borde de regadera impermeabilizados con el piso nuevo en proceso` },
  { key: "blue-tile-progress", src: [2, 2], name: "blue-subway-tile-shower-installation", category: "tile", stage: "progress", project: "blue-tile-shower",
    en: `Blue glazed tile going up on shower walls with leveling clips`, es: `Azulejo azul esmaltado subiendo en los muros con niveladores` },
  { key: "blue-after", video: [11, 2, 6.0], name: "blue-tile-shower-brass-fixtures", category: "bathroom", stage: "after", project: "blue-tile-shower",
    en: `Finished walk-in shower in blue glazed tile with brass fixtures by ${BY}`, es: `Regadera terminada en azulejo azul con llaves doradas, obra de ${POR}` },
  { key: "blue-after-sink", video: [11, 2, 17.2], name: "bathroom-brass-sink-wood-vanity", category: "bathroom", stage: "after", project: "blue-tile-shower",
    en: `Brass sink on a wood vanity beside the blue tile shower`, es: `Lavabo dorado sobre mueble de madera junto a la regadera azul` },

  // ── Slate bath ─────────────────────────────────────────────────────────────
  { key: "slate-before", src: [1, 4], name: "bathroom-before-framed-shower", category: "bathroom", stage: "before", project: "slate-shower",
    en: `Small bathroom with a brass-framed shower enclosure before the remodel`, es: `Baño pequeño con cancel de marco dorado antes de la remodelación` },
  { key: "slate-before-door", src: [1, 1], name: "bathroom-before-wood-vanity", category: "bathroom", stage: "before", project: "slate-shower",
    en: `Narrow bathroom with wood vanity and shower curtain before the remodel`, es: `Baño angosto con mueble de madera y cortina antes de la remodelación` },
  { key: "slate-after", src: [1, 3], name: "slate-tile-bathroom-mosaic-border", category: "bathroom", stage: "after", project: "slate-shower",
    en: `Slate-look wall tile with a mosaic border and compact vanity, remodel by ${BY}`, es: `Azulejo tipo pizarra con cenefa de mosaico y mueble compacto, obra de ${POR}` },
  { key: "slate-after-stone", src: [1, 2], name: "bathroom-stacked-stone-shower-wall", category: "bathroom", stage: "after", project: "slate-shower",
    en: `Stacked-stone shower wall beside the toilet in a remodeled bathroom`, es: `Muro de piedra apilada junto al sanitario en un baño remodelado` },
  { key: "slate-shower", src: [13, 2], name: "slate-tile-shower-corner-shelf", category: "tile", stage: "after", project: "slate-shower",
    en: `Slate-look shower with corner shelf, dark fixtures and pebble floor`, es: `Regadera tipo pizarra con repisa esquinera, llaves oscuras y piso de piedra` },
  { key: "slate-pebble", src: [13, 3], name: "pebble-shower-floor-slate-tile", category: "tile", stage: "after", project: "slate-shower",
    en: `Sliced pebble shower floor framed by slate-look tile`, es: `Piso de regadera en piedra de río enmarcado por azulejo tipo pizarra` },
  { key: "slate-pebble-progress", src: [13, 5], name: "pebble-shower-floor-installation", category: "tile", stage: "progress", project: "slate-shower",
    en: `Pebble shower floor being set by hand before grout`, es: `Piso de piedra de la regadera colocándose a mano antes de la lechada` },

  // ── Primary bath floor + bench shower ──────────────────────────────────────
  { key: "double-floor", src: [3, 1], name: "bathroom-porcelain-floor-double-vanity", category: "tile", stage: "after", project: "double-vanity-bath",
    en: `New vein-cut porcelain floor in a primary bath with double vanity`, es: `Piso nuevo de porcelanato en baño principal con doble lavabo` },
  { key: "double-threshold", src: [3, 3], name: "tile-floor-threshold-transition", category: "tile", stage: "after", project: "double-vanity-bath",
    en: `Porcelain bathroom floor with new baseboards and a clean transition to wood flooring`, es: `Piso de porcelanato con zoclo nuevo y transición limpia al piso de madera` },
  { key: "bench-pan", src: [12, 1], name: "shower-pan-liner-framing", category: "tile", stage: "progress", project: "double-vanity-bath",
    en: `Shower pan liner installed in new framing with a built-in bench`, es: `Membrana de la base de regadera instalada con banca integrada` },
  { key: "bench-backer", src: [12, 3], name: "shower-bench-cement-board", category: "tile", stage: "progress", project: "double-vanity-bath",
    en: `Cement board with taped seams on shower walls and bench before waterproofing`, es: `Tablero de cemento con juntas selladas en muros y banca antes de impermeabilizar` },
  { key: "bench-after", src: [12, 2], name: "tile-shower-bench-pebble-floor", category: "bathroom", stage: "after", project: "double-vanity-bath",
    en: `White tile shower with a slab-top bench and mosaic stone floor by ${BY}`, es: `Regadera de azulejo blanco con banca y piso de mosaico de piedra, obra de ${POR}` },

  // ── Porcelain floor + stairs ───────────────────────────────────────────────
  { key: "marble-floor", src: [6, 1], name: "large-format-porcelain-tile-floor", category: "flooring", stage: "after", project: "porcelain-floor",
    en: `Marble-look large-format porcelain floor running to tiled stairs`, es: `Piso de porcelanato gran formato tipo mármol hasta los escalones` },
  { key: "marble-progress", src: [6, 2], name: "floor-tile-uncoupling-membrane-installation", category: "flooring", stage: "progress", project: "porcelain-floor",
    en: `Large-format floor tile going down over uncoupling membrane with leveling clips`, es: `Porcelanato gran formato sobre membrana con niveladores, en proceso` },
  { key: "marble-stairs", src: [6, 3], name: "porcelain-tile-stair-treads", category: "flooring", stage: "after", project: "porcelain-floor",
    en: `Stair treads and risers wrapped in marble-look porcelain tile`, es: `Escalones revestidos en porcelanato tipo mármol` },

  // ── Plank floors ───────────────────────────────────────────────────────────
  { key: "plank-before", src: [10, 3], name: "bedroom-subfloor-before-flooring", category: "flooring", stage: "before", project: "plank-floors",
    en: `Bedroom stripped to the subfloor before new flooring`, es: `Recámara con el piso retirado antes de instalar el nuevo` },
  { key: "plank-after", src: [10, 2], name: "vinyl-plank-flooring-bedroom", category: "flooring", stage: "after", project: "plank-floors",
    en: `New wood-look plank flooring with baseboards in a bedroom by ${BY}`, es: `Piso nuevo tipo madera con zoclo en una recámara, obra de ${POR}` },
  { key: "plank-closet", src: [10, 4], name: "plank-flooring-closet-wall", category: "flooring", stage: "after", project: "plank-floors",
    en: `Plank flooring run tight to the closet track and baseboards`, es: `Piso de duela ajustado al riel del clóset y al zoclo` },
  { key: "plank-hall", src: [10, 1], name: "plank-flooring-doorway-transition", category: "flooring", stage: "after", project: "plank-floors",
    en: `Plank flooring continuing through a doorway into the bedroom`, es: `Piso de duela que continúa por la puerta hacia la recámara` },
  { key: "plank-room", src: [4, 1], name: "wood-look-plank-floor-bedroom", category: "flooring", stage: "after", project: "plank-floors",
    en: `Wood-look plank floor in a bedroom with crown molding`, es: `Piso tipo madera en una recámara con moldura de corona` },
  { key: "plank-room-b", src: [4, 2], name: "plank-floor-bedroom-window", category: "flooring", stage: "after", project: "plank-floors",
    en: `Finished plank floor across a bedroom, baseboards reinstalled`, es: `Piso de duela terminado en una recámara con el zoclo reinstalado` },

  // ── Crew ───────────────────────────────────────────────────────────────────
  { key: "crew-saw", video: [17, 1, 10.5], name: "cutting-tile-wet-saw-on-site", category: "crew", stage: "progress", project: "on-site",
    en: `Cutting mosaic tile on a wet saw outside the house to keep dust out`, es: `Cortando mosaico en la sierra de agua afuera de la casa para no meter polvo` },
  { key: "crew-mosaic", video: [17, 1, 62.5], name: "hex-mosaic-tile-dry-layout", category: "crew", stage: "progress", project: "on-site",
    en: `Hex mosaic sheets dry-laid and cut to shape before installation`, es: `Hojas de mosaico hexagonal presentadas y cortadas a medida antes de instalar` },
];

/** [folder, index, start seconds, duration seconds] */
export const HERO = {
  xfade: 0.5,
  segments: [
    [11, 2, 4.5, 3.6],
    [5, 1, 21.0, 3.6],
    [18, 1, 33.5, 3.6],
    [17, 1, 9.0, 3.2],
  ],
};

export const REELS = [
  { key: "blue-tile-shower", name: "reel-blue-tile-shower-brass-fixtures", project: "blue-tile-shower", cuts: [[11, 2, 2.5, 6], [11, 2, 15, 3.5]],
    en: "Blue tile shower with brass fixtures", es: "Regadera de azulejo azul con llaves doradas" },
  { key: "walk-in-shower", name: "reel-walk-in-shower-pebble-floor", project: "walk-in-shower", cuts: [[5, 1, 9.5, 3], [5, 1, 20.5, 4.8]],
    en: "Walk-in shower with pebble floor", es: "Regadera abierta con piso de piedra" },
  { key: "tub-surround", name: "reel-tub-surround-led-mirror", project: "tub-surround", cuts: [[18, 1, 33, 4.5], [18, 1, 45.5, 3], [18, 1, 64, 4]],
    en: "Tub surround, sliding glass and lit mirror", es: "Tina con azulejo, vidrio y espejo con luz" },
  { key: "on-site", name: "reel-cutting-tile-on-site", project: "on-site", cuts: [[17, 1, 6, 5.5], [17, 1, 60, 5]],
    en: "Cutting and laying out mosaic tile", es: "Corte y presentación del mosaico" },
  { key: "demolition", name: "reel-bathroom-demolition-shower-pan", project: "walk-in-shower", cuts: [[14, 1, 21, 6], [9, 1, 1, 3.5]],
    en: "Down to the studs, then the shower pan", es: "Hasta la estructura y luego la base de la regadera" },
];

/**
 * Hero panels, left to right. The first one is also the single panel shown on phones.
 *   { flow: "<part of the file name in Img/VIdeoFlow>" }  a generated before→after clip
 *   { reel: "<key from REELS>" }                           one of the client's own clips
 * The generated clips were made with Google Flow from the client's real before and after photos
 * (see flow-frames/): the first and last frames are real, everything in between is generated.
 */
export const HERO_PANELS = [
  { key: "tub-to-walk-in-shower", flow: "bc9fa081" },
  { key: "hall-bathroom", flow: "0a1730de" },
  { key: "blue-tile-shower", reel: "blue-tile-shower" },
];
