import { SERVICES } from "@/app/data/content";
import { getAllProjects, getProjectHref } from "@/app/data/projects";
import { SITE } from "@/app/lib/site";

/**
 * Served at /llms.txt — the llmstxt.org convention: a plain-Markdown map of the
 * site for language models, so an assistant answering "who is Ridox Studio"
 * has a curated summary and the right links rather than a scrape of the DOM.
 *
 * Generated from the same data that renders the site (services, projects) so
 * it cannot drift out of sync. Regenerates on deploy.
 */
export const dynamic = "force-static";

function build(): string {
  const lines: string[] = [];

  lines.push(`# ${SITE.name}`);
  lines.push("");
  lines.push(`> ${SITE.description}`);
  lines.push("");
  lines.push(SITE.longDescription);
  lines.push("");
  lines.push(
    `Ridox Studio works with clients worldwide, from ${SITE.location}. ` +
      `Founded ${SITE.founded}. Contact: ${SITE.email} or ${SITE.url}/contact.`,
  );
  lines.push("");

  lines.push("## Core pages");
  lines.push("");
  lines.push(`- [Home](${SITE.url}/): what the studio does and who it is for`);
  lines.push(`- [Work](${SITE.url}/work): client engagements and case studies`);
  lines.push(`- [Studio](${SITE.url}/studio): products and open-source tools built in-house`);
  lines.push(`- [Process](${SITE.url}/process): how an engagement runs, discovery through handover`);
  lines.push(`- [Contact](${SITE.url}/contact): start a project`);
  lines.push("");

  lines.push("## Services");
  lines.push("");
  for (const service of SERVICES) {
    lines.push(`- **${service.title}** — ${service.summary}`);
  }
  lines.push("");

  lines.push("## Selected work");
  lines.push("");
  for (const project of getAllProjects()) {
    lines.push(
      `- [${project.title}](${SITE.url}${getProjectHref(project)}) (${project.category}) — ${project.subtitle}`,
    );
  }
  lines.push("");

  lines.push("## Elsewhere");
  lines.push("");
  const socialLabels: Record<string, string> = {
    x: "X / Twitter",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    github: "GitHub",
  };
  for (const [key, href] of Object.entries(SITE.social)) {
    lines.push(`- [${socialLabels[key] ?? key}](${href})`);
  }
  lines.push("");

  return lines.join("\n");
}

export function GET(): Response {
  return new Response(build(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
