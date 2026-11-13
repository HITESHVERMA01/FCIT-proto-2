/**
 * Centralized Motion & Scroll Tokens for FCIT 2.0
 * Halden-inspired global storytelling adapted to Vela bright theme
 * Easing curve: cubic-bezier(0.22, 0.7, 0.2, 1)
 */

export const FCIT_SCROLL_EASE = 'cubic-bezier(0.22, 0.7, 0.2, 1)';

export const SCROLL_BREAKPOINTS = {
  desktopMin: 768,
  wideMin: 1024,
};

/**
 * Ambient Bowl keyframe tracks mapped over normalized early scroll [0..1]
 * Controls tip arc depth, half horizontal expansion, soft fade dispersion,
 * vertical drift and scale without triggering CSS paint repaints.
 */
export const AMBIENT_BOWL_TRACK_DESKTOP = [
  { p: 0.0, tip: 0.54, half: 0.58, soft: 1.0, scaleX: 1.0, scaleY: 1.0, shiftY: 0, opacity: 0.96 },
  { p: 0.28, tip: 0.66, half: 0.68, soft: 0.92, scaleX: 1.14, scaleY: 1.18, shiftY: -18, opacity: 0.92 },
  { p: 0.62, tip: 0.78, half: 0.82, soft: 0.78, scaleX: 1.34, scaleY: 1.32, shiftY: -54, opacity: 0.76 },
  { p: 1.0, tip: 0.9, half: 0.94, soft: 0.55, scaleX: 1.52, scaleY: 1.44, shiftY: -96, opacity: 0.52 },
];

export const AMBIENT_BOWL_TRACK_MOBILE = [
  { p: 0.0, tip: 0.5, half: 0.55, soft: 0.86, scaleX: 1.0, scaleY: 1.0, shiftY: 0, opacity: 0.72 },
  { p: 0.5, tip: 0.6, half: 0.66, soft: 0.74, scaleX: 1.12, scaleY: 1.1, shiftY: -16, opacity: 0.58 },
  { p: 1.0, tip: 0.68, half: 0.74, soft: 0.62, scaleX: 1.22, scaleY: 1.16, shiftY: -34, opacity: 0.44 },
];

/**
 * Section surface palette sequence across Homepage narrative flow
 */
export const SECTION_SURFACE_TONES = {
  cream: 'bg-fcit-cream',
  ivory: 'bg-fcit-ivory',
  lemon: 'bg-fcit-lemonSoft',
  peach: 'bg-fcit-peachSoft',
  sage: 'bg-fcit-sageSoft',
  rose: 'bg-fcit-roseSoft',
  periwinkle: 'bg-fcit-periwinkle/35',
  periwinkleStrong: 'bg-fcit-periwinkle/45',
};

/**
 * Global character palette stops for StatementReveal
 */
export const STATEMENT_INK_COLORS = {
  muted: '#8B9098',
  warmAccent: '#7B5C12',
  navy: '#0B2747',
  navyDeep: '#011E3E',
};
