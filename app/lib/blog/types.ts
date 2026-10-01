/**
 * Shared shape both blog sources (markdown, WordPress) produce. Every
 * page/component in app/blog/* and app/sitemap.ts depends only on these
 * types and the three functions re-exported from ./index — never on a
 * specific source module — so swapping BLOG_SOURCE never touches them.
 */
export interface BlogPostMeta {
  slug: string;
  title: string;
  /** Search-snippet and social-card text — keep it under ~155 characters. */
  description: string;
  date: string;
  /** Omitted unless the post was actually revised after publishing. */
  updated?: string;
  tags: string[];
  readingMinutes: number;
  /**
   * Path or URL to a real cover image, if one exists. Under the markdown
   * source this is almost never set — the card grid falls back to a
   * code-generated tile (BlogArt) whenever it's absent. Under the WordPress
   * source it's the post's featured image, when one is set.
   */
  cover?: string;
  /** Pinned posts always lead the listing, ahead of date order. */
  pinned?: boolean;
}

export interface BlogPost extends BlogPostMeta {
  /**
   * Compiled, ready-to-render HTML. Under both sources this is first-party
   * content only (written by us — markdown in the repo, or posts in our own
   * WordPress — never end-user input), which is what makes rendering it via
   * dangerouslySetInnerHTML safe without a sanitisation pass. See the
   * per-source trust notes in markdown.ts / wordpress.ts.
   */
  html: string;
}
