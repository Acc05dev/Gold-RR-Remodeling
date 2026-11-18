"use client";

import { useRef } from "react";
import { requestRefresh, useGsap } from "@/lib/gsap";

/**
 * Scroll choreography shared by every section, driven by data attributes so the markup stays
 * server-rendered and complete without JavaScript:
 *
 *   data-split        heading: lines rise out of a mask
 *   .bar              the gold rule under a heading runs out from the left
 *   data-wipe         image frame: uncovered by a 45° blade (the roof angle)
 *   data-stagger      children rise in one after another
 *   data-scrub-words  paragraph: words darken as the reader scrolls through it
 *   data-count="13"   number counts up to the value already in the HTML
 *   data-draw         SVG path draws with scroll progress
 *   data-drift="-8"   element drifts by that yPercent across the viewport
 *
 * In calm mode (system "reduce motion", see the boot script in the layout) nothing is pinned,
 * scrubbed or moved: the same elements just fade in.
 */
export function Animate({
  children,
  className,
  as: Tag = "div",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "ul";
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, ({ gsap, SplitText }, { reduced, root }) => {
    if (reduced) {
      // Calm mode: no movement, no pinning, no scrubbing. Things simply fade in as they arrive.
      root.querySelectorAll<HTMLElement>("[data-split], [data-wipe], [data-stagger] > *, .bar").forEach((el) => {
        if (el.closest("[data-animate]") !== root) return;
        gsap.from(el, { autoAlpha: 0, duration: 0.7, ease: "power1.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
      return;
    }
    const splits: { revert(): void }[] = [];
    const within = (el: Element) => el.closest("[data-animate]") === root;
    const own = <T extends Element>(sel: string) => (Array.from(root.querySelectorAll(sel)) as unknown as T[]).filter(within);

    own<HTMLElement>("[data-split]").forEach((el) => {
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 108,
            duration: 0.95,
            stagger: 0.09,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          }),
      });
      splits.push(split);
    });

    own<HTMLElement>(".bar").forEach((el) =>
      gsap.from(el, { scaleX: 0, duration: 1, ease: "power3.inOut", scrollTrigger: { trigger: el, start: "top 92%", once: true } }),
    );

    own<HTMLElement>("[data-wipe]").forEach((el, i) => {
      gsap.fromTo(
        el,
        { clipPath: "polygon(0 0, 0 0, 0 0, 0 0, 0 0)" },
        {
          clipPath: "polygon(0 0, 220% 0, 220% 0, 0 220%, 0 220%)",
          duration: 1.25,
          delay: (i % 4) * 0.08,
          ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onComplete: () => gsap.set(el, { clearProps: "clipPath" }),
        },
      );
      const img = el.querySelector("img, video");
      if (img)
        gsap.from(img, { scale: 1.22, duration: 1.7, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });

    own<HTMLElement>("[data-stagger]").forEach((el) =>
      gsap.from(el.children, {
        y: 34,
        autoAlpha: 0,
        duration: 0.75,
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      }),
    );

    own<HTMLElement>("[data-scrub-words]").forEach((el) => {
      const split = new SplitText(el, { type: "words" });
      splits.push(split);
      gsap.fromTo(
        split.words,
        { opacity: 0.16 },
        { opacity: 1, ease: "none", stagger: 0.5, scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 42%", scrub: 0.6 } },
      );
    });

    own<HTMLElement>("[data-count]").forEach((el) => {
      const end = Number(el.dataset.count);
      const decimals = (el.dataset.count!.split(".")[1] ?? "").length;
      const suffix = el.dataset.suffix ?? "";
      const state = { v: 0 };
      gsap.to(state, {
        v: end,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => (el.textContent = state.v.toFixed(decimals) + suffix),
        onComplete: () => (el.textContent = end.toFixed(decimals) + suffix),
      });
    });

    own<SVGPathElement>("[data-draw]").forEach((el) => {
      const len = el.getTotalLength();
      gsap.fromTo(
        el,
        { strokeDasharray: len, strokeDashoffset: len },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: el.closest("[data-draw-area]") ?? el, start: "top 70%", end: "bottom 62%", scrub: 0.5 },
        },
      );
    });

    own<HTMLElement>("[data-drift]").forEach((el) =>
      gsap.fromTo(
        el,
        { yPercent: -Number(el.dataset.drift) },
        { yPercent: Number(el.dataset.drift), ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      ),
    );

    requestRefresh();
    return () => splits.forEach((s) => s.revert());
  });

  const Comp = Tag as React.ElementType;
  return (
    <Comp ref={ref} className={className} id={id} data-animate="">
      {children}
    </Comp>
  );
}
