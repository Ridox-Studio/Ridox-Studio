import "server-only";
import * as markdownSource from "./markdown";
import * as wordpressSource from "./wordpress";
import type { BlogPost, BlogPostMeta } from "./types";

export type { BlogPost, BlogPostMeta } from "./types";

/**
 * Single switch for where blog content comes from, read fresh on every call
 * rather than cached at module-load time — cheap, and it means a changed
 * env var always takes effect without any extra invalidation logic.
 *
 * BLOG_SOURCE unset or anything other than "wordpress" -> markdown
 * (content/blog/*.md, today's behaviour, requires no configuration).
 * BLOG_SOURCE=wordpress -> WordPress REST API (see wordpress.ts and
 * docs/BLOG_WORDPRESS_SETUP.md for the required NEXT_PUBLIC_WP_SERVER).
 */
function isWordPressSource(): boolean {
  return process.env.BLOG_SOURCE === "wordpress";
}

/**
 * Every published post, newest first (pinned/sticky posts lead). The only
 * function every blog route calls to build a listing — see app/blog/page.tsx
 * and app/sitemap.ts.
 */
export async function getAllPosts(): Promise<BlogPostMeta[]> {
  return isWordPressSource() ? wordpressSource.getAllPosts() : markdownSource.getAllPosts();
}

/** Slugs only, for generateStaticParams — app/blog/[slug]/page.tsx and its opengraph-image route. */
export async function getAllPostSlugs(): Promise<string[]> {
  return isWordPressSource() ? wordpressSource.getAllPostSlugs() : markdownSource.getAllPostSlugs();
}

/** A single post with its compiled/rendered HTML body, or undefined if the slug doesn't exist (-> notFound()). */
export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return isWordPressSource() ? wordpressSource.getPostBySlug(slug) : markdownSource.getPostBySlug(slug);
}
