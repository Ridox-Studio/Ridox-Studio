"use client";

import type { Project } from "@/app/data/projects";
import { ProjectCard } from "@/app/components/projects/ProjectCard";
import { RevealGroup, RevealItem } from "@/app/components/shared/Reveal";

/** The full gallery listing — evenly spaced, staggered in on entry. */
export function ProjectGallery({ projects }: { projects: Project[] }) {
  return (
    <RevealGroup as="ul" className="flex flex-col gap-8 md:gap-10" stagger={0.1}>
      {projects.map((project, index) => (
        <RevealItem as="li" key={project.slug}>
          {/* A definite height, not min-height: the card's `h-full` image pane
              needs a resolvable parent height or it collapses to zero. */}
          <div className="h-[34rem] md:h-[30rem]">
            <ProjectCard project={project} priority={index === 0} />
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
