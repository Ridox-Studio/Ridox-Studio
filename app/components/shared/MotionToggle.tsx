"use client";

import clsx from "clsx";
import { useEffect } from "react";
import { useReducedMotion as useFramerReducedMotion } from "framer-motion";
import { useMotionPrefs, type MotionMode } from "@/app/components/providers/MotionProvider";

const OPTIONS: { mode: MotionMode; label: string }[] = [
  { mode: "auto", label: "Auto" },
  { mode: "full", label: "Full" },
  { mode: "minimal", label: "Minimal" },
];

/**
 * Mirrors the chosen mode onto <html data-motion> so the CSS reduced-motion
 * kill switch can be overridden by an explicit "Full" choice.
 */
export function MotionModeSync() {
  const { mode } = useMotionPrefs();

  useEffect(() => {
    document.documentElement.dataset.motion = mode;
  }, [mode]);

  return null;
}

/**
 * Minimal mode and the OS reduced-motion setting both silently disable most of
 * this site. Without a visible control, a single "Skip to content" click is a
 * one-way door — so the reader always gets a way back.
 */
export function MotionToggle() {
  const { mode, setMode } = useMotionPrefs();
  const osReduce = useFramerReducedMotion();

  // Report what is actually in effect, and why — the failure mode here is a
  // silently-disabled site with no way to tell which switch caused it.
  const reduced = mode === "minimal" || (mode === "auto" && Boolean(osReduce));
  const reason =
    mode === "minimal"
      ? "minimal mode"
      : mode === "auto" && osReduce
        ? "your system setting"
        : null;

  return (
    <div className="flex flex-col gap-2">
      <p className="type-overline font-mono text-content-tertiary">
        Motion — {reduced ? `reduced by ${reason}` : "full"}
      </p>
      <div
        role="radiogroup"
        aria-label="Motion preference"
        className="flex w-fit gap-1 rounded-full border border-edge-subtle p-1"
      >
        {OPTIONS.map((option) => (
          <button
            key={option.mode}
            type="button"
            role="radio"
            aria-checked={mode === option.mode}
            onClick={() => setMode(option.mode)}
            className={clsx(
              "rounded-full px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.15em] uppercase transition-colors",
              mode === option.mode
                ? "bg-amber-400 text-surface-void"
                : "text-content-secondary hover:text-content-primary",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
