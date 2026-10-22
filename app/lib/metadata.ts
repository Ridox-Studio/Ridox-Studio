import type { Metadata } from "next";
import { SITE } from "@/app/lib/site";

/** Google truncates search titles past roughly this length. */
const TITLE_LIMIT = 60;
/** Search snippets are cut around 150–160 characters. */
const DESCRIPTION_LIMIT = 155;
/** Appended to page titles; matches the root layout's title.template. */
export const TITLE_SUFFIX = ` | ${SITE.name}`;

/**
 * The full title a page renders with. Titles are never clamped: one cut off
 * mid-sentence reads worse in a search result than one without the brand.
 * So the suffix is added only when the whole string still fits; otherwise
 * the title stands alone.
 */
export function resolveTitle(title: string): { fits: boolean; full: string } {
  const withSuffix = `${title}${TITLE_SUFFIX}`;
  return withSuffix.length <= TITLE_LIMIT
    ? { fits: true, full: withSuffix }
    : { fits: false, full: title };
}

/**
 * Like clamp, but prefers ending on a whole sentence: keeps as many complete
 * sentences as fit, and only falls back to a word-boundary ellipsis when even
 * the first sentence is too long.
 */
function clampToSentences(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) ?? [];
  let kept = "";
  for (const sentence of sentences) {
    if ((kept + sentence).trimEnd().length > limit) break;
    kept += sentence;
  }
  return kept.trim() || clamp(text, limit);
}

/** Trims to a word boundary rather than mid-word, adding an ellipsis. */
export function clamp(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit - 1);
  const boundary = cut.lastIndexOf(" ");
  return `${(boundary > limit * 0.6 ? cut.slice(0, boundary) : cut).trimEnd()}…`;
}

type PageMetadataInput = {
  /** Page title WITHOUT the site suffix; it is appended when it fits. */
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
  const { fits, full: fullTitle } = resolveTitle(title);
  const metaDescription = clampToSentences(description, DESCRIPTION_LIMIT);
  const social = clampToSentences(socialDescription ?? description, DESCRIPTION_LIMIT);

  return {
    // `absolute` skips the layout's "%s | Ridox Studio" template.
    title: fits ? title : { absolute: title },
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
