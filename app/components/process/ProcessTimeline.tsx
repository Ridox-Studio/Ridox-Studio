"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import clsx from "clsx";
import type { ProcessStep } from "@/app/data/content";
import { Reveal } from "@/app/components/shared/Reveal";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

/**
 * Section 8.1 — the vertical workflow. The spine fills as the reader descends,
 * which is the reaction progressing rather than decoration.
 */
export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const reduce = useReducedMotion();
  const container = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 70%", "end 60%"],
  });
  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={container} className="relative flex flex-col gap-14 ps-10 md:ps-16">
      {/* Spine */}
      <div
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[7px] w-px bg-edge-subtle md:left-[11px]"
      />
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[7px] w-px origin-top md:left-[11px]"
          style={{ scaleY: spineScale, background: "var(--gradient-brand)" }}
        />
      )}

      {steps.map((step) => (
        <Reveal as="li" key={step.index} className="relative flex flex-col gap-3">
          <span
            aria-hidden="true"
            className={clsx(
              "absolute top-2 -start-10 size-4 rounded-full border-2 bg-surface-deep md:-start-16 md:size-6",
              step.accent === "amber" ? "border-amber-400" : "border-indigo-300",
            )}
          />
          <div className="flex items-baseline gap-3">
            <span
              className={clsx(
                "font-mono text-xs tracking-[0.15em]",
                step.accent === "amber" ? "text-amber-400" : "text-indigo-300",
              )}
            >
              {step.index}
            </span>
            <h3 className="type-card font-display text-content-primary">{step.title}</h3>
          </div>
          <p className="type-body max-w-prose font-medium text-content-primary">
            {step.summary}
          </p>
          <p className="type-body max-w-prose text-content-secondary">{step.detail}</p>
        </Reveal>
      ))}
    </ol>
  );
}
