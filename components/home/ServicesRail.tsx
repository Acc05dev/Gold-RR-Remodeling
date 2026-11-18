"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/gsap";

/**
 * Desktop: the section pins with its title on top, and the row of tall cards travels sideways
 * with the scroll, each photo opening behind a 45° blade as it arrives.
 * Phones: a native snap carousel. Calm mode on desktop: a plain grid. No pin in either.
 */
export function ServicesRail({ children, intro, hint }: { children: React.ReactNode; intro: React.ReactNode; hint: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(ref, ({ gsap }, { reduced, root }) => {
    if (reduced) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (hover: hover)", () => {
      const track = root.querySelector<HTMLElement>(".rail__track")!;
      root.dataset.pinned = "true";
      const distance = () => Math.max(0, track.scrollWidth - root.clientWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          // Lenis already smooths the scroll; a second smoothing layer here made the row lag and
          // then lurch when the pin released. Track the scroll 1:1 instead.
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      gsap.utils.toArray<HTMLElement>(".scard__face", root).forEach((face) => {
        gsap.fromTo(
          face,
          { clipPath: "polygon(0 0, 0 0, 0 0, 0 0, 0 0)" },
          {
            clipPath: "polygon(0 0, 220% 0, 220% 0, 0 220%, 0 220%)",
            ease: "power2.out",
            scrollTrigger: { trigger: face, containerAnimation: tween, start: "left 96%", end: "left 52%", scrub: true },
          },
        );
        const inner = face.querySelector("img, svg");
        if (inner)
          gsap.fromTo(
            inner,
            { scale: 1.3 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: face, containerAnimation: tween, start: "left 100%", end: "left 30%", scrub: true } },
          );
      });
      gsap.to(root.querySelector(".rail__progress i"), {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: () => `+=${distance()}`, scrub: true },
      });
      return () => {
        delete root.dataset.pinned;
      };
    });
    return () => mm.revert();
  });

  return (
    <div className="rail" ref={ref}>
      <div className="rail__intro">{intro}</div>
      <div className="rail__view">{children}</div>
      <div className="rail__progress" aria-hidden="true">
        <i />
      </div>
      <p className="sr">{hint}</p>
    </div>
  );
}
