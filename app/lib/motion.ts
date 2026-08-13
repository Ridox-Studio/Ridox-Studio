import type { Transition, Variants } from "framer-motion";

/** Shared easing curves — Section 11.1 */
export const EASING = {
  /** Fast start, smooth landing — primary easing for all transitions */
  redox: [0.76, 0, 0.24, 1],
  /** Snappy micro-interactions */
  snap: [0.22, 1, 0.36, 1],
  /** Gentle reveals */
  reveal: [0.16, 1, 0.3, 1],
} as const;

/** Spring-like overshoot for magnetic buttons */
export const MAGNETIC_SPRING: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 15,
  mass: 0.1,
};

/** The logo's diagonal cut angle, expressed as clip-path polygons. */
export const SLASH = {
  /** Left/amber half of a viewport split along the logo's diagonal. */
  amberHalf: "polygon(0% 0%, 62% 0%, 38% 100%, 0% 100%)",
  /** Right/indigo half — mirrors amberHalf across the slash channel. */
  indigoHalf: "polygon(64% 0%, 100% 0%, 100% 100%, 40% 100%)",
} as const;

/**
 * Section entrance — 0.8s, triggered at 20% viewport intersection (Section 11.4).
 * `reduce` swaps the transform for a plain opacity fade.
 */
export function revealVariants(reduce: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduce ? 0 : 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.3 : 0.8, ease: EASING.reveal },
    },
  };
}

/** Staggered child reveal for lists of cards / links. */
export function staggerParent(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

/** Per-element stagger reveal — 0.5s (Section 11.3). */
export function staggerChild(reduce: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.3 : 0.5, ease: EASING.reveal },
    },
  };
}

/**
 * Sliding Duality — the two logo blocks pass each other through the slash
 * channel while the seed dots stay anchored. Used by the preloader (2s cycle)
 * and the Redox Door loading state (1.6s cycle).
 */
export function slidingDuality(distance: number, cycle: number) {
  return {
    amber: {
      animate: { x: [0, distance, 0, -distance, 0], y: [0, -distance, 0, distance, 0] },
      transition: { duration: cycle, ease: "easeInOut" as const, repeat: Infinity },
    },
    indigo: {
      animate: { x: [0, -distance, 0, distance, 0], y: [0, distance, 0, -distance, 0] },
      transition: { duration: cycle, ease: "easeInOut" as const, repeat: Infinity },
    },
  };
}
