import type { SVGProps } from "react";

/** Icons share the logo's construction: square caps, mitred joins, one stroke weight. */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
  "aria-hidden": true,
} as const;

export const PhoneIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />
  </svg>
);
export const TextIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M3 4h18v13H10l-5 4v-4H3z" />
    <path d="M8 9h8M8 12.5h5" />
  </svg>
);
export const MailIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M3 5h18v14H3z" />
    <path d="m3 6 9 7 9-7" />
  </svg>
);
export const EstimateIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M5 3h10l4 4v14H5z" />
    <path d="M9 12h6M9 16h6M9 8h3" />
  </svg>
);
export const PinIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21Z" />
    <path d="M12 7.500v4M10 9.500h4" />
  </svg>
);
export const StarIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="m12 2 3.1 6.6 7.100.900-5.200 5 1.300 7.200L12 18.200 5.700 21.700 7 14.500 1.800 9.500l7.100-.9z" />
  </svg>
);
export const PlayIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M7 4v16l13-8z" />
  </svg>
);
export const PauseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </svg>
);
export const ChevronIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);
export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="m5 5 14 14M19 5 5 19" />
  </svg>
);
/** The double roof from the logo, used as a list tick and separator. */
export const RoofMark = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 28 20" fill="none" stroke="currentColor" strokeWidth={3.4} strokeLinejoin="miter" aria-hidden {...p}>
    <path d="M2 19v-7.500L11.500 2 20 10.500" />
    <path d="M15 4.500 17.500 2 26 10.500" />
  </svg>
);
