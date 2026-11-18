"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGsap } from "@/lib/gsap";

export type Stage = {
  id: string;
  name: string;
  text: string;
  photo: { src: string; alt: string; blur: string; width: number; height: number };
};

/**
 * One bathroom from the first day to the last. The stages are a true sequence, so they are
 * numbered. Each change of stage is cut in by the 45° blade.
 *
 * Wide screens, full motion: the block pins and the scroll itself walks through the six stages,
 * with a gold rail showing how far along the job is. Everywhere else the stages are tabs.
 * Tabs follow the ARIA pattern in both cases: arrow keys move between stages, the panel is announced.
 */
export function BuildSequence({ stages, label, of }: { stages: Stage[]; label: string; of: string }) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef<number>(0);
  const activeRef = useRef(0);
  /** set while the block is scroll-driven: jumps to the scroll position of a stage */
  const scrollToStage = useRef<((i: number) => void) | null>(null);
  const n = stages.length;
  const total = String(n).padStart(2, "0");

  const show = (i: number) => {
    const next = Math.max(0, Math.min(n - 1, i));
    if (next === activeRef.current) return;
    setPrev(activeRef.current);
    activeRef.current = next;
    setActive(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPrev(null), 900);
  };
  const go = (i: number, focus = false) => {
    const next = (i + n) % n;
    if (scrollToStage.current) scrollToStage.current(next);
    else show(next);
    if (focus) tabs.current[next]?.focus();
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  useGsap(root, ({ gsap, ScrollTrigger }, { reduced, root: el }) => {
    if (reduced) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (min-height: 700px)", () => {
      const rail = el.querySelector<HTMLElement>(".build__rail i");
      const st = ScrollTrigger.create({
        trigger: el,
        start: "center center",
        end: () => `+=${n * window.innerHeight * 0.55}`,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          show(Math.floor(self.progress * n * 0.999));
          if (rail) rail.style.transform = `scaleY(${self.progress})`;
        },
      });
      el.dataset.scrolled = "true";
      scrollToStage.current = (i) => {
        const y = st.start + ((st.end - st.start) * (i + 0.5)) / n;
        const lenis = (window as unknown as { __lenis?: { scrollTo(y: number): void } }).__lenis;
        if (lenis) lenis.scrollTo(y);
        else window.scrollTo({ top: y, behavior: "smooth" });
      };
      return () => {
        scrollToStage.current = null;
        delete el.dataset.scrolled;
        st.kill();
      };
    });
    return () => mm.revert();
  });

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") go(active + 1, true);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(active - 1, true);
    else if (e.key === "Home") go(0, true);
    else if (e.key === "End") go(n - 1, true);
    else return;
    e.preventDefault();
  };

  const s = stages[active];
  return (
    <div className="build" ref={root}>
      <div className="build__count" aria-hidden="true">
        <span className="tall build__num" key={active}>
          {String(active + 1).padStart(2, "0")}
        </span>
        <span className="tall build__total">/{total}</span>
      </div>

      <div className="build__frame chamfer">
        {stages.map((st, i) => (
          <div key={st.id} className="build__img" data-state={i === active ? "in" : i === prev ? "out" : "off"}>
            <Image
              src={st.photo.src}
              alt={st.photo.alt}
              width={st.photo.width}
              height={st.photo.height}
              sizes="(max-width: 899px) 92vw, 460px"
              placeholder="blur"
              blurDataURL={st.photo.blur}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="build__side">
        <div className="build__rail" aria-hidden="true">
          <i />
        </div>
        <div role="tablist" aria-label={label} aria-orientation="vertical" className="build__tabs" onKeyDown={onKey}>
          {stages.map((st, i) => (
            <button
              key={st.id}
              ref={(node) => {
                tabs.current[i] = node;
              }}
              role="tab"
              id={`stage-tab-${st.id}`}
              aria-selected={i === active}
              aria-controls="stage-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => go(i)}
            >
              <span className="tall">{String(i + 1).padStart(2, "0")}</span>
              {st.name}
            </button>
          ))}
        </div>
        <div className="build__panel" role="tabpanel" id="stage-panel" aria-labelledby={`stage-tab-${s.id}`} tabIndex={0}>
          <p className="sr">
            {label} {active + 1} {of} {n}
          </p>
          <h3 className="h3">{s.name}</h3>
          <p key={s.id}>{s.text}</p>
        </div>
      </div>
    </div>
  );
}
