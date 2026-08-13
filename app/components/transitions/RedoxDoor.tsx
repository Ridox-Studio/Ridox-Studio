"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { EASING, SLASH, SLASH_AXIS } from "@/app/lib/motion";
import { useIsDesktop } from "@/app/hooks/useMediaQuery";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";
import { useMotionPrefs } from "@/app/components/providers/MotionProvider";
import { useTransition } from "@/app/components/transitions/TransitionContext";

/**
 * Section 7.6 Phase 2 — the escape hatch appears if loading drags past 3s.
 * Mounted only while the doors are shut, so unmounting is the reset.
 */
function SkipAfterDelay({ onSkip }: { onSkip: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onSkip}
      className="absolute top-6 right-6 flex min-h-11 min-w-11 items-center rounded-sm px-3 font-mono text-xs text-surface-void underline decoration-surface-void/40 underline-offset-4"
    >
      Skip to content →
    </button>
  );
}

/**
 * The persistent page-transition overlay (Section 7.6). Mounted once in the
 * root layout — it never unmounts, it only changes phase.
 */
export function RedoxDoor() {
  const { phase, label, onDoorsClosed, onDoorsOpened } = useTransition();
  const reduce = useReducedMotion();
  const { enableMinimalMode } = useMotionPrefs();
  const isDesktop = useIsDesktop();

  // Section 13.1 — mobile runs the same choreography, slightly faster.
  const closeDuration = isDesktop ? 0.6 : 0.5;
  const openDuration = isDesktop ? 0.8 : 0.6;

  // Reduced motion — a plain crossfade, no diagonal doors (Section 7.6).
  if (reduce) {
    return (
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            key="redox-fade"
            className="fixed inset-0 z-50 bg-surface-void"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onAnimationComplete={() => {
              if (phase === "closing") onDoorsClosed();
              if (phase === "opening") onDoorsOpened();
            }}
          />
        )}
      </AnimatePresence>
    );
  }

  const target =
    phase === "idle" ? "offscreen" : phase === "loading" ? "duality" : phase === "opening" ? "offscreen" : "closed";

  const doorVariants = (direction: 1 | -1): Variants => ({
    offscreen: {
      x: `${-110 * direction}%`,
      y: `${-110 * direction}%`,
      transition: { duration: openDuration, ease: EASING.redox },
    },
    closed: {
      x: "0%",
      y: "0%",
      transition: { duration: closeDuration, ease: EASING.redox },
    },
    // Sliding Duality — the halves pass each other ALONG their shared edge, so
    // the door stays sealed while the new route loads behind it.
    duality: {
      x: [0, 10 * SLASH_AXIS.x * direction, 0, -10 * SLASH_AXIS.x * direction, 0],
      y: [0, 10 * SLASH_AXIS.y * direction, 0, -10 * SLASH_AXIS.y * direction, 0],
      transition: { duration: 1.6, ease: "easeInOut", repeat: Infinity },
    },
  });

  const handleComplete = (definition: string) => {
    if (definition === "closed" && phase === "closing") onDoorsClosed();
    if (definition === "offscreen" && phase === "opening") onDoorsOpened();
  };

  return (
    <div
      aria-hidden={phase === "idle"}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ pointerEvents: phase === "idle" ? "none" : "all" }}
    >
      {/* Amber block — enters from the top-left */}
      <motion.div
        className="absolute inset-0 bg-amber-400"
        style={{ clipPath: SLASH.amberHalf }}
        variants={doorVariants(1)}
        initial="offscreen"
        animate={target}
        onAnimationComplete={handleComplete}
      />
      {/* Indigo block — enters from the bottom-right */}
      <motion.div
        className="absolute inset-0 bg-indigo-300"
        style={{ clipPath: SLASH.indigoHalf }}
        variants={doorVariants(-1)}
        initial="offscreen"
        animate={target}
      />

      <AnimatePresence>
        {phase === "loading" && label && (
          <motion.p
            key="destination"
            className="absolute inset-0 flex items-center justify-center font-mono text-xs tracking-[0.3em] text-surface-void md:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.2, ease: EASING.reveal }}
          >
            {label}
          </motion.p>
        )}
      </AnimatePresence>

      {phase === "loading" && <SkipAfterDelay onSkip={enableMinimalMode} />}
    </div>
  );
}
