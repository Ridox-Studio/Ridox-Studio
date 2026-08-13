"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Phase 1 → doors close over the current page.
 * Phase 2 → doors held closed while the new route loads.
 * Phase 3 → doors open, revealing the new page.
 */
export type DoorPhase = "idle" | "closing" | "loading" | "opening";

type TransitionState = {
  phase: DoorPhase;
  /** Destination label rendered between the closed doors, e.g. "// WORK". */
  label: string | null;
  /** True from the moment doors start closing until they finish opening. */
  covered: boolean;
  /**
   * The route navigated away from, or null on a cold load. Lets a back
   * control return somewhere real instead of guessing — and, unlike
   * history.back(), it cannot walk a reader off the site entirely.
   */
  previousPath: string | null;
  navigate: (href: string, label?: string) => void;
  /** Called by RedoxDoor when the close animation lands. */
  onDoorsClosed: () => void;
  /** Called by RedoxDoor when the open animation lands. */
  onDoorsOpened: () => void;
};

const TransitionCtx = createContext<TransitionState | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<DoorPhase>("idle");
  const [label, setLabel] = useState<string | null>(null);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const pendingHref = useRef<string | null>(null);

  const navigate = useCallback(
    (href: string, linkLabel?: string) => {
      if (href === pathname || pendingHref.current) return;
      pendingHref.current = href;
      setPreviousPath(pathname);
      setLabel(linkLabel ? `// ${linkLabel.toUpperCase()}` : null);
      setPhase("closing");
    },
    [pathname],
  );

  // Phase 1 complete: the page is fully covered, so it is safe to swap routes.
  const onDoorsClosed = useCallback(() => {
    setPhase("loading");
    if (pendingHref.current) router.push(pendingHref.current);
  }, [router]);

  // The new route has committed — open the doors on it.
  useEffect(() => {
    if (phase !== "loading") return;
    if (!pendingHref.current) return;
    if (pathname !== pendingHref.current) return;
    pendingHref.current = null;
    setPhase("opening");
  }, [pathname, phase]);

  const onDoorsOpened = useCallback(() => {
    setPhase("idle");
    setLabel(null);
  }, []);

  return (
    <TransitionCtx.Provider
      value={{
        phase,
        label,
        covered: phase !== "idle",
        previousPath,
        navigate,
        onDoorsClosed,
        onDoorsOpened,
      }}
    >
      {children}
    </TransitionCtx.Provider>
  );
}

export function useTransition(): TransitionState {
  const ctx = useContext(TransitionCtx);
  if (!ctx) {
    throw new Error("useTransition must be used inside <TransitionProvider>");
  }
  return ctx;
}
