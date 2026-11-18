import { LOGO } from "@/data/logo.generated";

/**
 * The logo as inline SVG with every part addressable, for animation.
 * Geometry and lettering come from scripts/build-brand.mjs. Do not redraw by hand.
 */
export function LogoArt({ dark = true, idPrefix = "logo", title }: { dark?: boolean; idPrefix?: string; title?: string }) {
  const text = dark ? "#FFFFFF" : "#0E0E0E";
  const { bar } = LOGO;
  return (
    <svg viewBox={`0 0 ${LOGO.width} ${LOGO.height}`} role="img" aria-label={title ?? "Gold R.R Remodeling"}>
      <defs>
        <linearGradient id={`${idPrefix}-bar`} gradientUnits="userSpaceOnUse" x1={bar.gradFrom} y1="348" x2={bar.x + bar.w} y2="364">
          <stop offset="0" stopColor="#E3AB58" />
          <stop offset=".3" stopColor="#DA9E4C" />
          <stop offset=".62" stopColor="#CF9241" />
          <stop offset="1" stopColor="#CA8A30" />
        </linearGradient>
        <clipPath id={`${idPrefix}-bar-clip`}>
          <rect data-logo="bar-progress" x={bar.x} y={bar.y} width={bar.w} height={bar.h} />
        </clipPath>
      </defs>
      <g data-logo="house" fill="none" stroke="#BF9643" strokeWidth={LOGO.stroke} strokeLinejoin="miter" strokeMiterlimit={4}>
        <path data-logo="roof-outer" id={`${idPrefix}-roof-outer`} d={LOGO.lines["roof-outer"]} />
        <path data-logo="roof-inner" id={`${idPrefix}-roof-inner`} d={LOGO.lines["roof-inner"]} />
        <path data-logo="roof-slab" id={`${idPrefix}-roof-slab`} d={LOGO.lines["roof-slab"]} />
      </g>
      <g data-logo="gold-bar" id={`${idPrefix}-gold-bar`} clipPath={`url(#${idPrefix}-bar-clip)`}>
        <rect x={bar.x} y={bar.y} width={bar.gradFrom - bar.x + 1} height={bar.h} fill="#BF9643" />
        <rect x={bar.gradFrom} y={bar.y} width={bar.x + bar.w - bar.gradFrom} height={bar.h} fill={`url(#${idPrefix}-bar)`} />
      </g>
      <path data-logo="letter-g" id={`${idPrefix}-letter-g`} d={LOGO.paths["letter-g"]} fill={text} fillRule="evenodd" />
      <g data-logo="text-old" id={`${idPrefix}-text-old`} fill={text}>
        {LOGO.old.map((d, i) => (
          <path key={i} d={d} fillRule="evenodd" />
        ))}
      </g>
      <g data-logo="text-rr" id={`${idPrefix}-text-rr`} fill="#BF9643">
        <path d={LOGO.paths["text-rr-1"]} fillRule="evenodd" />
        <circle cx="458" cy="257" r="15" />
        <path d={LOGO.paths["text-rr-2"]} fillRule="evenodd" />
      </g>
      <g data-logo="text-remodeling" id={`${idPrefix}-text-remodeling`} fill={text}>
        {LOGO.remodeling.map((d, i) => (
          <path key={i} d={d} fillRule="evenodd" />
        ))}
      </g>
    </svg>
  );
}
