// Small helpers every animation checks first, so motion is always optional.

// True when the visitor asked their system for less motion.
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// True on a laptop/desktop mouse or trackpad. Cursor effects are skipped on touch screens.
export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Keep a number between -max and +max.
export const clamp = (n: number, max: number) => Math.max(-max, Math.min(max, n));
