import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/app/lib/og";
import { getProjectBySlug, getProjectsByCategory } from "@/app/data/projects";

export const alt = "Ridox Studio product";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getProjectsByCategory("studio").map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  return renderOgImage({
    overline: `Studio product · ${project?.year ?? ""}`,
    title: project?.title ?? "Product",
    subtitle: project?.subtitle,
  });
}
