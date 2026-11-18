import type { L } from "./types";

/**
 * Real Google reviews only. `text` must be the reviewer's exact words, copied from the
 * Google profile. Until it is filled in, the card states what the review is about and
 * links to Google instead of quoting (see CONTENT-TODO.md). Never paraphrase inside quotes.
 */
export type Review = {
  author: string;
  /** Exact review text in its original language, or null if not yet copied from Google */
  text: string | null;
  /** Neutral description of what the review covers. Shown only while `text` is null. */
  topic: L;
  project: L;
};

export const reviews: Review[] = [
  {
    author: "Eric Falk",
    text: null,
    topic: {
      en: "Reviewed an outdated bathroom rebuilt as a modern one, and a primary bath redesigned to use space that was going to waste.",
      es: "Reseñó un baño anticuado convertido en uno moderno y un baño principal rediseñado para aprovechar espacio que se desperdiciaba.",
    },
    project: { en: "Bathroom remodel", es: "Remodelación de baño" },
  },
  {
    author: "Kevin Collins",
    text: null,
    topic: {
      en: "Reviewed a bathroom remodel, start to finish.",
      es: "Reseñó una remodelación de baño, de principio a fin.",
    },
    project: { en: "Bathroom remodel", es: "Remodelación de baño" },
  },
];
