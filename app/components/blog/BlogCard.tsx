"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { BlogPostMeta } from "@/app/lib/blog";
import { BlogArt, ThumbnailPlaceholder, variantForIndex } from "@/app/components/blog/BlogArt";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/**
 * Square, sharp-cornered by request — a deliberate break from the site's
 * usual rounded-2xl card radius, so the blog grid reads as a distinct
 * content type from the project deck rather than a re-skin of it.
 *
 * Structure, top to bottom: overline (date · reading time) — an image
 * rectangle — title. The card's own bright background (BlogArt) is not the
 * image; the image is its own framed block sitting in the gap between them,
 * a real cover photo when a post has one, ThumbnailPlaceholder when it does
 * not.
 */
export function BlogCard({
  post,
  index,
  priority = false,
}: {
  post: BlogPostMeta;
  index: number;
  priority?: boolean;
}) {
  const [coverFailed, setCoverFailed] = useState(false);
  const variant = variantForIndex(index);
  const overline = `${formatDate(post.date)} · ${post.readingMinutes} min`;
  const showPlaceholder = !post.cover || coverFailed;

  return (
    <TransitionLink
      href={`/blog/${post.slug}`}
      label={post.title}
      className="group relative flex aspect-square w-full flex-col overflow-hidden rounded-none border border-edge-subtle transition-colors hover:border-edge-visible"
    >
      <BlogArt variant={variant} />

      <div className="relative flex h-full w-full flex-col gap-3 p-5">
        <span className="type-overline font-mono text-surface-void/70">{overline}</span>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-none border border-surface-void/15">
          {showPlaceholder ? (
            <ThumbnailPlaceholder title={post.title} />
          ) : (
            <Image
              src={post.cover as string}
              alt={post.title}
              fill
              priority={priority}
              loading={priority ? undefined : "lazy"}
              sizes="(max-width: 48rem) 100vw, (max-width: 64rem) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setCoverFailed(true)}
            />
          )}
        </div>

        <span className="type-card line-clamp-2 font-display text-surface-void underline-offset-2 hover:underline">
          {post.title}
        </span>

        {/* One row: tags on the start side, the read affordance on the end.
            The whole card is already a link — this is the explicit "yes,
            click through" cue readers look for, not a second link. */}
        <div className="mt-auto flex items-center justify-between gap-2">
          {post.tags.length > 0 ? (
            // Capped at 2: the card is a fixed square and this row does not
            // scroll, so the full list stays on the post page — a hint, not
            // the catalogue.
            <ul className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 2).map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-surface-void/25 px-2 py-0.5 font-mono text-[10px] text-surface-void/80"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}

          <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] tracking-[0.1em] text-surface-void/80 uppercase underline-offset-2 hover:underline">
            Read post
            <ArrowUpRight size={12} aria-hidden="true" />
          </span>
        </div>
      </div>
    </TransitionLink>
  );
}
