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
  const opacity = useTransform(progress, [start, end], [1, isLast ? 1 : 0.6]);

  // The slot stays a full viewport tall — that is what drives the stacking —
  // but the card is capped so its content is never stretched to fill it.
  return (
    <div className="sticky top-0 flex h-[90svh] items-center py-4 md:h-svh md:py-8">
      <motion.div
        // scale/translate only — no layout properties animate (Section 12.1)
        style={{ scale, y, opacity, transformOrigin: "top center" }}
        className="h-full max-h-[34rem] w-full md:max-h-[30rem]"
      >
        <ProjectCard project={project} priority={priority} />
      </motion.div>
    </div>
  );
}
