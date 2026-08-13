"use client";

import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/app/data/projects";
import { CursorSpotlight } from "@/app/components/shared/CursorSpotlight";
import { ProjectImage } from "@/app/components/shared/ProjectImage";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";
import { useSpotlight } from "@/app/hooks/useMousePosition";

const STATUS_LABEL: Record<NonNullable<Project["status"]>, string> = {
  live: "Live",
  beta: "Beta",
  "open-source": "Open source",
  archived: "Archived",
};

/**
 * A single project surface. Client work carries the amber accent, studio
 * products the indigo one (Section 7.3).
 */
export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const accent = project.category === "client" ? "amber" : "indigo";
  const ref = useSpotlight<HTMLDivElement>();
  const href = `/${project.category === "client" ? "work" : "studio"}/${project.slug}`;

  return (
    <article
      ref={ref}
      className={clsx(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-surface-card",
        accent === "amber" ? "border-amber-400/30" : "border-indigo-300/30",
      )}
    >
      <CursorSpotlight accent={accent} />

      <div className="relative flex h-full flex-col md:flex-row">
        {/* Visual — full-bleed on top for mobile, one half on desktop */}
        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-surface-void md:aspect-auto md:h-full md:w-1/2">
          <ProjectImage
            src={project.coverImage}
            alt={`${project.title} — ${project.subtitle}`}
            title={project.title}
            accent={accent}
            priority={priority}
            sizes="(max-width: 48rem) 100vw, 50vw"
          />
          <div
            aria-hidden="true"
            className={clsx(
              "absolute inset-0 bg-linear-to-tr from-surface-void/80",
              accent === "amber" ? "to-amber-ghost" : "to-indigo-ghost",
            )}
          />
        </div>

        {/* Details */}
        <div className="relative flex flex-1 flex-col justify-between gap-6 p-6 md:p-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={clsx(
                  "type-overline font-mono",
                  accent === "amber" ? "text-amber-400" : "text-indigo-300",
                )}
              >
                {project.category === "client" ? "Client work" : "Studio product"}
              </span>
              <span className="type-overline font-mono text-content-tertiary">
                {project.year}
              </span>
              {project.status && (
                <span className="type-overline rounded-full border border-edge-subtle px-2 py-1 font-mono text-content-secondary">
                  {STATUS_LABEL[project.status]}
                </span>
              )}
            </div>

            <h3 className="type-card font-display text-content-primary">
              {project.title}
            </h3>
            <p
              className={clsx(
                "type-body font-medium",
                accent === "amber" ? "text-amber-300" : "text-indigo-200",
              )}
            >
              {project.subtitle}
            </p>
            <p className="type-body max-w-prose text-content-secondary">
              {project.description}
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <ul className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-edge-subtle px-2 py-1 font-mono text-[10px] text-content-secondary md:px-3 md:text-xs"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <TransitionLink
              href={href}
              label={project.title}
              className={clsx(
                "inline-flex w-fit items-center gap-2 rounded-full border px-5 py-3 font-mono text-xs tracking-[0.15em] uppercase transition-colors",
                accent === "amber"
                  ? "border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-surface-void"
                  : "border-indigo-300/40 text-indigo-300 hover:bg-indigo-300 hover:text-surface-void",
              )}
            >
              Open case
              <ArrowUpRight size={14} aria-hidden="true" />
            </TransitionLink>
          </div>
        </div>
      </div>
    </article>
  );
}
