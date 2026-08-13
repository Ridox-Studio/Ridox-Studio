"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";
import { useMotionPrefs } from "@/app/components/providers/MotionProvider";

/**
 * Single source of truth for "should this component animate?".
 *
 * Returns true when the user has `prefers-reduced-motion: reduce` OR has opted
 * into minimal mode (Section 12.3). Every animated component gates on this and
 * falls back to a plain opacity fade.
 */
export function useReducedMotion(): boolean {
  const framerReduce = useFramerReducedMotion();
  const { minimal } = useMotionPrefs();
  return Boolean(framerReduce) || minimal;
}
