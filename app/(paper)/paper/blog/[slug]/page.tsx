import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllPostSlugs, getPostBySlug } from "@/app/lib/blog";
import { Closing } from "../../../_components/chrome";
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
      <main className="nd-stack">
        <article className="nd-article">
          <header className="nd-article__head">
            <Link href={to("/blog")} className="nd-back nd-rise">
              <ArrowLeft size={14} aria-hidden="true" />
              Journal
            </Link>
            <h1 className="nd-article__title nd-rise" style={{ "--nd-i": 1 } as React.CSSProperties}>
              {post.title}
            </h1>
            <p className="nd-lede nd-rise" style={{ "--nd-i": 2 } as React.CSSProperties}>
              {post.description}
            </p>
            <div className="nd-article__meta nd-label">
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
            <div className="nd-article__cover">
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
          <div className="nd-prose" dangerouslySetInnerHTML={{ __html: post.html }} />

          {post.tags.length > 0 && (
            <ul className="nd-article__tags">
              {post.tags.map((tag) => (
                <li key={tag} className="nd-tag">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </article>
      </main>
      <Closing />
    </>
  );
}
