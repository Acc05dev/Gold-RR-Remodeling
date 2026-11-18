"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Reel } from "@/data/media";
import type { Locale } from "@/data/types";
import { prefersReducedMotion } from "@/lib/gsap";
import { PauseIcon, PlayIcon, ChevronIcon } from "./Icons";

/**
 * Vertical clips from the job. Nothing downloads until a reel is near the viewport; the one most
 * in view plays muted, the rest pause. Every reel has its own play/pause button.
 */
export function Reels({
  reels,
  locale,
  labels,
}: {
  reels: Reel[];
  locale: Locale;
  labels: { play: string; pause: string; previous: string; next: string; playVideo: string };
}) {
  const track = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [userPaused, setUserPaused] = useState<Set<string>>(new Set());
  const paused = useRef(userPaused);
  useEffect(() => {
    paused.current = userPaused;
  }, [userPaused]);

  useEffect(() => {
    const root = track.current;
    if (!root) return;
    const reduce = prefersReducedMotion();
    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>("video"));
    const ratios = new Map<HTMLVideoElement, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          ratios.set(v, e.intersectionRatio);
          // attach sources lazily
          if (e.isIntersecting && !v.dataset.loaded) {
            v.dataset.loaded = "1";
            for (const [type, src] of [
              ["video/webm", v.dataset.webm!],
              ["video/mp4", v.dataset.mp4!],
            ]) {
              const s = document.createElement("source");
              s.type = type;
              s.src = src;
              v.appendChild(s);
            }
            v.load();
          }
        }
        if (reduce) return;
        let best: HTMLVideoElement | null = null;
        let max = 0.6;
        for (const [v, r] of ratios) if (r > max && !paused.current.has(v.dataset.key!)) [best, max] = [v, r];
        for (const v of videos) {
          if (v === best) v.play().catch(() => {});
          else if (!v.paused) v.pause();
        }
      },
      { threshold: [0, 0.3, 0.6, 0.85, 1], rootMargin: "0px 200px" },
    );
    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  const toggle = (key: string) => {
    const v = track.current?.querySelector<HTMLVideoElement>(`video[data-key="${key}"]`);
    if (!v) return;
    if (v.paused) {
      setUserPaused((s) => {
        const n = new Set(s);
        n.delete(key);
        return n;
      });
      track.current?.querySelectorAll("video").forEach((o) => o !== v && o.pause());
      v.play().catch(() => {});
    } else {
      setUserPaused((s) => new Set(s).add(key));
      v.pause();
    }
  };
  const nudge = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".reel");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 280) + 20), behavior: "smooth" });
  };

  return (
    <div className="reels">
      <div className="reels__track" ref={track} tabIndex={0} data-lenis-prevent-touch>
        {reels.map((r) => (
          <figure className="reel chamfer" key={r.key}>
            <Image src={r.poster.src} alt="" width={r.poster.width} height={r.poster.height} sizes="300px" placeholder="blur" blurDataURL={r.poster.blur} loading="lazy" />
            <video
              data-key={r.key}
              data-webm={r.webm}
              data-mp4={r.mp4}
              muted
              loop
              playsInline
              preload="none"
              width={r.width}
              height={r.height}
              aria-label={r.title[locale]}
              onPlay={() => setPlaying(r.key)}
              onPause={() => setPlaying((p) => (p === r.key ? null : p))}
            />
            <figcaption>{r.title[locale]}</figcaption>
            <button
              type="button"
              className="reel__btn"
              onClick={() => toggle(r.key)}
              aria-label={playing === r.key ? labels.pause : labels.playVideo.replace("{title}", r.title[locale])}
            >
              {playing === r.key ? <PauseIcon /> : <PlayIcon />}
            </button>
          </figure>
        ))}
      </div>
      <div className="reels__nav">
        <button type="button" onClick={() => nudge(-1)} aria-label={labels.previous}>
          <ChevronIcon style={{ transform: "rotate(180deg)" }} />
        </button>
        <button type="button" onClick={() => nudge(1)} aria-label={labels.next}>
          <ChevronIcon />
        </button>
      </div>
    </div>
  );
}
