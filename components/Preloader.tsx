"use client";

import { useEffect, useRef } from "react";
import { LogoArt } from "./LogoArt";
import { loadGsap } from "@/lib/gsap";

/**
 * First visit of a session only (html.preloading is set by the inline script in the layout,
 * never for reduced-motion users, never without JS).
 * The roof lines draw, the G drops in, the lettering is unmasked, and the gold bar is a real
 * progress bar: it follows DOM ready → fonts → hero poster → window load. Hard cap: 2.2 s.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("preloading")) return;
    const root = ref.current!;
    let finished = false;
    let progress = 0.12;
    const started = performance.now();
    const MIN = 1500;
    const MAX = 2200;
    let setBar: (v: number) => void = () => {};
    let exit: () => void = () => finish();

    const finish = () => {
      if (finished) return;
      finished = true;
      html.classList.remove("preloading");
      try {
        sessionStorage.setItem("grr-loaded", "1");
      } catch {}
      window.dispatchEvent(new Event("grr:ready"));
    };
    const bump = (v: number) => {
      progress = Math.max(progress, v);
      setBar(progress);
      if (progress >= 1) {
        const wait = Math.max(0, MIN - (performance.now() - started));
        window.setTimeout(() => exit(), wait);
      }
    };

    // Real load milestones
    if (document.readyState !== "loading") bump(0.35);
    else document.addEventListener("DOMContentLoaded", () => bump(0.35), { once: true });
    document.fonts?.ready.then(() => bump(0.6));
    const poster = document.querySelector<HTMLImageElement>("[data-hero-poster]");
    if (poster) {
      if (poster.complete) bump(0.85);
      else poster.addEventListener("load", () => bump(0.85), { once: true });
    }
    if (document.readyState === "complete") bump(1);
    else window.addEventListener("load", () => bump(1), { once: true });
    const cap = window.setTimeout(() => exit(), MAX);

    loadGsap().then(({ gsap }) => {
      if (finished) return;
      const q = (s: string) => root.querySelectorAll<SVGGeometryElement>(s);
      const lines = Array.from(q("[data-logo='house'] path"));
      const barRect = root.querySelector<SVGRectElement>("[data-logo='bar-progress']")!;
      const full = Number(barRect.getAttribute("width"));
      lines.forEach((l) => {
        const len = l.getTotalLength();
        gsap.set(l, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(barRect, { attr: { width: full * progress } });
      setBar = (v) => gsap.to(barRect, { attr: { width: full * v }, duration: 0.45, ease: "power2.out", overwrite: true });
      gsap.set(root.querySelector(".preloader__logo"), { autoAlpha: 1 });

      const tl = gsap.timeline();
      tl.to(lines, { strokeDashoffset: 0, duration: 0.85, ease: "power2.inOut", stagger: 0.12 }, 0)
        .from("[data-logo='letter-g']", { y: -150, autoAlpha: 0, duration: 0.7, ease: "bounce.out" }, 0.3)
        .from("[data-logo='text-old'] path", { yPercent: 120, autoAlpha: 0, duration: 0.45, stagger: 0.05 }, 0.62)
        .from("[data-logo='text-rr'] > *", { xPercent: -60, autoAlpha: 0, duration: 0.5, stagger: 0.07 }, 0.7)
        .from("[data-logo='text-remodeling'] path", { autoAlpha: 0, y: 10, duration: 0.3, stagger: 0.035 }, 0.95);

      exit = () => {
        if (finished) return;
        window.clearTimeout(cap);
        gsap.to(barRect, { attr: { width: full }, duration: 0.2, overwrite: true });
        gsap
          .timeline({ onComplete: finish })
          .to(root.querySelector(".preloader__logo"), { scale: 0.94, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0.12)
          .to(root.querySelector(".preloader__panel--a"), { xPercent: -101, yPercent: -101, duration: 0.75, ease: "power3.inOut" }, 0.3)
          .to(root.querySelector(".preloader__panel--b"), { xPercent: 101, yPercent: 101, duration: 0.75, ease: "power3.inOut" }, 0.3)
          // the hero starts its own entrance while the panels are still opening
          .add(() => window.dispatchEvent(new Event("grr:ready")), 0.36);
      };
      if (progress >= 1) bump(1);
    });

    return () => window.clearTimeout(cap);
  }, []);

  return (
    <div className="preloader" ref={ref} aria-hidden="true">
      <div className="preloader__panel preloader__panel--a" />
      <div className="preloader__panel preloader__panel--b" />
      <div className="preloader__logo" style={{ visibility: "hidden" }}>
        <LogoArt idPrefix="pre" />
      </div>
    </div>
  );
}
