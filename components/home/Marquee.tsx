"use client";

import { useEffect, useRef } from "react";
import { useGsap } from "@/lib/gsap";
import { RoofMark } from "../Icons";

/** Travel speed of the band, in pixels per second */
const SPEED = 85;

/**
 * Endless band of the trades. It always moves on its own: the base loop is a plain CSS animation,
 * so it runs in every motion mode and even if the animation library never loads.
 * In full-motion mode GSAP takes the loop over so the band can also speed up and lean with the
 * scroll. It never stops, not even under the pointer (by request).
 */
export function Marquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  // Same reading speed whatever the language or screen: the loop time follows the band's real width.
  useEffect(() => {
    const track = ref.current?.querySelector<HTMLElement>(".marquee__track");
    if (!track) return;
    const set = () => track.style.setProperty("--marquee-time", `${Math.max(12, track.scrollWidth / 2 / SPEED)}s`);
    set();
    document.fonts?.ready.then(set);
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  useGsap(ref, ({ gsap, ScrollTrigger }, { reduced, root }) => {
    if (reduced) return; // calm mode keeps the steady CSS loop
    const track = root.querySelector<HTMLElement>(".marquee__track")!;
    // pick the loop up exactly where the CSS animation has got to, so there is no jump
    const half = track.scrollWidth / 2;
    const at = half ? Math.min(0.999, Math.abs(new DOMMatrixReadOnly(getComputedStyle(track).transform).m41) / half) : 0;
    track.style.animation = "none";
    const loop = gsap.fromTo(track, { xPercent: 0 }, { xPercent: -50, duration: Math.max(12, half / SPEED), ease: "none", repeat: -1 });
    loop.progress(at);
    const skew = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3" });
    let settle: ReturnType<typeof gsap.delayedCall> | undefined;
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = self.getVelocity();
        gsap.to(loop, { timeScale: 1 + Math.min(6, Math.abs(v) / 220), duration: 0.2, overwrite: true });
        skew(gsap.utils.clamp(-9, 9, v / -340));
        settle?.kill();
        settle = gsap.delayedCall(0.25, () => {
          gsap.to(loop, { timeScale: 1, duration: 1.1, overwrite: true });
          skew(0);
        });
      },
    });
    return () => {
      st.kill();
      settle?.kill();
      track.style.animation = "";
    };
  });

  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <li key={i} className={i % 2 ? "is-line" : undefined}>
          <span>{it}</span>
          <RoofMark />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee on-ink" ref={ref}>
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
