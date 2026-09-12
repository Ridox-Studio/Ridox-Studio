import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/app/lib/og";
import { getAllPostSlugs, getPostBySlug } from "@/app/lib/blog";

export const alt = "Ridox Studio blog post";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return renderOgImage({
    overline: "The blog",
    title: post?.title ?? "Post",
    subtitle: post?.description,
    cta: "Read the post",
    accent: "indigo",
  });
}
