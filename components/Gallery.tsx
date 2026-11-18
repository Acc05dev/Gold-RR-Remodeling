"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronIcon, CloseIcon } from "./Icons";

export type GalleryItem = {
  key: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  blur: string;
  category: string;
  stage: string;
  project: string;
};
type Labels = {
  categories: Record<string, string>;
  stages: Record<string, string>;
  open: string;
  close: string;
  previous: string;
  next: string;
  count: string;
  empty: string;
  of: string;
};

/**
 * Photo grid with optional filters and a lightbox.
 * Lightbox: native <dialog> (focus is trapped and restored by the browser), arrow keys, swipe.
 */
export function Gallery({ items, labels, filters = false }: { items: GalleryItem[]; labels: Labels; filters?: boolean }) {
  const [cat, setCat] = useState("all");
  const [stage, setStage] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef<number | null>(null);

  const shown = useMemo(
    () => items.filter((i) => (cat === "all" || i.category === cat) && (stage === "all" || i.stage === stage)),
    [items, cat, stage],
  );
  const cats = useMemo(() => ["all", ...new Set(items.map((i) => i.category))], [items]);
  const stages = ["all", "after", "progress", "before"];

  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + shown.length) % shown.length)), [shown.length]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, step]);

  const current = open !== null ? shown[open] : null;

  return (
    <div className="gallery">
      {filters && (
        <div className="filters">
          <div role="group" aria-label={labels.categories.label}>
            {cats.map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>
                {labels.categories[c] ?? c}
              </button>
            ))}
          </div>
          <div role="group" aria-label={labels.stages.label}>
            {stages.map((s) => (
              <button key={s} type="button" aria-pressed={stage === s} onClick={() => setStage(s)}>
                {labels.stages[s]}
              </button>
            ))}
          </div>
          <p className="filters__count" aria-live="polite">
            {labels.count.replace("{count}", String(shown.length))}
          </p>
        </div>
      )}

      {shown.length === 0 ? (
        <p className="gallery__empty">{labels.empty}</p>
      ) : (
        <ul className="gallery__grid" data-stagger={filters ? undefined : ""}>
          {shown.map((p, i) => (
            <li key={p.key} data-drift={filters ? undefined : i % 2 ? "-7" : "7"}>
              <button type="button" className="gcard" onClick={() => setOpen(i)} aria-label={`${labels.open}: ${p.alt}`}>
                <span className="gcard__img chamfer" data-wipe={filters ? undefined : ""}>
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    sizes="(max-width: 639px) 46vw, (max-width: 1099px) 30vw, 300px"
                    placeholder="blur"
                    blurDataURL={p.blur}
                    loading="lazy"
                  />
                </span>
                {p.stage !== "after" && <span className="gcard__tag">{labels.stages[p.stage]}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialog}
        className="lightbox"
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === dialog.current && setOpen(null)}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        {current && (
          <figure>
            <Image
              key={current.key}
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="(max-width: 899px) 94vw, 620px"
              placeholder="blur"
              blurDataURL={current.blur}
            />
            <figcaption>
              <span>{current.alt}</span>
              <span className="tall" aria-hidden="true">
                {String((open ?? 0) + 1).padStart(2, "0")}/{String(shown.length).padStart(2, "0")}
              </span>
            </figcaption>
          </figure>
        )}
        <button type="button" className="lightbox__close" onClick={() => setOpen(null)} aria-label={labels.close} autoFocus>
          <CloseIcon />
        </button>
        <button type="button" className="lightbox__prev" onClick={() => step(-1)} aria-label={labels.previous}>
          <ChevronIcon style={{ transform: "rotate(180deg)" }} />
        </button>
        <button type="button" className="lightbox__next" onClick={() => step(1)} aria-label={labels.next}>
          <ChevronIcon />
        </button>
      </dialog>
    </div>
  );
}
