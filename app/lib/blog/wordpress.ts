import "server-only";
import readingTime from "reading-time";
import type { BlogPost, BlogPostMeta } from "./types";

/**
 * WordPress-as-blog-source. Talks to WordPress core's REST API only — no
 * custom plugin required on the WP side. Yoast SEO is optional: once it's
 * installed and active, it automatically adds a `yoast_head_json` field to
 * every post response (no separate "enable REST output" setting in current
 * Yoast versions — verified against a real install while building this) that
 * we read for description/OG data; when Yoast is absent everything falls
 * back to WordPress's own title/excerpt.
 *
 * See docs/BLOG_WORDPRESS_SETUP.md for the WordPress-side setup this
 * module assumes (post type REST-enabled, `_embed` support, etc — all of
 * which are WP core defaults, nothing to configure).
 */

/** How long a fetched response is trusted before Next re-requests it. Paired
 * with `export const revalidate` on the blog routes themselves, so both the
 * fetch cache and the prerendered page refresh on the same cadence. */
const REVALIDATE_SECONDS = 300;

function wpBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_WP_SERVER;
  if (!raw) return null;
  // Documented as including /wp-json (matches the pauaa convention this was
  // modelled on) — strip a trailing slash so path joins never double up.
  return raw.replace(/\/$/, "");
}

interface WPRendered {
  rendered: string;
}

interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

interface WPMediaSize {
  source_url: string;
}

interface WPFeaturedMedia {
  source_url: string;
  media_details?: { sizes?: Record<string, WPMediaSize> };
}

interface WPYoastImage {
  url: string;
}

interface WPYoastHeadJson {
  title?: string;
  description?: string;
  canonical?: string;
  og_title?: string;
  og_description?: string;
  og_image?: WPYoastImage[];
  article_published_time?: string;
  article_modified_time?: string;
}

interface WPPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  sticky?: boolean;
  title: WPRendered;
  excerpt: WPRendered;
  content: WPRendered;
  yoast_head_json?: WPYoastHeadJson;
  _embedded?: {
    "wp:featuredmedia"?: WPFeaturedMedia[];
    // WP nests embedded terms as one array per taxonomy queried
    // (categories, tags, ...) — flatten before use.
    "wp:term"?: WPTerm[][];
  };
}

async function wpFetch<T>(path: string): Promise<T> {
  const base = wpBaseUrl();
  if (!base) {
    throw new Error(
      "BLOG_SOURCE=wordpress but NEXT_PUBLIC_WP_SERVER is not set. " +
        "See docs/BLOG_WORDPRESS_SETUP.md.",
    );
  }

  const url = `${base}${path}`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });

  if (!res.ok) {
    throw new Error(`WordPress request failed (${res.status} ${res.statusText}): ${url}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Named + numeric HTML entity decoder. WordPress's REST API returns
 * `title.rendered`/`excerpt.rendered` etc. as HTML-entity-encoded text (e.g.
 * a post titled Editors' Picks comes back as `Editors&#8217; Picks`) — this
 * runs server-side (no DOM/DOMParser available), so entities are decoded by
 * hand rather than pulling in a dependency for it. Covers the entities WP
 * and Yoast actually emit; unrecognised named entities pass through as-is.
 */
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, body: string) => {
    if (body[0] === "#") {
      const codePoint =
        body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }
    return NAMED_ENTITIES[body] ?? match;
  });
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function descriptionFor(post: WPPost): string {
  const yoast = post.yoast_head_json?.og_description || post.yoast_head_json?.description;
  if (yoast) return decodeEntities(yoast).trim();

  const fromExcerpt = stripHtml(post.excerpt?.rendered ?? "");
  if (fromExcerpt) return fromExcerpt.slice(0, 200);

  return stripHtml(post.content?.rendered ?? "").slice(0, 200);
}

function coverFor(post: WPPost): string | undefined {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return undefined;

  return (
    media.media_details?.sizes?.large?.source_url ??
    media.media_details?.sizes?.medium_large?.source_url ??
    media.source_url
  );
}

/**
 * The markdown source's `tags` frontmatter is a flat, free-form list — the
 * direct WordPress equivalent is the Tags taxonomy (post_tag), not
 * Categories (hierarchical, and every post has one whether an editor set it
 * or not — WP defaults to "Uncategorized"). Real tags win when a post has
 * them; categories are only a fallback so a post that was only ever
 * categorised still shows something, with "Uncategorized" itself filtered
 * out as noise rather than a real label.
 */
function tagsFor(post: WPPost): string[] {
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  const names = (taxonomy: string) =>
    terms.filter((term) => term.taxonomy === taxonomy).map((term) => decodeEntities(term.name));

  const tags = names("post_tag");
  if (tags.length > 0) return tags;

  return names("category").filter((name) => name.toLowerCase() !== "uncategorized");
}

function toMeta(post: WPPost): BlogPostMeta {
  const html = post.content?.rendered ?? "";

  return {
    slug: post.slug,
    // Deliberately WordPress's own post title, not yoast_head_json.title —
    // Yoast's SEO title is typically "Post Title - Site Name" (a search
    // snippet), which would duplicate the " — Ridox Studio" suffix
    // buildPageMetadata() already appends and show twice in the <h1>.
    title: decodeEntities(post.title?.rendered ?? "Untitled"),
    description: descriptionFor(post),
    date: post.date,
    updated: post.modified && post.modified !== post.date ? post.modified : undefined,
    tags: tagsFor(post),
    readingMinutes: Math.max(1, Math.round(readingTime(stripHtml(html)).minutes)),
    cover: coverFor(post),
    // WordPress's own "stick this post to the front" flag — the exact same
    // concept as the markdown source's `pinned` frontmatter field.
    pinned: post.sticky === true,
  };
}

/**
 * Every published post, newest first, sticky posts leading — same ordering
 * contract as the markdown source's getAllPosts(), so switching BLOG_SOURCE
 * never changes the sort a reader sees.
 *
 * `_embed=1` pulls the featured image and taxonomy terms in the same
 * request (WordPress core support, no plugin needed) rather than the
 * separate per-post media lookup an unembedded integration would need.
 *
 * Fails soft: if WordPress is unreachable this returns an empty list (the
 * index page already renders a "nothing published yet" state for that
 * case) rather than crashing the page — matching the markdown source's
 * behaviour of never taking the whole route down over one bad post.
 */
export async function getAllPosts(): Promise<BlogPostMeta[]> {
  try {
    const posts = await wpFetch<WPPost[]>("/wp/v2/posts?_embed=1&per_page=50&orderby=date&order=desc");

    return posts
      .map(toMeta)
      .sort((a, b) => {
        if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
        return a.date < b.date ? 1 : -1;
      });
  } catch (error) {
    console.error("[blog/wordpress] getAllPosts failed:", error);
    return [];
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  return (await getAllPosts()).map((post) => post.slug);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const posts = await wpFetch<WPPost[]>(
      `/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`,
    );
    const post = posts[0];
    if (!post) return undefined;

    return {
      ...toMeta(post),
      // WordPress's editor output is already full HTML — same first-party
      // trust boundary as the compiled markdown source (see types.ts):
      // written by us, in our own WordPress, never end-user input.
      html: post.content?.rendered ?? "",
    };
  } catch (error) {
    console.error(`[blog/wordpress] getPostBySlug(${slug}) failed:`, error);
    return undefined;
  }
}
