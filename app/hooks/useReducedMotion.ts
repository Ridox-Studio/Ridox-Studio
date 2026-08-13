"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";
import { useMotionPrefs } from "@/app/components/providers/MotionProvider";

/**
 * Single source of truth for "should this component animate?".
 *
 * Returns true when the reader has opted into minimal mode (Section 12.3), or
 * when the OS asks for reduced motion and they have not explicitly overridden
 * it. Every animated component gates on this and falls back to a plain fade.
 */
export function useReducedMotion(): boolean {
  const osReduce = useFramerReducedMotion();
  const { minimal, forceFull } = useMotionPrefs();

  if (minimal) return true;
  if (forceFull) return false;
  return Boolean(osReduce);
}
