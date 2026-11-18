"use client";

import { useEffect, type RefObject } from "react";
import type { gsap as GsapCore } from "gsap";
import type { ScrollTrigger as ST } from "gsap/ScrollTrigger";
import type { SplitText as SPT } from "gsap/SplitText";

export type GsapBundle = { gsap: typeof GsapCore; ScrollTrigger: typeof ST; SplitText: typeof SPT };

let bundle: Promise<GsapBundle> | null = null;

/** GSAP is loaded once, on demand, after hydration. Nothing here blocks first paint. */
export function loadGsap(): Promise<GsapBundle> {
  bundle ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/SplitText")]).then(
    ([core, st, split]) => {
      core.gsap.registerPlugin(st.ScrollTrigger, split.SplitText);
      core.gsap.defaults({ ease: "power3.out" });
      return { gsap: core.gsap, ScrollTrigger: st.ScrollTrigger, SplitText: split.SplitText };
    },
  );
  return bundle;
}

/** True when this visit runs in the calm mode (set before first paint by the boot script in the layout). */
export const prefersReducedMotion = () =>
  typeof document !== "undefined" && document.documentElement.hasAttribute("data-reduced");

/** Resolves once the preloader has finished (immediately when there is none). */
export function whenSiteReady(cb: () => void) {
  if (typeof document === "undefined") return () => {};
  if (!document.documentElement.classList.contains("preloading")) {
    cb();
    return () => {};
  }
  const on = () => cb();
  window.addEventListener("grr:ready", on, { once: true });
  return () => window.removeEventListener("grr:ready", on);
}

/**
 * Scoped GSAP setup with automatic cleanup (same contract as useGSAP, but lazy-loaded).
 * `setup` runs inside a gsap.context bound to `scope`; everything it creates is reverted on unmount.
 */
export function useGsap(
  scope: RefObject<HTMLElement | null>,
  setup: (b: GsapBundle, env: { reduced: boolean; root: HTMLElement }) => void | (() => void),
  deps: unknown[] = [],
) {
  useEffect(() => {
    let cancelled = false;
    let ctx: ReturnType<typeof GsapCore.context> | undefined;
    let cleanup: void | (() => void);
    const off = whenSiteReady(() => {
      loadGsap().then((b) => {
        const root = scope.current;
        if (cancelled || !root) return;
        ctx = b.gsap.context(() => {
          cleanup = setup(b, { reduced: prefersReducedMotion(), root });
        }, root);
      });
    });
    return () => {
      cancelled = true;
      off();
      if (typeof cleanup === "function") cleanup();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
