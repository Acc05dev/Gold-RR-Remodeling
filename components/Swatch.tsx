import type { PatternName } from "@/data/services";

/**
 * One line drawing per trade, built like the logo: a single gold stroke weight, square ends,
 * straight runs and 45° turns. Each one draws the material itself, the way it would sit on a
 * sample board: pebble shower floor, shaker door, running-bond tile, staggered plank, and so on.
 * Used as the service's mark and as the card face where there are no client photos yet.
 */
export function Swatch({ name, className }: { name: PatternName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 320"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {DRAW[name]}
    </svg>
  );
}

const rows = (n: number, fn: (i: number) => React.ReactNode) => Array.from({ length: n }, (_, i) => fn(i));

// Pebbles: hand-placed rounded stones, like the shower floors in the client's bathrooms
const PEBBLES: [number, number, number, number, number][] = [
  [38, 40, 26, 18, -12], [98, 34, 30, 20, 8], [164, 42, 28, 19, -6], [214, 70, 20, 26, 14],
  [30, 92, 22, 27, 6], [84, 86, 28, 20, -18], [146, 96, 30, 22, 10], [200, 126, 26, 19, -8],
  [46, 146, 30, 20, 14], [108, 142, 24, 26, -4], [162, 156, 28, 18, 20], [216, 180, 18, 26, 0],
  [28, 198, 20, 26, -10], [78, 196, 30, 21, 6], [136, 206, 26, 22, -16], [190, 226, 28, 19, 12],
  [44, 250, 28, 20, -6], [102, 254, 26, 24, 16], [158, 264, 30, 19, -10], [212, 278, 20, 24, 6],
  [30, 298, 22, 16, 10], [84, 302, 28, 14, -4], [140, 306, 24, 12, 8],
];

const DRAW: Record<PatternName, React.ReactNode> = {
  pebble: (
    <g>
      {PEBBLES.map(([cx, cy, rx, ry, r], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx / 1.25} ry={ry / 1.25} transform={`rotate(${r} ${cx} ${cy})`} />
      ))}
    </g>
  ),
  // Shaker cabinet doors with pulls
  shaker: (
    <g>
      {[0, 1].map((c) =>
        [0, 1].map((r) => {
          const x = 22 + c * 104;
          const y = 22 + r * 144;
          return (
            <g key={`${c}${r}`}>
              <path d={`M${x} ${y}h92v132h-92z`} />
              <path d={`M${x + 16} ${y + 16}h60v100h-60z`} />
              <path d={c === 0 ? `M${x + 82} ${y + (r ? 22 : 96)}v18` : `M${x + 10} ${y + (r ? 22 : 96)}v18`} strokeWidth={5} />
            </g>
          );
        }),
      )}
    </g>
  ),
  // Running-bond tile
  subway: (
    <g>
      {rows(9, (r) => (
        <g key={r}>
          <path d={`M0 ${20 + r * 36}H240`} />
          {rows(4, (c) => {
            const x = c * 80 + (r % 2 ? 40 : 0);
            return <path key={c} d={`M${x} ${20 + r * 36}v36`} />;
          })}
        </g>
      ))}
    </g>
  ),
  // Staggered plank floor, seen at the 45° of the roof line
  plank: (
    <g transform="rotate(-45 120 160)">
      {rows(14, (r) => (
        <g key={r}>
          <path d={`M-120 ${-60 + r * 34}H360`} />
          {rows(5, (c) => {
            const x = -120 + c * 118 + ((r * 47) % 118);
            return <path key={c} d={`M${x} ${-60 + r * 34}v34`} />;
          })}
        </g>
      ))}
    </g>
  ),
  // Roller passes: wet edge overlapping the last pass
  roller: (
    <g>
      {rows(5, (i) => {
        const x = 26 + i * 44;
        const top = [30, 62, 22, 78, 44][i];
        return <path key={i} d={`M${x} 320V${top}h32V320`} />;
      })}
      <path d="M26 30h32M70 62h32M114 22h32M158 78h32M202 44h32" strokeWidth={7} />
    </g>
  ),
  // Orange-peel texture: fine, medium and heavy bands, the three finishes offered
  "orange-peel": (
    <g>
      <path d="M0 108H240M0 214H240" />
      {rows(120, (i) => {
        const band = i % 3;
        const x = (i * 53) % 232;
        const y = band * 106 + 10 + ((i * 37) % 88);
        const r = [1.6, 3.2, 5.4][band];
        return <circle key={i} cx={x + 4} cy={y} r={r} fill="currentColor" stroke="none" />;
      })}
    </g>
  ),
  // Crown and base profiles in section, mitred at 45°
  molding: (
    <g>
      <path d="M20 20H220V52H196V76H180L148 108H20z" />
      <path d="M20 20L52 52M220 20L196 44" />
      <path d="M20 300H220V268H204V212H188L172 196H20z" />
      <path d="M20 300L52 268" />
      <path d="M20 136H220M20 168H220" strokeDasharray="2 14" />
    </g>
  ),
  // Stone slab with a vein and a sink cut-out
  vein: (
    <g>
      <path d="M16 16H224V304H16z" />
      <path d="M72 178H168V266H72z" />
      <path d="M120 198v14" strokeWidth={6} />
      <path d="M16 96L60 74L92 104L138 58L176 86L224 40" />
      <path d="M60 74L48 132M138 58L150 20M176 86L196 140L224 128" strokeWidth={1.6} />
    </g>
  ),
  // A drywall patch: cut square, taped seams, feathered edge
  patch: (
    <g>
      <path d="M70 100H170V200H70z" />
      <path d="M50 100H190M50 200H190M70 80V220M170 80V220" strokeDasharray="10 10" strokeWidth={1.8} />
      <path d="M28 58H212V242H28z" strokeDasharray="2 12" />
      <path d="M96 150L112 166L146 132" strokeWidth={6} />
      <path d="M40 282H200M40 300H140" />
    </g>
  ),
};
