"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { revealVariants, staggerChild, staggerParent } from "@/app/lib/motion";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

/**
 * Section entrance: 0.8s, fired at 20% viewport intersection (Section 11.4).
 * The children are always in the server-rendered HTML — Framer Motion only
 * animates them, so the text stays indexable (Section 14.1).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
  /**
   * Fraction of the element's own area that must be on-screen before it
   * reveals. The 0.2 default assumes a compact section — for something that
   * can run much taller than the viewport (a long article body, say), that
   * threshold may never be satisfiable on a phone, which looks like the
   * reveal is stuck. Pass "some" (any pixel visible) for content like that.
   */
  amount?: number | "some" | "all";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={revealVariants(reduce)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

/** Staggers its direct <RevealItem> children as the group enters the viewport. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={staggerParent(reduce ? 0 : stagger)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component className={className} variants={staggerChild(reduce)}>
      {children}
    </Component>
  );
}
