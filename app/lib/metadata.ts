import type { Metadata } from "next";
import { SITE } from "@/app/lib/site";

/** Google truncates search titles past roughly this length. */
const TITLE_LIMIT = 60;
/** Search snippets are cut around 150–160 characters. */
const DESCRIPTION_LIMIT = 155;

/** Trims to a word boundary rather than mid-word, adding an ellipsis. */
export function clamp(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit - 1);
  const boundary = cut.lastIndexOf(" ");
  return `${(boundary > limit * 0.6 ? cut.slice(0, boundary) : cut).trimEnd()}…`;
}

type PageMetadataInput = {
  /** Page title WITHOUT the site suffix — the layout template appends it. */
  title: string;
  /** Meta description. Clamped to the search-snippet limit. */
  description: string;
  /** Route path, e.g. "/work". Used for the canonical URL. */
  path: string;
  /** Shorter line for social cards, where space is tighter. Defaults to `description`. */
  socialDescription?: string;
  /** Full title for social cards, if it should differ from the page title. */
  socialTitle?: string;
  type?: "website" | "article";
};

/**
 * Builds a complete metadata object for a route.
 *
 * Next.js merges metadata SHALLOWLY: a page's `openGraph` or `twitter` object
 * replaces the parent's outright rather than merging into it. Setting either
 * one on a page therefore drops `siteName`, `locale` and `card` from the root
 * layout — which silently produces anonymous Discord cards and small X
 * thumbnails. Every route builds its social objects here so those fields are
 * always present.
 *
 * `og:image` is intentionally absent: the opengraph-image.tsx file convention
 * supplies it per route, and specifying it here would override that.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  socialDescription,
  socialTitle,
  type = "website",
}: PageMetadataInput): Metadata {
  const pageTitle = clamp(title, TITLE_LIMIT);
  const fullTitle = `${pageTitle} — ${SITE.name}`;
  const metaDescription = clamp(description, DESCRIPTION_LIMIT);
  const social = clamp(socialDescription ?? description, DESCRIPTION_LIMIT);

  return {
    title: pageTitle,
    description: metaDescription,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle ?? fullTitle,
      description: social,
      url: `${SITE.url}${path === "/" ? "" : path}`,
      siteName: SITE.name,
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitter,
      creator: SITE.twitter,
      title: socialTitle ?? fullTitle,
      description: social,
    },
  };
}
