"use client";

import type { Project } from "@/app/data/projects";
import { ProjectCard } from "@/app/components/projects/ProjectCard";
import { RevealGroup, RevealItem } from "@/app/components/shared/Reveal";

/**
 * The full gallery listing. Rows alternate a vertical offset so the column
 * reads as two interleaved streams rather than a stack of equal blocks.
 */
export function ProjectGallery({ projects }: { projects: Project[] }) {
  return (
    <RevealGroup as="ul" className="flex flex-col gap-8 md:gap-12" stagger={0.1}>
      {projects.map((project, index) => (
        <RevealItem
          as="li"
          key={project.slug}
          className={index % 2 === 1 ? "md:translate-y-8" : undefined}
        >
          <div className="min-h-[30rem] md:min-h-[26rem]">
            <ProjectCard project={project} priority={index === 0} />
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
