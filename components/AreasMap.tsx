"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

/** Vertical label offsets (in miles) for cities that sit almost on top of each other */
const NUDGE: Record<string, number> = { "fairfield-ca": -0.9, "suisun-city-ca": 1.5 };

export type MapPoint = { slug: string; city: string; lat: number; lng: number; miles: number; href: string };

/**
 * A drawn map of the service area: every city plotted from its real coordinates, with 10-mile
 * rings around Vallejo. It is light, readable and ours. The Google map loads only if the visitor
 * asks for it, so its scripts never weigh on the page.
 */
export function AreasMap({
  points,
  embed,
  labels,
  active,
}: {
  points: MapPoint[];
  embed: string;
  labels: { title: string; load: string; note: string; base: string };
  active?: string;
}) {
  const [live, setLive] = useState(false);
  const base = points.find((p) => p.miles === 0) ?? points[0];

  // Equirectangular projection around the base; plenty accurate at this scale.
  const MI_LAT = 69.0;
  const MI_LNG = 69.0 * Math.cos((base.lat * Math.PI) / 180);
  const pts = points.map((p) => ({ ...p, x: (p.lng - base.lng) * MI_LNG, y: -(p.lat - base.lat) * MI_LAT }));
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const pad = 9;
  // room for the city names on both sides
  const minX = Math.min(...xs) - 17;
  const maxX = Math.max(...xs) + 14;
  const minY = Math.min(...ys) - pad;
  const maxY = Math.max(...ys) + pad;
  const W = maxX - minX;
  const H = maxY - minY;
  const rings = [10, 20, 30];

  if (live) {
    return (
      <div className="amap chamfer">
        <iframe src={embed} title={labels.title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
    );
  }
  return (
    <div className="amap chamfer">
      <svg viewBox={`${minX} ${minY} ${W} ${H}`} role="img" aria-label={labels.title} preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="amap-grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M5 0H0V5" fill="none" stroke="currentColor" strokeWidth="0.06" opacity="0.5" />
          </pattern>
        </defs>
        <rect x={minX} y={minY} width={W} height={H} fill="url(#amap-grid)" />
        {rings.map((r) => (
          <g key={r} className="amap__ring">
            <circle cx={0} cy={0} r={r} />
            <text x={0} y={-r - 0.7} textAnchor="middle">
              {r} mi
            </text>
          </g>
        ))}
        {pts
          .filter((p) => p.miles > 0)
          .map((p) => (
            <line key={p.slug} className="amap__spoke" x1={0} y1={0} x2={p.x} y2={p.y} data-active={p.slug === active || undefined} />
          ))}
        {pts.map((p) => {
          const isBase = p.miles === 0;
          // names go outward from the base; close neighbours are nudged apart
          const left = isBase || p.x < -4;
          const dy = NUDGE[p.slug] ?? 0;
          return (
            <a key={p.slug} href={p.href} className="amap__city" data-base={p.miles === 0 || undefined} data-active={p.slug === active || undefined}>
              {p.miles === 0 ? (
                <path d="M-1.900 1.700V-0.500L0 -2.400L1.900 -0.500V1.700Z" />
              ) : (
                <rect x={p.x - 0.75} y={p.y - 0.75} width={1.5} height={1.5} transform={`rotate(45 ${p.x} ${p.y})`} />
              )}
              <text x={p.x + (left ? -1 : 1) * (isBase ? 3 : 1.9)} y={p.y + 0.55 + dy} textAnchor={left ? "end" : "start"}>
                {p.city}
              </text>
            </a>
          );
        })}
      </svg>
      <div className="amap__foot">
        <p>{labels.note}</p>
        <button
          type="button"
          className="btn btn--line btn--sm"
          onClick={() => {
            track("click_directions", { location: "area-map" });
            setLive(true);
          }}
        >
          {labels.load}
        </button>
      </div>
    </div>
  );
}
