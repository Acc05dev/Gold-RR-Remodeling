"use client";

import { useEffect, useRef, useState } from "react";
import { useGsap, whenSiteReady } from "@/lib/gsap";
import { PauseIcon, PlayIcon } from "../Icons";

/**
 * Hero behaviour:
 *  • attaches the looping videos after the page is ready (the poster stays the LCP), only for the
 *    panels that are actually visible at this screen size, and pauses them off screen
 *  • a pause / play button, so the moving background can always be stopped
 *  • the entrance: panels rise like shutters, the title comes up letter by letter, the gold bar
 *    runs out along the floor
 *  • on scroll: the three panels travel at different speeds and the title lifts away
 */
export function HeroMotion({ children, labels }: { children: React.ReactNode; labels: { pause: string; play: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    let io: IntersectionObserver | undefined;
    let timer = 0;
    const attach = () => {
      const narrow = window.matchMedia("(max-width: 899px)").matches;
      const videos = Array.from(root.querySelectorAll<HTMLVideoElement>("[data-hero-video]")).filter((v) => v.offsetParent !== null);
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const v = e.target as HTMLVideoElement;
            if (e.isIntersecting && !pausedRef.current) v.play().catch(() => {});
            else v.pause();
          }
        },
        { threshold: 0.05 },
      );
      videos.forEach((v, i) => {
        const d = v.dataset;
        const webm = (narrow && d.narrowWebm) || d.wideWebm!;
        const mp4 = (narrow && d.narrowMp4) || d.wideMp4!;
        for (const [type, src] of [
          ["video/webm", webm],
          ["video/mp4", mp4],
        ]) {
          const s = document.createElement("source");
          s.type = type;
          s.src = src;
          v.appendChild(s);
        }
        v.addEventListener("playing", () => (v.dataset.on = "true"), { once: true });
        // stagger the downloads so the first panel always wins
        window.setTimeout(() => {
          v.load();
          io!.observe(v);
        }, i * 450);
      });
    };
    const off = whenSiteReady(() => {
      timer = window.setTimeout(attach, 300);
    });
    return () => {
      off();
      window.clearTimeout(timer);
      io?.disconnect();
    };
  }, []);

  const toggle = () => {
    const next = !paused;
    pausedRef.current = next;
    setPaused(next);
    ref.current?.querySelectorAll<HTMLVideoElement>("[data-hero-video]").forEach((v) => {
      if (next) v.pause();
      else if (v.offsetParent !== null && v.querySelector("source")) v.play().catch(() => {});
    });
  };

  useGsap(ref, ({ gsap, SplitText }, { reduced, root }) => {
    const q = gsap.utils.selector(root);
    if (reduced) {
      gsap.from(q("[data-hero-title], [data-hero-fade], [data-hero-card]"), { autoAlpha: 0, duration: 0.6, stagger: 0.07 });
      return;
    }
    const panels = q("[data-hero-panel]");
    const split = new SplitText(q(".hero__line > span"), { type: "chars" });
    const mm = gsap.matchMedia();

    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .fromTo(panels, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.25, ease: "power4.inOut", stagger: 0.14, clearProps: "clipPath" }, 0)
      .from(q("[data-hero-panel] img, [data-hero-panel] video"), { scale: 1.35, duration: 2.2, ease: "power2.out", stagger: 0.14 }, 0)
      .from(split.chars, { yPercent: 115, duration: 0.85, stagger: 0.016 }, 0.35)
      .from(q("[data-hero-fade]"), { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.09 }, 1)
      .from(q("[data-hero-card]"), { y: 60, autoAlpha: 0, duration: 0.9 }, 0.9)
      .from(q("[data-hero-floor]"), { scaleX: 0, transformOrigin: "left center", duration: 1.1, ease: "power3.inOut" }, 0.6)
      .from(q("[data-hero-floor] li"), { autoAlpha: 0, y: 8, duration: 0.4, stagger: 0.06 }, 1.4)
      .from(q(".hero__pause"), { autoAlpha: 0, duration: 0.5 }, 1.6);

    // Scroll: each panel leaves at its own speed, the shade closes in, the title lifts away
    const st = { trigger: root, start: "top top", end: "bottom top", scrub: true };
    mm.add("(min-width: 900px)", () => {
      [-10, -24, -16].forEach((y, i) => panels[i] && gsap.to(panels[i], { yPercent: y, ease: "none", scrollTrigger: st }));
      gsap.to(q(".hero__copy"), { yPercent: -22, autoAlpha: 0.2, ease: "none", scrollTrigger: st });
      gsap.to(q("[data-hero-card]"), { yPercent: -12, ease: "none", scrollTrigger: st });
    });
    mm.add("(max-width: 899px)", () => {
      gsap.to(panels[0], { yPercent: 12, scale: 1.08, ease: "none", scrollTrigger: st });
    });
    gsap.to(q(".hero__shade"), { "--dark": 0.72, ease: "none", scrollTrigger: st });

    return () => {
      split.revert();
      mm.revert();
    };
  });

  return (
    <div ref={ref} className="hero__inner">
      {children}
      <button type="button" className="hero__pause" onClick={toggle} aria-pressed={paused} aria-label={paused ? labels.play : labels.pause}>
        {paused ? <PlayIcon /> : <PauseIcon />}
      </button>
    </div>
  );
}
