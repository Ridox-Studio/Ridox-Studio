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
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={revealVariants(reduce)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
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
