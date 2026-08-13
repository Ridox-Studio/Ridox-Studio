import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/app/data/projects";
import { Container } from "@/app/components/shared/SectionHeader";
import { PageHeader } from "@/app/components/shared/PageHeader";
import { Reveal, RevealGroup, RevealItem } from "@/app/components/shared/Reveal";
import { ProjectImage } from "@/app/components/shared/ProjectImage";
import { ContactSection } from "@/app/components/contact/ContactSection";
import { Footer } from "@/app/components/footer/Footer";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";
import { SITE } from "@/app/lib/site";

/** Shared deep-dive layout for /work/[slug] and /studio/[slug]. */
export function ProjectDetail({ project }: { project: Project }) {
  const isStudio = project.category === "studio";
  const accent = isStudio ? "indigo" : "amber";
  const parentHref = isStudio ? "/studio" : "/work";
  const parentLabel = isStudio ? "Studio" : "Work";
  const categoryLabel =
    project.category === "studio"
      ? "Studio product"
      : project.category === "consulting"
        ? "Consulting"
        : "Client work";

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${SITE.url}${parentHref}/${project.slug}`,
    image: `${SITE.url}${project.coverImage}`,
    creator: { "@type": "Organization", name: SITE.name },
    dateCreated: project.year.toString(),
    keywords: project.techStack.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: parentLabel, item: `${SITE.url}${parentHref}` },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `${SITE.url}${parentHref}/${project.slug}`,
      },
    ],
  };

  return (
    <main data-zone={accent} className="flex w-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHeader
        overline={`${categoryLabel} · ${project.year}`}
        accent={accent}
        title={project.title}
        lede={project.subtitle}
      >
        <nav aria-label="Breadcrumb" className="flex">
          <TransitionLink
            href={parentHref}
            label={parentLabel}
            className="font-mono text-xs tracking-[0.15em] text-content-tertiary uppercase transition-colors hover:text-content-primary"
          >
            ← Back to {parentLabel.toLowerCase()}
          </TransitionLink>
        </nav>
      </PageHeader>

      <Container className="gap-16 pb-24">
        <Reveal className="relative aspect-video w-full overflow-hidden rounded-2xl border border-edge-subtle bg-surface-void">
          <ProjectImage
            src={project.coverImage}
            alt={`${project.title} — ${project.subtitle}`}
            title={project.title}
            accent={accent}
            priority
            sizes="(max-width: 48rem) 100vw, 1400px"
          />
        </Reveal>

        {project.highlights && project.highlights.length > 0 && (
          <RevealGroup as="ul" className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {project.highlights.map((highlight) => (
              <RevealItem
                as="li"
                key={highlight.label}
                className="flex flex-col gap-2 rounded-xl border border-edge-subtle bg-surface-card p-6"
              >
                <span
                  className={clsx(
                    "font-display text-4xl font-extrabold tracking-tight",
                    accent === "amber" ? "text-amber-400" : "text-indigo-300",
                  )}
                >
                  {highlight.value}
                </span>
                <span className="type-overline font-mono text-content-tertiary">
                  {highlight.label}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        )}

        {project.features && project.features.length > 0 && (
          <div className="flex flex-col gap-8">
            <Reveal>
              <h2 className="type-section font-display text-content-primary">
                What it actually does
              </h2>
            </Reveal>
            <RevealGroup as="ul" className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
              {project.features.map((feature) => (
                <RevealItem
                  as="li"
                  key={feature.title}
                  className="flex flex-col gap-3 border-t border-edge-subtle pt-6"
                >
                  <h3
                    className={clsx(
                      "type-card font-display",
                      accent === "amber" ? "text-amber-300" : "text-indigo-200",
                    )}
                  >
                    {feature.title}
                  </h3>
                  <p className="type-body max-w-prose text-content-secondary">
                    {feature.detail}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        )}

        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <Reveal className="flex flex-1 flex-col gap-6">
            <h2 className="type-section font-display text-content-primary">
              What we built
            </h2>
            <p className="type-body text-content-secondary">{project.description}</p>
            {project.credits && (
              <p className="type-caption border-s-2 border-edge-visible ps-4 text-content-tertiary">
                {project.credits}
              </p>
            )}
          </Reveal>

          <Reveal delay={0.1} className="flex w-full flex-col gap-6 md:w-72 md:shrink-0">
            <div className="flex flex-col gap-3">
              <h3 className="type-overline font-mono text-content-tertiary">Stack</h3>
              <ul className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-edge-subtle px-3 py-1 font-mono text-xs text-content-secondary"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noreferrer noopener"
                className={clsx(
                  "inline-flex w-fit items-center gap-2 rounded-full border px-5 py-3 font-mono text-xs tracking-[0.15em] uppercase transition-colors",
                  accent === "amber"
                    ? "border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-surface-void"
                    : "border-indigo-300/40 text-indigo-300 hover:bg-indigo-300 hover:text-surface-void",
                )}
              >
                Visit project
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            )}
          </Reveal>
        </div>
      </Container>

      <ContactSection />
      <Footer />
    </main>
  );
}
