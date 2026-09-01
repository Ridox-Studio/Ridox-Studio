"use client";

import { useMotionPrefs } from "@/app/components/providers/MotionProvider";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

/**
 * Section 7.5 — a soft radial spotlight tracking the cursor across a card.
 * Drop inside a `relative` parent that sets `--mouse-x` / `--mouse-y`.
 * On touch devices the follower is replaced with a fixed-angle sheen (13.7).
 */
export function CursorSpotlight({ accent = "indigo" }: { accent?: "amber" | "indigo" }) {
  const { hasPointer } = useMotionPrefs();
  const reduce = useReducedMotion();
  const ghost = accent === "amber" ? "var(--amber-ghost)" : "var(--indigo-ghost)";

  if (!hasPointer || reduce) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${ghost}, transparent 60%)` }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{
        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${ghost}, transparent 60%)`,
      }}
    />
  );
}
