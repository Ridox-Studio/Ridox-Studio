"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect } from "react";
import { EASING } from "@/app/lib/motion";
import { SITE } from "@/app/lib/site";
import { Logo } from "@/app/components/shared/Logo";
import { useMousePosition } from "@/app/hooks/useMousePosition";
import { useMotionPrefs } from "@/app/components/providers/MotionProvider";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

/**
 * Section 13.3 — on touch devices the watermark parallax is driven by the
 * gyroscope instead of the cursor. Static where neither exists.
 */
function useTilt(enabled: boolean) {
  const x = useSpring(0, { stiffness: 60, damping: 20 });
  const y = useSpring(0, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (!enabled) return;
    if (typeof DeviceOrientationEvent === "undefined") return;

    const onOrient = (event: DeviceOrientationEvent) => {
      // gamma: left/right tilt, beta: front/back tilt — clamped to ±3 degrees.
      x.set(Math.max(-3, Math.min(3, (event.gamma ?? 0) / 15)));
      y.set(Math.max(-3, Math.min(3, ((event.beta ?? 0) - 45) / 15)));
    };

    window.addEventListener("deviceorientation", onOrient);
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, [enabled, x, y]);

  return { x, y };
}

const VERTICAL_WORDS =
  "REDUCTION ◆ OXIDATION ◆ ENGINEERING ◆ DESIGN ◆ ARCHITECTURE ◆ TRANSFORMATION ◆ ";

/** Facts, not filler — they anchor the bottom of the canvas. */
const CANVAS_META = [
  { label: "Founded", value: "2021" },
  { label: "Capabilities", value: "05" },
  { label: "Systems shipped", value: "40+" },
];

/** Section 6.2 — the opening canvas. Not a hero. */
export function OpeningCanvas() {
  const reduce = useReducedMotion();
  const { hasPointer } = useMotionPrefs();
  const pointer = useMousePosition(hasPointer && !reduce);
  const tilt = useTilt(!hasPointer && !reduce);

  const cursorRotate = pointer.x * 6; // ±3 degrees at the viewport edges
  const cursorShift = pointer.y * 6;

  return (
    <section
      data-zone="neutral"
      className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden px-6 py-24 md:px-12"
    >
      {/* Giant watermark — bleeds off the right edge on desktop, centred on mobile */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.10] md:left-auto md:right-[-10vw] md:translate-x-0 md:opacity-[0.16]"
        style={hasPointer ? undefined : { rotate: tilt.x, y: tilt.y }}
        animate={hasPointer && !reduce ? { rotate: cursorRotate, y: cursorShift } : undefined}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
      >
        <div className="w-[78vw] md:w-[54vw]">
          {/* w-full/h-auto override the intrinsic square size */}
          <Logo className="h-auto w-full" />
        </div>
      </motion.div>

      {/* Right-edge vertical word strip — fills the dead column beside the
          wordmark and gives the canvas a second axis of motion. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 overflow-hidden md:flex md:justify-center"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 18%, black 82%, transparent)",
        }}
      >
        <div className={reduce ? "v-marquee [animation:none]" : "v-marquee"}>
          <span className="font-mono text-[0.6875rem] tracking-[0.4em] text-content-tertiary uppercase">
            {`${VERTICAL_WORDS}${VERTICAL_WORDS}`}
          </span>
        </div>
      </div>

      <div className="relative flex w-full max-w-[1400px] flex-col gap-8">
        <motion.p
          className="type-overline font-mono text-content-tertiary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASING.reveal }}
        >
          Reduction ◆ Oxidation
        </motion.p>

        <h1 className="flex flex-col font-display text-content-primary">
          <motion.span
            className="type-mega block"
            initial={{ opacity: 0, y: reduce ? 0 : 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.3 : 0.9, delay: 0.3, ease: EASING.redox }}
          >
            RIDOX
          </motion.span>
          <motion.span
            className="type-mega type-mega-outline block"
            initial={{ opacity: 0, y: reduce ? 0 : 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.3 : 0.9, delay: 0.42, ease: EASING.redox }}
          >
            STUDIO
          </motion.span>
        </h1>

        <motion.p
          className="type-body max-w-xl text-content-secondary"
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.3 : 0.7, delay: 0.65, ease: EASING.reveal }}
        >
          {SITE.tagline}. We build where opposing forces meet — frontend and backend,
          speed and stability, design energy and engineering depth.
        </motion.p>

        <motion.dl
          className="flex flex-wrap gap-x-10 gap-y-4 border-t border-edge-subtle pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: EASING.reveal }}
        >
          {CANVAS_META.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <dt className="type-overline font-mono text-content-tertiary">
                {item.label}
              </dt>
              <dd className="font-display text-2xl font-extrabold text-content-primary">
                {item.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* Scroll indicator — the vertical strip carries this on desktop, so
          mobile only needs the chevron. */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden"
        animate={reduce ? undefined : { y: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-content-tertiary">
          <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
