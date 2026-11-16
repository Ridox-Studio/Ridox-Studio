import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getWorkProjects } from "@/app/data/projects";
import { ProjectDetail } from "../../../_components/work";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getWorkProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return { title: project?.title ?? "Project not found" };
}

export default async function WorkProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || project.category === "studio") notFound();

  return <ProjectDetail project={project} />;
}
