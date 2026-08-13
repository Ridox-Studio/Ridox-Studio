"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import { MAGNETIC_SPRING } from "@/app/lib/motion";
import { useMotionPrefs } from "@/app/components/providers/MotionProvider";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";

const RADIUS = 50; // px of magnetic pull — Section 7.5

type MagneticButtonProps = {
  children: ReactNode;
  /** Internal route — routed through the Redox Door. */
  href?: string;
  /** Door label, e.g. "Contact" → "// CONTACT". */
  label?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  accent?: "amber" | "indigo";
  className?: string;
  disabled?: boolean;
};

/**
 * Desktop: the control drifts toward the cursor within a 50px radius.
 * Touch: no magnetism — a press-state spring instead (Section 13.7).
 */
export function MagneticButton({
  children,
  href,
  label,
  onClick,
  type = "button",
  accent = "amber",
  className,
  disabled,
}: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { hasPointer } = useMotionPrefs();
  const magnetic = hasPointer && !reduce;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, MAGNETIC_SPRING);
  const springY = useSpring(y, MAGNETIC_SPRING);

  const handleMove = (event: React.MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-RADIUS, Math.min(RADIUS, dx * 0.35)));
    y.set(Math.max(-RADIUS, Math.min(RADIUS, dy * 0.35)));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const surface = clsx(
    "inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 font-mono text-xs font-medium tracking-[0.15em] uppercase transition-colors",
    accent === "amber"
      ? "bg-amber-400 text-surface-void hover:bg-amber-500"
      : "border border-edge-visible bg-transparent text-content-primary hover:border-indigo-300 hover:text-indigo-300",
    disabled && "pointer-events-none opacity-50",
    className,
  );

  const inner = (
    <motion.span
      ref={ref}
      className="inline-flex"
      style={magnetic ? { x: springX, y: springY } : undefined}
      whileTap={reduce ? undefined : { scale: 0.95 }}
      transition={MAGNETIC_SPRING}
    >
      {href ? (
        <TransitionLink href={href} label={label} className={surface}>
          {children}
        </TransitionLink>
      ) : (
        <button type={type} onClick={onClick} disabled={disabled} className={surface}>
          {children}
        </button>
      )}
    </motion.span>
  );

  return (
    <span
      className="inline-flex"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      // Padding gives the cursor a catchment area wider than the control.
      style={{ padding: magnetic ? RADIUS / 2 : 0, margin: magnetic ? -RADIUS / 2 : 0 }}
    >
      {inner}
    </span>
  );
}
