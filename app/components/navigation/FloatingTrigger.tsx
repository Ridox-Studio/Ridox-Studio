"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

/** Section 5 — there is no navbar. This small mark is the entire navigation. */
export function FloatingTrigger() {
  const [open, setOpen] = useState(false);
  const { covered } = useTransition();
  const reduce = useReducedMotion();
  const zone = useScrollZone();

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
        onClick={() => setOpen((value) => !value)}
        aria-expanded={expanded}
        aria-label={expanded ? "Close menu" : "Open menu"}
        className={clsx(
          "fixed z-[45] flex size-12 items-center justify-center rounded-xl border-2 bg-surface-card/80 backdrop-blur-md transition-colors duration-500 md:size-11",
          "right-[max(1.5rem,env(safe-area-inset-right))] bottom-[max(1.5rem,env(safe-area-inset-bottom))]",
          zone === "amber" && "border-amber-400",
          zone === "indigo" && "border-indigo-300",
          zone === "neutral" && "border-edge-subtle",
        )}
        animate={{ opacity: covered ? 0 : 1, scale: covered ? 0.8 : 1 }}
        transition={{ duration: 0.3, ease: EASING.snap }}
        whileTap={reduce ? undefined : { scale: 0.92 }}
      >
        <Logo size={26} animation={reduce || expanded ? "static" : "pulse"} />
      </motion.button>

      <AnimatePresence>
        {expanded && <FullScreenMenu onDismiss={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
