import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/app/lib/blog";
import { Closing, PageHead } from "../../_components/chrome";
import { formatDate } from "../../_lib/format";
import { to } from "../../_lib/paths";

export const metadata: Metadata = { title: "Journal" };

export const revalidate = 300;

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <>
      <main className="nd-stack">
        <PageHead
          label="Journal"
          accent="indigo"
          title={
            <>
              Decisions, not <em>adjectives.</em>
            </>
          }
          lede="What we actually found in the code, and the reasoning behind the calls we made, written down so the next person does not have to relearn it."
        />
        <section className="nd-section" style={{ paddingTop: 0 }}>
          <div className="nd-wrap">
            {posts.length === 0 ? (
              <p className="nd-body">Nothing published yet. The first post is on its way.</p>
            ) : (
              <div className="nd-rows">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={to(`/blog/${post.slug}`)}
                    className="nd-row nd-row--post"
                  >
                    <time className="nd-label" dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    <div className="nd-row__body">
                      <h2 className="nd-h3 nd-row__title">{post.title}</h2>
                      <p className="nd-small">{post.description}</p>
                    </div>
                    <span className="nd-label nd-row__end">{post.readingMinutes} min read</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Closing />
    </>
  );
}
