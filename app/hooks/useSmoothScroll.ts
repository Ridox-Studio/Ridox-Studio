"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

/**
 * Lenis inertia scrolling (Section 9.2). Disabled entirely under reduced
 * motion or minimal mode, where native scroll is the correct behaviour.
 *
 * Imported inside the effect so Lenis stays out of the first-load bundle;
 * native scroll covers the moment before it arrives.
 */
export function useSmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    let cancelled = false;
    let frame = 0;
    let lenis: import("lenis").default | null = null;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.1,
        // Matches EASING.redox's feel: fast start, long smooth landing.
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
      });
      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, [reduce]);
}
