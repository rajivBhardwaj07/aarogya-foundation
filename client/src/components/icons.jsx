/** Inline stroke icons (no icon-library dependency). 24x24, currentColor. */
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const TruckIcon = (p) => (
  <svg {...base} {...p}><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></svg>
);
export const HeartIcon = (p) => (
  <svg {...base} {...p}><path d="M12 20s-7-4.4-9.2-8.6C1.2 8 3 4.5 6.4 4.5c2 0 3.2 1.2 3.8 2.2C11 6.1 11.7 4.5 13.6 4.5c3.4 0 5.2 3.5 3.6 6.9C18 15.6 12 20 12 20z" /></svg>
);
export const LeafIcon = (p) => (
  <svg {...base} {...p}><path d="M5 19c0-7 5-12 14-12 0 9-5 14-12 14-2 0-2-2-2-2z" /><path d="M9 15c2-2 5-4 8-5" /></svg>
);
export const ShieldIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></svg>
);
export const MenuIcon = (p) => (
  <svg {...base} {...p}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);
export const CloseIcon = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const CheckIcon = (p) => (
  <svg {...base} {...p}><path d="M5 13l4 4L19 7" /></svg>
);
export const ArrowRight = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const MapPin = (p) => (
  <svg {...base} {...p}><path d="M12 21s-6-5.2-6-10a6 6 0 1112 0c0 4.8-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" /></svg>
);
export const CalendarIcon = (p) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></svg>
);
export const DownloadIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3v12M7 11l5 5 5-5M5 21h14" /></svg>
);

export const PROGRAM_ICONS = {
  truck: TruckIcon,
  heart: HeartIcon,
  leaf: LeafIcon,
  shield: ShieldIcon,
};
