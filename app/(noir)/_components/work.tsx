import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getAllProjects, type Project } from "@/app/data/projects";
import { SCHEMA_IDS, SITE } from "@/app/lib/site";
import { End } from "./chrome";
import { projectHref, to } from "../_lib/paths";

export const CATEGORY_LABEL: Record<Project["category"], string> = {
  client: "Client build",
  consulting: "Advisory",
  studio: "Studio product",
};

const STATUS: Partial<Record<NonNullable<Project["status"]>, { label: string; tone: string }>> = {
  live: { label: "Live", tone: "nx-status--live" },
  beta: { label: "Beta", tone: "nx-status--live" },
  "in-development": { label: "In development", tone: "nx-status--building" },
  "open-source": { label: "Open source", tone: "" },
  archived: { label: "Archived", tone: "" },
};

export const pad = (n: number) => String(n).padStart(2, "0");

export function StatusLabel({ status }: { status: Project["status"] }) {
  const entry = status ? STATUS[status] : undefined;
  if (!entry) return null;
  return <span className={`nx-label nx-status ${entry.tone}`}>{entry.label}</span>;
}

/** The signature list: project names at title size; siblings dim on hover. */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  return (
    <div className="nx-index">
      {projects.map((project, i) => (
        <Link key={project.slug} href={projectHref(project)} className="nx-index__row">
          <span className="nx-label nx-label--num nx-index__num">{pad(i + 1)}</span>
          <h3 className="nx-title">{project.title}</h3>
          <div className="nx-index__thumb">
            <Image src={project.coverImage} alt="" fill sizes="(min-width: 900px) 12rem, 5.5rem" />
          </div>
          <div className="nx-index__meta">
            <span className="nx-label nx-label--fg">
              {CATEGORY_LABEL[project.category]} · {project.year}
            </span>
            <StatusLabel status={project.status} />
            <span className="nx-body" style={{ maxWidth: "26rem" }}>
              {project.subtitle}
            </span>
          </div>
        </Link>
      ))}
    </div>
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
      <main className="nx-stack">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
        />

        <header className="nx-pagehead">
          <div className="nx-wrap">
            <div className="nx-pagehead__inner">
              <Link href={to(parentPath)} className="nx-back nx-rise">
                <ArrowLeft size={14} aria-hidden="true" />
                {parentLabel}
              </Link>
              <h1 className="nx-title nx-rise" style={{ "--nx-i": 1 } as React.CSSProperties}>
                {project.title}
              </h1>
              <div
                className="nx-pagehead__foot nx-rise"
                style={{ "--nx-i": 2 } as React.CSSProperties}
              >
                <p className="nx-pagehead__lede">{project.subtitle}</p>
                <div className="nx-detail__meta">
                  <span className="nx-label nx-label--fg">
                    {CATEGORY_LABEL[project.category]} · {project.year}
                  </span>
                  <StatusLabel status={project.status} />
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="nx-reel">
          <div className="nx-reel__frame">
            <Image
              src={project.coverImage}
              alt={`${project.title}: ${project.subtitle}`}
              fill
              priority
              sizes="100vw"
            />
          </div>
        </section>

        <section className="nx-band">
          <div className="nx-wrap nx-stack" style={{ gap: "var(--nx-24)" }}>
            {project.highlights && project.highlights.length > 0 && (
              <dl className="nx-cells nx-cells--auto">
                {project.highlights.map((highlight) => (
                  <div key={highlight.label} className="nx-cell">
                    <dt className="nx-label">{highlight.label}</dt>
                    <dd className="nx-h3">{highlight.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="nx-grid">
              <div className="nx-col-label nx-stack" style={{ gap: "var(--nx-2)" }}>
                <span className="nx-label nx-label--num">01</span>
                <span className="nx-label nx-label--fg">What we built</span>
              </div>
              <div className="nx-col-main nx-detail__about">
                <div className="nx-stack" style={{ gap: "var(--nx-6)" }}>
                  <p className="nx-statement nx-statement--long">{project.description}</p>
                  {project.credits && <p className="nx-body nx-detail__credit">{project.credits}</p>}
                </div>
                <div className="nx-stack" style={{ gap: "var(--nx-6)" }}>
                  <div className="nx-stack" style={{ gap: "var(--nx-2)" }}>
                    <span className="nx-label">Stack</span>
                    <p className="nx-body">{project.techStack.join(" · ")}</p>
                  </div>
                  {project.externalUrl && (
                    <a
                      href={project.externalUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="nx-link"
                    >
                      Visit {project.title}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {project.features && project.features.length > 0 && (
          <section className="nx-band nx-band--line">
            <div className="nx-wrap">
              <div className="nx-grid nx-bandhead">
                <div className="nx-col-label nx-stack" style={{ gap: "var(--nx-2)" }}>
                  <span className="nx-label nx-label--num">02</span>
                  <span className="nx-label nx-label--fg">In detail</span>
                </div>
                <h2 className="nx-statement nx-col-main">What it actually does.</h2>
              </div>
              <ol className="nx-features">
                {project.features.map((feature, index) => (
                  <li key={feature.title} className="nx-feature">
                    <span className="nx-label nx-label--num">{pad(index + 1)}</span>
                    <h3 className="nx-h3">{feature.title}</h3>
                    <p className="nx-body">{feature.detail}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {next && next.slug !== project.slug && (
          <section className="nx-band nx-band--line" style={{ paddingBlock: "var(--nx-16)" }}>
            <div className="nx-wrap">
              <Link href={projectHref(next)} className="nx-next">
                <span className="nx-label">Next · {CATEGORY_LABEL[next.category]}</span>
                <span className="nx-title nx-next__title">
                  {next.title}
                  <ArrowUpRight aria-hidden="true" strokeWidth={1.25} />
                </span>
                <span className="nx-body">{next.subtitle}</span>
              </Link>
            </div>
          </section>
        )}
      </main>
      <End />
    </>
  );
}
