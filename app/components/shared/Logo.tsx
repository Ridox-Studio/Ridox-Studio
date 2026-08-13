"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import clsx from "clsx";
import { slidingDuality } from "@/app/lib/motion";

const AMBER = "hsl(33, 95%, 52%)";
const INDIGO = "hsl(258, 89%, 62%)";

/** Variant 7 geometry — copied verbatim from public/logos/ridox/variant7.svg. */
const SLASH_CUTOUT = "M 48,15 L 56,15 L 40,85 L 32,85 Z";
const AMBER_BLOCK = "M 22,22 L 70,22 L 44,78 L 22,78 Z";
const INDIGO_BLOCK = "M 56,22 L 78,22 L 78,78 L 30,78 Z";

type LogoProps = {
  /** Rendered pixel size (the SVG is a square viewBox). */
  size?: number;
  /**
   * `static` — resting mark.
   * `duality` — the two blocks slide past each other through the slash channel.
   * `pulse` — blocks hold position and breathe in opposition.
   */
  animation?: "static" | "duality" | "pulse";
  /** Travel distance for the duality slide, in viewBox units. */
  distance?: number;
  /** Seconds per duality cycle. */
  cycle?: number;
  className?: string;
  /** Set when the mark carries meaning; otherwise it is decorative. */
  title?: string;
};

export function Logo({
  size = 40,
  animation = "static",
  distance = 6,
  cycle = 2,
  className,
  title,
}: LogoProps) {
  // useId keeps the mask unique when several marks share a document.
  const maskId = `ridox-slash-${useId().replace(/:/g, "")}`;
  const duality = slidingDuality(distance, cycle);
  const sliding = animation === "duality";
  const pulsing = animation === "pulse";

  // The two blocks breathe out of phase — the reaction idling, not decoration.
  const pulseFor = (phase: number, base: number) =>
    pulsing
      ? {
          animate: { opacity: [base, base * 0.55, base] },
          transition: {
            duration: 2.4,
            ease: "easeInOut" as const,
            repeat: Infinity,
            delay: phase,
          },
        }
      : {};

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={clsx("overflow-visible", className)}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <mask id={maskId}>
          <rect width="100" height="100" fill="#ffffff" />
          <path d={SLASH_CUTOUT} fill="#000000" />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <motion.path
          d={AMBER_BLOCK}
          fill={AMBER}
          animate={sliding ? duality.amber.animate : undefined}
          transition={sliding ? duality.amber.transition : undefined}
          {...pulseFor(0, 1)}
        />
        <motion.path
          d={INDIGO_BLOCK}
          fill={INDIGO}
          opacity={0.9}
          animate={sliding ? duality.indigo.animate : undefined}
          transition={sliding ? duality.indigo.transition : undefined}
          {...pulseFor(1.2, 0.9)}
        />
      </g>
    </svg>
  );
}
