import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllPostSlugs, getPostBySlug } from "@/app/lib/blog";
import { End } from "../../../_components/chrome";
import { formatDate } from "../../../_lib/format";
import { to } from "../../../_lib/paths";

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post?.title ?? "Post not found" };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <main className="nx-stack">
        <article className="nx-article">
          <header className="nx-article__head">
            <Link href={to("/blog")} className="nx-back nx-rise">
              <ArrowLeft size={14} aria-hidden="true" />
              Journal
            </Link>
            <h1 className="nx-article__title nx-rise" style={{ "--nx-i": 1 } as React.CSSProperties}>
              {post.title}
            </h1>
            <p className="nx-article__lede nx-rise" style={{ "--nx-i": 2 } as React.CSSProperties}>
              {post.description}
            </p>
            <div className="nx-article__meta nx-label">
              <time dateTime={post.date}>{formatDate(post.date, "long")}</time>
              <span aria-hidden="true">/</span>
              <span>{post.readingMinutes} min read</span>
              {post.updated && post.updated !== post.date && (
                <>
                  <span aria-hidden="true">/</span>
                  <span>Updated {formatDate(post.updated, "long")}</span>
                </>
              )}
            </div>
          </header>

          {post.cover && (
            <div className="nx-article__cover">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1100px) 1040px, 100vw"
              />
            </div>
          )}

          {/* First-party content only (repo markdown or our own WordPress),
              never end-user input. See the trust note in lib/blog/types.ts. */}
          <div className="nx-prose" dangerouslySetInnerHTML={{ __html: post.html }} />

          {post.tags.length > 0 && (
            <ul className="nx-article__tags nx-label">
              {post.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
        </article>
      </main>
      <End />
    </>
  );
}
