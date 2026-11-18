"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { prefersReducedMotion } from "@/lib/gsap";

export type BAPair = {
  key: string;
  title: string;
  before: { src: string; alt: string; blur: string; width: number; height: number };
  after: { src: string; alt: string; blur: string; width: number; height: number };
};

/**
 * Draggable before/after. The divider is a real slider (role="slider", arrow keys, Home/End).
 * The first time it scrolls into view it sweeps across and back once, to show that it moves.
 */
export function BeforeAfter({
  pairs,
  labels,
}: {
  pairs: BAPair[];
  labels: { before: string; after: string; handle: string; choose: string };
}) {
  const [index, setIndex] = useState(0);
  const [pos, setPos] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const demoed = useRef(false);
  const pair = pairs[index];

  const setFromClientX = (x: number) => {
    const r = frame.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100)));
  };

  // One demo sweep on first view
  useEffect(() => {
    const el = frame.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || demoed.current) return;
        demoed.current = true;
        io.disconnect();
        const t0 = performance.now();
        const D = 2400;
        const tick = (t: number) => {
          if (dragging.current) return;
          const p = Math.min(1, (t - t0) / D);
          // 50 → 14 → 86 → 50
          const wave = Math.sin(p * Math.PI * 2);
          setPos(50 - wave * 36 * (1 - p * 0.15));
          if (p < 1) raf = requestAnimationFrame(tick);
          else setPos(50);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <div className="ba">
      <div
        className="ba__frame chamfer"
        ref={frame}
        style={{ "--pos": `${pos}%` } as React.CSSProperties}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        data-cursor
      >
        <Image
          key={`a-${pair.key}`}
          src={pair.after.src}
          alt={pair.after.alt}
          width={pair.after.width}
          height={pair.after.height}
          sizes="(max-width: 899px) 92vw, 520px"
          placeholder="blur"
          blurDataURL={pair.after.blur}
          draggable={false}
        />
        <div className="ba__before">
          <Image
            key={`b-${pair.key}`}
            src={pair.before.src}
            alt={pair.before.alt}
            width={pair.before.width}
            height={pair.before.height}
            sizes="(max-width: 899px) 92vw, 520px"
            placeholder="blur"
            blurDataURL={pair.before.blur}
            draggable={false}
          />
        </div>
        <span className="ba__tag ba__tag--before" aria-hidden="true">
          {labels.before}
        </span>
        <span className="ba__tag ba__tag--after" aria-hidden="true">
          {labels.after}
        </span>
        <div
          className="ba__handle"
          role="slider"
          tabIndex={0}
          aria-label={labels.handle}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% ${labels.before}`}
          onKeyDown={onKey}
        >
          <i />
        </div>
      </div>

      <div className="ba__list" role="group" aria-label={labels.choose}>
        {pairs.map((p, i) => (
          <button
            key={p.key}
            type="button"
            aria-pressed={i === index}
            onClick={() => {
              setIndex(i);
              setPos(50);
            }}
          >
            <span className="tall">{String(i + 1).padStart(2, "0")}</span>
            <span>{p.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
