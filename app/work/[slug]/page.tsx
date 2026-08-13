import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/app/components/projects/ProjectDetail";
import { getProjectBySlug, getProjectsByCategory } from "@/app/data/projects";
import { SITE } from "@/app/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjectsByCategory("client").map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${SITE.name}`,
      description: project.description,
      url: `${SITE.url}/work/${project.slug}`,
      type: "article",
      // og:image is generated per slug by opengraph-image.tsx
    },
    twitter: {
      title: `${project.title} — ${SITE.name}`,
      description: project.description,
    },
  };
}

export default async function WorkProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || project.category !== "client") notFound();

  return <ProjectDetail project={project} />;
}
