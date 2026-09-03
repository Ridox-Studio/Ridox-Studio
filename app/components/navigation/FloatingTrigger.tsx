"use client";

import { animate, AnimatePresence, motion, useMotionValue } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { EASING } from "@/app/lib/motion";
import { Logo } from "@/app/components/shared/Logo";
import { FullScreenMenu } from "@/app/components/navigation/FullScreenMenu";
import { useTransition } from "@/app/components/transitions/TransitionContext";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

type Zone = "amber" | "indigo" | "neutral";

/**
 * Section 5.3 — the trigger's border tracks which zone the reader is in.
 * Sections opt in by setting `data-zone="amber" | "indigo"`.
 */
function useScrollZone(): Zone {
  const pathname = usePathname();
  // Tagged with the route it was observed on, so a stale zone from the
  // previous page can never bleed through before the observer re-runs.
  const [seen, setSeen] = useState<{ path: string; zone: Zone } | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-zone]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const zone = ((visible.target as HTMLElement).dataset.zone as Zone) ?? "neutral";
        setSeen({ path: window.location.pathname, zone });
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-20% 0px -20% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return seen?.path === pathname ? seen.zone : "neutral";
}

/** Where the reader last parked the trigger, as an offset from its resting
 *  bottom-right corner. Persisted so it survives reloads and route changes. */
const POSITION_KEY = "ridox:nav-trigger-offset";
/** Matches the resting inset (1.5rem) and the button box (size-12 = 3rem). */
const EDGE_GAP = 24;
const BUTTON_SIZE = 48;

function bounds() {
  // The button rests at bottom-right; offsets only ever move it up / left.
  return {
    minX: -(window.innerWidth - BUTTON_SIZE - EDGE_GAP * 2),
    minY: -(window.innerHeight - BUTTON_SIZE - EDGE_GAP * 2),
  };
}

function clampOffset(x: number, y: number) {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  const { minX, minY } = bounds();
  return {
    x: Math.min(0, Math.max(minX, x)),
    y: Math.min(0, Math.max(minY, y)),
  };
}

type Edge = "left" | "right" | "top" | "bottom";

/** Pull the button to whichever of the four window edges is closest. */
function snapToNearestEdge(x: number, y: number): { x: number; y: number; edge: Edge } {
  const { minX, minY } = bounds();
  const clamped = clampOffset(x, y);
  // Gap between the button and each edge, in the button's own offset space.
  const toLeft = clamped.x - minX;
  const toRight = -clamped.x;
  const toTop = clamped.y - minY;
  const toBottom = -clamped.y;
  const nearest = Math.min(toLeft, toRight, toTop, toBottom);

  if (nearest === toLeft) return { x: minX, y: clamped.y, edge: "left" };
  if (nearest === toRight) return { x: 0, y: clamped.y, edge: "right" };
  if (nearest === toTop) return { x: clamped.x, y: minY, edge: "top" };
  return { x: clamped.x, y: 0, edge: "bottom" };
}

/** Where the hint label sits so it stays on-screen for a given parked edge. */
const TOOLTIP_POSITION: Record<Edge, string> = {
  left: "left-full ml-2 top-1/2 -translate-y-1/2",
  right: "right-full mr-2 top-1/2 -translate-y-1/2",
  top: "top-full mt-2 right-0",
  bottom: "bottom-full mb-2 right-0",
};

/** Drag-to-reposition for the trigger, with the position remembered locally. */
function useDraggablePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Which window edge the button is parked against — drives where the hint
  // label sits so it never renders off-screen.
  const [edge, setEdge] = useState<Edge>("bottom");
  // Set the instant a drag crosses the threshold; read by the click handler so
  // releasing a drag over the button does not also toggle the menu.
  const draggedRef = useRef(false);

  const persist = useCallback((next: { x: number; y: number; edge: Edge }) => {
    setEdge(next.edge);
    try {
      window.localStorage.setItem(
        POSITION_KEY,
        JSON.stringify({ x: next.x, y: next.y }),
      );
    } catch {
      // Private mode / disabled storage — the position just will not persist.
    }
  }, []);

  useEffect(() => {
    let start = { x: 0, y: 0 };
    try {
      const saved = window.localStorage.getItem(POSITION_KEY);
      if (saved) start = JSON.parse(saved) as { x: number; y: number };
    } catch {
      // malformed / unavailable — rest at default
    }
    const next = snapToNearestEdge(start.x, start.y);
    x.set(next.x);
    y.set(next.y);
    // Restoring a persisted client-only position: this has to run after mount,
    // reading localStorage during render would risk a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEdge(next.edge);

    const onResize = () => {
      // Edges have moved — keep the button pinned to the nearest one.
      const snapped = snapToNearestEdge(x.get(), y.get());
      x.set(snapped.x);
      y.set(snapped.y);
      persist(snapped);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [x, y, persist]);

  const onDragEnd = useCallback(() => {
    const next = snapToNearestEdge(x.get(), y.get());
    const spring = { type: "spring" as const, stiffness: 500, damping: 40 };
    animate(x, next.x, spring);
    animate(y, next.y, spring);
    persist(next);
    // Let the click event that follows the release see the drag, then clear.
    requestAnimationFrame(() => {
      draggedRef.current = false;
    });
  }, [x, y, persist]);

  const onDragStart = useCallback(() => {
    draggedRef.current = true;
  }, []);

  return { x, y, edge, draggedRef, onDragStart, onDragEnd };
}

/** Section 5 — there is no navbar. This small mark is the entire navigation. */
export function FloatingTrigger() {
  const [open, setOpen] = useState(false);
  const { covered } = useTransition();
  const reduce = useReducedMotion();
  const zone = useScrollZone();
  const drag = useDraggablePosition();

  // Menu links close the overlay themselves via onNavigate; this covers the
  // one path they cannot — the browser's own back/forward buttons.
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  // The doors closing should never leave a stray menu floating on top.
  const expanded = open && !covered;

  return (
    <>
      <motion.button
        type="button"
        onClick={() => {
          // A release that ended a drag should not also toggle the menu.
          if (drag.draggedRef.current) return;
          setOpen((value) => !value);
        }}
        aria-expanded={expanded}
        aria-label={expanded ? "Close menu" : "Open menu"}
        drag
        dragMomentum={false}
        dragElastic={0}
        onDragStart={drag.onDragStart}
        onDragEnd={drag.onDragEnd}
        style={{ x: drag.x, y: drag.y, touchAction: "none" }}
        className={clsx(
          "group fixed z-[45] flex size-12 cursor-pointer items-center justify-center rounded-xl border-2 bg-surface-card/80 backdrop-blur-md transition-colors duration-500 active:cursor-grabbing md:size-11",
          "right-[max(1.5rem,env(safe-area-inset-right))] bottom-[max(1.5rem,env(safe-area-inset-bottom))]",
          zone === "amber" && "border-amber-400",
          zone === "indigo" && "border-indigo-300",
          zone === "neutral" && "border-edge-subtle",
        )}
        animate={{ opacity: covered ? 0 : 1, scale: covered ? 0.8 : 1 }}
        transition={{ duration: 0.3, ease: EASING.snap }}
        whileTap={reduce ? undefined : { scale: 0.92 }}
      >
        {!expanded && (
          <span
            aria-hidden="true"
            className={clsx(
              "pointer-events-none absolute hidden whitespace-nowrap rounded-md border border-edge-subtle bg-surface-card px-2 py-1 font-mono text-[0.625rem] tracking-wide text-content-secondary uppercase opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:block",
              TOOLTIP_POSITION[drag.edge],
            )}
          >
            Hold &amp; drag to move
          </span>
        )}
        <Logo size={26} animation={reduce || expanded ? "static" : "pulse"} />
      </motion.button>

      <AnimatePresence>
        {expanded && <FullScreenMenu onDismiss={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
