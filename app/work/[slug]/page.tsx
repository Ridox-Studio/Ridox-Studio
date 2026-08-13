import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/app/components/projects/ProjectDetail";
import { getProjectBySlug, getProjectsByCategory } from "@/app/data/projects";
import { buildPageMetadata } from "@/app/lib/metadata";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjectsByCategory("client").map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  return buildPageMetadata({
    title: project.title,
    description: project.description,
    // The subtitle is already a one-line result statement — ideal for a card.
    socialDescription: project.subtitle,
    path: `/work/${project.slug}`,
    type: "article",
  });
}

export default async function WorkProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || project.category !== "client") notFound();

  return <ProjectDetail project={project} />;
}
