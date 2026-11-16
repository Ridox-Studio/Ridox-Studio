import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectsByCategory } from "@/app/data/projects";
import { ProjectDetail } from "../../../_components/work";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjectsByCategory("studio").map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return { title: project?.title ?? "Project not found" };
}

export default async function StudioProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || project.category !== "studio") notFound();

  return <ProjectDetail project={project} />;
}
