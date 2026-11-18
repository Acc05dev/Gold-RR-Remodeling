"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap";
import { track, type TrackEvent } from "@/lib/analytics";

/**
 * Site-wide behaviour that is not tied to one section:
 *  • Lenis smooth scroll, driven by GSAP's ticker and kept in sync with ScrollTrigger
 *  • conversion tracking for anything carrying data-track
 *  • magnetic buttons and the custom cursor (fine pointers only)
 *  • ScrollTrigger refresh after fonts and images settle
 */
export function SiteEffects() {
  const pathname = usePathname();

  // Analytics by delegation: <a data-track="click_call">
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-track]");
      if (el) track(el.dataset.track as TrackEvent, { location: el.dataset.trackAt ?? "", path: window.location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Smooth scroll
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let destroy = () => {};
    let cancelled = false;
    Promise.all([loadGsap(), import("lenis")]).then(([{ gsap, ScrollTrigger }, { default: Lenis }]) => {
      if (cancelled) return;
      const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      (window as unknown as { __lenis?: typeof lenis }).__lenis = lenis;
      destroy = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    });
    return () => {
      cancelled = true;
      destroy();
    };
  }, []);

  // Refresh measurements once fonts and late images are in, and on each navigation
  useEffect(() => {
    let alive = true;
    const refresh = () =>
      loadGsap().then(({ ScrollTrigger }) => {
        if (!alive) return;
        // pinned sections are created by separate components; put them back in page order first
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
    const t = window.setTimeout(refresh, 600);
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });
    return () => {
      alive = false;
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
    };
  }, [pathname]);

  // Scroll progress bar
  useEffect(() => {
    const bar = document.createElement("div");
    bar.className = "progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      bar.remove();
    };
  }, [pathname]);

  // Magnetic buttons + cursor
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let cleanup = () => {};
    let gone = false;
    loadGsap().then(({ gsap }) => {
      if (gone) return;
      const cursor = document.createElement("div");
      cursor.className = "cursor";
      cursor.setAttribute("aria-hidden", "true");
      document.body.appendChild(cursor);
      const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });

      let magnet: HTMLElement | null = null;
      const move = (e: MouseEvent) => {
        cursor.dataset.on = "true";
        xTo(e.clientX);
        yTo(e.clientY);
        const target = e.target as HTMLElement;
        cursor.dataset.active = target.closest("a, button, summary, [data-cursor], input, select, textarea, label") ? "true" : "false";
        const m = target.closest<HTMLElement>("[data-magnetic]");
        if (magnet && magnet !== m) {
          gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.45)" });
          magnet = null;
        }
        if (m) {
          magnet = m;
          const r = m.getBoundingClientRect();
          gsap.to(m, {
            x: (e.clientX - (r.left + r.width / 2)) * 0.22,
            y: (e.clientY - (r.top + r.height / 2)) * 0.3,
            duration: 0.4,
            overwrite: true,
          });
        }
      };
      const leave = () => (cursor.dataset.on = "false");
      window.addEventListener("mousemove", move, { passive: true });
      document.documentElement.addEventListener("mouseleave", leave);
      cleanup = () => {
        window.removeEventListener("mousemove", move);
        document.documentElement.removeEventListener("mouseleave", leave);
        cursor.remove();
      };
    });
    return () => {
      gone = true;
      cleanup();
    };
  }, []);

  return null;
}
