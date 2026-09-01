"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

/**
 * The track holds COPIES identical copies side by side, so translating by
 * exactly one copy's share of the track width lands on an identical frame.
 */
const COPIES = 4;
const SPAN = 100 / COPIES;

/** Normalises any travel distance into a single [-SPAN, 0] cycle. */
function wrap(value: number) {
  const remainder = value % SPAN;
  return remainder > 0 ? remainder - SPAN : remainder;
}

function Strip({
  words,
  direction,
  className,
}: {
  words: readonly string[];
  direction: 1 | -1;
  className?: string;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  // Scroll speed scales the strip; the sign flips when the reader scrolls up.
  const velocityFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [-4, 0, 4], {
    clamp: false,
  });
  const x = useTransform(baseX, (value) => `${wrap(value)}%`);

  useAnimationFrame((_, delta) => {
    // A slow idle drift keeps the strip alive; velocity multiplies it.
    let move = direction * 1.2 * (delta / 1000);
    move += direction * move * velocityFactor.get();
    baseX.set(baseX.get() + move);
  });

  const content = `${words.join("  ◆  ")}  ◆  `;

  return (
    <div className="flex w-full overflow-hidden select-none">
      <motion.div className="flex flex-nowrap whitespace-nowrap" style={{ x }}>
        {Array.from({ length: COPIES }, (_, index) => (
          // shrink-0 is load-bearing: the global `min-width: 0` reset would
          // otherwise let every copy collapse and overlap in place.
          <span key={index} className={`${className} shrink-0 pe-8 md:pe-16`}>
            {content}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * Section 7.2 — giant text strips driven by scroll velocity. Two opposing
 * lines on desktop, a single line on mobile (Section 13.4).
 */
export function VelocityMarquee({
  top,
  bottom,
}: {
  top: readonly string[];
  bottom: readonly string[];
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const typeClass =
    "font-display text-[3rem] leading-none font-black tracking-tight text-content-tertiary/40 uppercase md:text-[6rem]";

  // Reduced motion / minimal mode — a static strip, no movement (Section 12.3).
  if (reduce) {
    return (
      <div className="overflow-hidden py-8" aria-hidden="true">
        <p className={`${typeClass} whitespace-nowrap`}>{top.join(" ◆ ")}</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex flex-col gap-2 py-8 md:py-14" aria-hidden="true">
      <Strip words={top} direction={-1} className={typeClass} />
      {/* Second, opposing line is desktop-only to save vertical space */}
      <div className="hidden md:block">
        <Strip words={bottom} direction={1} className={typeClass} />
      </div>
    </div>
  );
}
