import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/app/lib/blog";
import { End, PageHead } from "../../_components/chrome";
import { formatDate } from "../../_lib/format";
import { to } from "../../_lib/paths";

export const metadata: Metadata = { title: "Journal" };

export const revalidate = 300;

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <>
      <main className="nx-stack">
        <PageHead
          label="Journal"
          title="Decisions, not adjectives"
          lede="What we actually found in the code, and the reasoning behind the calls we made, written down so the next person does not have to relearn it."
        />
        <section className="nx-band" style={{ paddingTop: 0 }}>
          <div className="nx-wrap">
            {posts.length === 0 ? (
              <p className="nx-body">Nothing published yet. The first post is on its way.</p>
            ) : (
              <div className="nx-posts">
                {posts.map((post) => (
                  <Link key={post.slug} href={to(`/blog/${post.slug}`)} className="nx-post">
                    <time className="nx-label nx-label--num nx-post__date" dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    <div className="nx-post__title nx-stack" style={{ gap: "var(--nx-2)" }}>
                      <h2 className="nx-h3">{post.title}</h2>
                      <p className="nx-body" style={{ maxWidth: "40rem" }}>
                        {post.description}
                      </p>
                    </div>
                    <span className="nx-label nx-post__end">{post.readingMinutes} min</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <End />
    </>
  );
}
