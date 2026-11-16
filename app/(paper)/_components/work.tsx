import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getAllProjects, type Project } from "@/app/data/projects";
import { SCHEMA_IDS, SITE } from "@/app/lib/site";
import { Closing } from "./chrome";
import { projectHref, to } from "../_lib/paths";

export const CATEGORY_LABEL: Record<Project["category"], string> = {
  client: "Client build",
  consulting: "Advisory",
  studio: "Studio product",
};

const STATUS: Partial<Record<NonNullable<Project["status"]>, { label: string; tone: string }>> = {
  live: { label: "Live", tone: "nd-tag--live" },
  beta: { label: "Beta", tone: "nd-tag--live" },
  "in-development": { label: "In development", tone: "nd-tag--building" },
  "open-source": { label: "Open source", tone: "" },
  archived: { label: "Archived", tone: "" },
};

export function StatusTag({ status }: { status: Project["status"] }) {
  const entry = status ? STATUS[status] : undefined;
  if (!entry) return null;
  return (
    <span className={`nd-tag ${entry.tone}`}>
      <span className="nd-tag__dot" />
      {entry.label}
    </span>
  );
}

export function WorkCard({ project, priority }: { project: Project; priority?: boolean }) {
  return (
    <Link href={projectHref(project)} className="nd-card">
      <div className="nd-card__media">
        <Image
          src={project.coverImage}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 760px) 50vw, 100vw"
        />
      </div>
      <div className="nd-card__body">
        <div className="nd-card__meta">
          <span className="nd-label">
            {CATEGORY_LABEL[project.category]} · {project.year}
          </span>
          <StatusTag status={project.status} />
        </div>
        <h3 className="nd-h3 nd-card__title">
          {project.title}
          <ArrowUpRight size={22} aria-hidden="true" />
        </h3>
        <p className="nd-body">{project.subtitle}</p>
      </div>
    </Link>
  );
}

/** Shared deep-dive layout for /work/[slug] and /studio/[slug]. */
export function ProjectDetail({ project }: { project: Project }) {
  const isStudio = project.category === "studio";
  const parentPath = isStudio ? "/studio" : "/work";
  const parentLabel = isStudio ? "Studio" : "Work";

  // Next in the same list, wrapping, so every project page leads somewhere.
  const siblings = getAllProjects().filter((p) => (p.category === "studio") === isStudio);
  const next = siblings[(siblings.findIndex((p) => p.slug === project.slug) + 1) % siblings.length];

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${SITE.url}${parentPath}/${project.slug}`,
    image: `${SITE.url}${project.coverImage}`,
    creator: { "@id": SCHEMA_IDS.organization },
    dateCreated: project.year.toString(),
    keywords: project.techStack.join(", "),
  };

  return (
    <>
      <main className="nd-stack">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
        />

        <header className="nd-pagehead">
          <div className="nd-wrap">
            <div className="nd-pagehead__inner">
              <Link href={to(parentPath)} className="nd-back nd-rise">
                <ArrowLeft size={14} aria-hidden="true" />
                {parentLabel}
              </Link>
              <h1 className="nd-display nd-rise" style={{ "--nd-i": 1 } as React.CSSProperties}>
                {project.title}
              </h1>
              <div
                className="nd-pagehead__foot nd-rise"
                style={{ "--nd-i": 2 } as React.CSSProperties}
              >
                <p className="nd-lede nd-pagehead__lede">{project.subtitle}</p>
                <div className="nd-detail__meta">
                  <span className="nd-label">
                    {CATEGORY_LABEL[project.category]} · {project.year}
                  </span>
                  <StatusTag status={project.status} />
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="nd-section" style={{ paddingTop: 0 }}>
          <div className="nd-wrap nd-gap-16">
            <div className="nd-detail__cover">
              <Image
                src={project.coverImage}
                alt={`${project.title}: ${project.subtitle}`}
                fill
                priority
                sizes="(min-width: 1400px) 1320px, 100vw"
              />
            </div>

            {project.highlights && project.highlights.length > 0 && (
              <dl className="nd-facts nd-facts--auto">
                {project.highlights.map((highlight) => (
                  <div key={highlight.label} className="nd-fact">
                    <dt className="nd-label">{highlight.label}</dt>
                    <dd className="nd-fact__value">{highlight.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="nd-detail__about">
              <span className="nd-label nd-eyebrow" style={{ alignSelf: "start" }}>
                <span className={isStudio ? "nd-slash nd-slash--indigo" : "nd-slash"} />
                What we built
              </span>
              <div className="nd-stack nd-gap-6">
                <p className="nd-detail__lead">{project.description}</p>
                {project.credits && <p className="nd-small nd-detail__credit">{project.credits}</p>}
              </div>
              <div className="nd-stack nd-gap-6">
                <div className="nd-stack nd-gap-2">
                  <span className="nd-label">Stack</span>
                  <p className="nd-small">{project.techStack.join(" · ")}</p>
                </div>
                {project.externalUrl && (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="nd-link"
                  >
                    Visit {project.title}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {project.features && project.features.length > 0 && (
          <section className="nd-section nd-section--ruled">
            <div className="nd-wrap">
              <div className="nd-head">
                <span className="nd-label nd-eyebrow" style={{ alignSelf: "start" }}>
                  <span className={isStudio ? "nd-slash nd-slash--indigo" : "nd-slash"} />
                  In detail
                </span>
                <div className="nd-head__body">
                  <h2 className="nd-h2">
                    What it <em>actually does.</em>
                  </h2>
                </div>
              </div>
              <ol className="nd-features">
                {project.features.map((feature, index) => (
                  <li key={feature.title} className="nd-feature">
                    <span className="nd-label">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="nd-h3">{feature.title}</h3>
                    <p className="nd-body">{feature.detail}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {next && next.slug !== project.slug && (
          <section className="nd-section nd-section--ruled nd-section--tight">
            <div className="nd-wrap">
              <Link href={projectHref(next)} className="nd-next">
                <span className="nd-label">Next · {CATEGORY_LABEL[next.category]}</span>
                <span className="nd-next__title">
                  <span className="nd-h2">{next.title}</span>
                  <ArrowUpRight size={36} aria-hidden="true" />
                </span>
                <span className="nd-body">{next.subtitle}</span>
              </Link>
            </div>
          </section>
        )}
      </main>
      <Closing />
    </>
  );
}
