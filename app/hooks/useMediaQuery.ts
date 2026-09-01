"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media query state without a setState-in-effect cascade. The server snapshot
 * is always `false`, so SSR markup matches the first client paint.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True on viewports at or above the `md` breakpoint (768px). */
export function useIsDesktop() {
  return useMediaQuery("(min-width: 48rem)");
}

/** True when a real pointer exists — gates every cursor-driven effect. */
export function useHasPointer() {
  return useMediaQuery("(hover: hover)");
}
