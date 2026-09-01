"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Project } from "@/app/data/projects";
import { ProjectCard } from "@/app/components/projects/ProjectCard";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

/**
 * Section 7.3 — projects are not a grid. Each card pins to the viewport and
 * scales down as the next one slides over it, like flipping through folders.
 */
export function ProjectDeck({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Minimal mode / reduced motion — a plain vertical list (Section 12.3).
  if (reduce) {
    return (
      <div className="flex flex-col gap-8">
        {projects.map((project, index) => (
          <div key={project.slug} className="min-h-[32rem]">
            <ProjectCard project={project} priority={index === 0} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={container} className="relative flex flex-col">
      {projects.map((project, index) => (
        <StackedCard
          key={project.slug}
          project={project}
          index={index}
          total={projects.length}
          progress={scrollYProgress}
          priority={index === 0}
        />
      ))}
    </div>
  );
}

function StackedCard({
  project,
  index,
  total,
  progress,
  priority,
}: {
  project: Project;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  priority: boolean;
}) {
  // Each card gives up its slice of scroll to the one arriving after it.
  const start = index / total;
  const end = (index + 1) / total;
  const isLast = index === total - 1;

  const scale = useTransform(progress, [start, end], [1, isLast ? 1 : 0.95]);
  const y = useTransform(progress, [start, end], [0, isLast ? 0 : -20]);
  // A scrim drawn ON the card, not opacity applied TO it. Fading the card
  // itself makes it translucent, so the card beneath shows through and the
  // two images blend into a muddy composite — visible on every card except
  // the first (nothing behind it) and the last (never dimmed).
  const scrim = useTransform(progress, [start, end], [0, isLast ? 0 : 0.5]);

  // The slot stays a full viewport tall — that is what drives the stacking —
  // but the card is capped so its content is never stretched to fill it.
  return (
    // Offset by the pinned section rail so cards never slide underneath it.
    <div className="sticky top-[var(--rail-h)] flex h-[calc(90svh-var(--rail-h))] items-center py-4 md:h-[calc(100svh-var(--rail-h))] md:py-8">
      <motion.div
        // scale/translate only — no layout properties animate (Section 12.1)
        style={{ scale, y, transformOrigin: "top center" }}
        // Capped on desktop, where a full-height card looks stretched. On
        // mobile it fills the slot: the content is stacked rather than
        // side by side, so it needs every pixel the viewport can give.
        className="relative h-full w-full md:max-h-[30rem]"
      >
        <ProjectCard project={project} priority={priority} />
        <motion.div
          aria-hidden="true"
          style={{ opacity: scrim }}
          // Radius matches the card so the scrim cannot square off its corners.
          className="pointer-events-none absolute inset-0 rounded-2xl bg-surface-void"
        />
      </motion.div>
    </div>
  );
}
