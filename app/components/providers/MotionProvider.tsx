"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useHasPointer } from "@/app/hooks/useMediaQuery";

const MOTION_MODE_KEY = "ridox_motion_mode";

/**
 * `auto`    — follow the OS `prefers-reduced-motion` setting (the default).
 * `full`    — force the full experience even if the OS asks for less.
 * `minimal` — low-bandwidth mode (Section 12.3).
 *
 * Stored in localStorage, which is an external store, so it is read through
 * useSyncExternalStore rather than mirrored into state inside an effect.
 */
export type MotionMode = "auto" | "full" | "minimal";

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Another tab changing the mode should propagate here too.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): MotionMode {
  try {
    const stored = window.localStorage.getItem(MOTION_MODE_KEY);
    if (stored === "full" || stored === "minimal" || stored === "auto") return stored;
    // The first release stored a bare boolean set by a Skip button with no way
    // to undo it. That flag is deliberately NOT migrated — it is cleared, so a
    // stale accidental click cannot keep the site permanently switched off.
    window.localStorage.removeItem("ridox_minimal_mode");
  } catch {
    // Private mode / storage disabled — stay on the default.
  }
  return "auto";
}

function writeMode(mode: MotionMode) {
  try {
    window.localStorage.setItem(MOTION_MODE_KEY, mode);
    window.localStorage.removeItem("ridox_minimal_mode");
  } catch {
    // Non-fatal; the choice simply will not persist.
  }
  listeners.forEach((listener) => listener());
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useMotionPrefs() {
  // The server snapshot is always "auto" so SSR matches the first client paint.
  const mode = useSyncExternalStore(subscribe, getSnapshot, (): MotionMode => "auto");
  const hasPointer = useHasPointer();

  const setMode = useCallback((next: MotionMode) => writeMode(next), []);
  const enableMinimalMode = useCallback(() => writeMode("minimal"), []);
  const disableMinimalMode = useCallback(() => writeMode("full"), []);

  return {
    mode,
    minimal: mode === "minimal",
    /** Overrides the OS preference — only ever set deliberately by the reader. */
    forceFull: mode === "full",
    hasPointer,
    setMode,
    enableMinimalMode,
    disableMinimalMode,
  };
}
