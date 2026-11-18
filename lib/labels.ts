import type { getTranslations } from "next-intl/server";

/** Labels for <Gallery>, shared by the home page, the gallery page and service pages. */
export function galleryLabels(t: Awaited<ReturnType<typeof getTranslations>>) {
  return {
    categories: {
      label: t("gallery.title"),
      all: t("gallery.all"),
      bathroom: t("gallery.bathroom"),
      tile: t("gallery.tile"),
      flooring: t("gallery.flooring"),
      crew: t("gallery.crew"),
    },
    stages: {
      label: t("build.stageLabel"),
      all: t("gallery.stageAll"),
      after: t("gallery.stageAfter"),
      progress: t("gallery.stageProgress"),
      before: t("gallery.stageBefore"),
    },
    open: t("gallery.open"),
    close: t("common.close"),
    previous: t("common.previous"),
    next: t("common.next"),
    count: t.raw("gallery.count") as string,
    empty: t("gallery.empty"),
    of: t("common.of"),
  };
}
