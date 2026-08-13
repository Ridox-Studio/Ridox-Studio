import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/app/components/projects/ProjectDetail";
import { getProjectBySlug, getProjectsByCategory } from "@/app/data/projects";
import { buildPageMetadata } from "@/app/lib/metadata";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjectsByCategory("studio").map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Product not found" };

  return buildPageMetadata({
    title: project.title,
    description: project.description,
    // The subtitle is already a one-line product tagline — ideal for a card.
    socialDescription: project.subtitle,
    path: `/studio/${project.slug}`,
    type: "article",
  });
}

export default async function StudioProductPage({ params }: Params) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || project.category !== "studio") notFound();

  return <ProjectDetail project={project} />;
}
