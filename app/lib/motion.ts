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

/**
 * The logo's diagonal cut angle, expressed as clip-path polygons.
 *
 * The two halves share the exact same edge (62% at the top, 38% at the bottom)
 * so that closed means *sealed* — no seam, nothing showing through. The slash
 * channel only opens up as the halves travel apart, which is the whole point
 * of the effect.
 */
export const SLASH = {
  /** Left/amber half of a viewport split along the logo's diagonal. */
  amberHalf: "polygon(0% 0%, 62.2% 0%, 38.2% 100%, 0% 100%)",
  /** Right/indigo half — overlaps amberHalf by a hair so no seam can show. */
  indigoHalf: "polygon(61.8% 0%, 100% 0%, 100% 100%, 37.8% 100%)",
} as const;

/**
 * Unit direction of the slash edge, used to slide the two closed halves past
 * each other *along* their shared edge. Moving along the edge keeps the seal
 * intact; moving across it would crack the door open mid-load.
 */
export const SLASH_AXIS = { x: -0.36, y: 0.93 } as const;

/**
 * The Redox Door choreography, shared by the page transition and the initial
 * preloader so both read as the same object.
 *
 * `direction` is 1 for the amber half (exits top-left) and -1 for the indigo
 * half (exits bottom-right).
 */
export function doorVariants(
  direction: 1 | -1,
  closeDuration: number,
  openDuration: number,
): Variants {
  return {
    offscreen: {
      x: `${-110 * direction}%`,
      y: `${-110 * direction}%`,
      transition: { duration: openDuration, ease: EASING.redox },
    },
    closed: {
      x: "0%",
      y: "0%",
      transition: { duration: closeDuration, ease: EASING.redox },
    },
    // The halves pass each other ALONG their shared edge, so the door stays
    // sealed while whatever is behind it loads.
    duality: {
      x: [0, 10 * SLASH_AXIS.x * direction, 0, -10 * SLASH_AXIS.x * direction, 0],
      y: [0, 10 * SLASH_AXIS.y * direction, 0, -10 * SLASH_AXIS.y * direction, 0],
      transition: { duration: 1.6, ease: "easeInOut", repeat: Infinity },
    },
  };
}

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
