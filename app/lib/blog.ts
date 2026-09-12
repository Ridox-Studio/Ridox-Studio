import "server-only";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

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
   * Path to a real cover image, if one exists. Almost never set — the card
   * grid falls back to a code-generated tile (BlogArt) whenever this is
   * absent, so a post never has to wait on a screenshot before it can ship.
   */
  cover?: string;
}

export interface BlogPost extends BlogPostMeta {
  /** Compiled, ready-to-render HTML — never raw markdown, never user input. */
  html: string;
}

type Frontmatter = {
  title?: string;
  description?: string;
  // YAML parses an unquoted date literal (date: 2026-08-14) into a JS Date,
  // not a string — gray-matter does not stop this. toIsoDate() below is what
  // actually enforces the string type this alias claims, regardless of how
  // a post's frontmatter happens to be written.
  date?: string | Date;
  updated?: string | Date;
  tags?: string[];
  cover?: string;
  draft?: boolean;
};

/** Normalises a frontmatter date to `YYYY-MM-DD`, whichever form YAML gave us. */
function toIsoDate(value: string | Date): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString().slice(0, 10);
}

/**
 * GitHub-style alert blockquotes:
 *
 *   > [!NOTE]
 *   > Text here.
 *
 * remark-gfm does not cover these — they are a GitHub extension, not part of
 * the GFM spec — so this is a small custom transform rather than another
 * dependency. It strips the `[!TYPE]` marker and tags the blockquote with the
 * hast properties `rehype-stringify` needs to render `<div class="callout
 * callout-note">`, matching the syntax already used in the RISMS docs.
 */
const CALLOUT_TYPES = ["NOTE", "TIP", "WARNING", "IMPORTANT", "CAUTION"];

function remarkCallouts() {
  return (tree: import("mdast").Root) => {
    visit(tree, "blockquote", (node) => {
      const firstParagraph = node.children[0];
      if (!firstParagraph || firstParagraph.type !== "paragraph") return;

      const firstText = firstParagraph.children[0];
      if (!firstText || firstText.type !== "text") return;

      const match = /^\[!(\w+)\]\s*/.exec(firstText.value);
      const type = match?.[1]?.toUpperCase();
      if (!match || !type || !CALLOUT_TYPES.includes(type)) return;

      firstText.value = firstText.value.slice(match[0].length);
      if (firstText.value === "") firstParagraph.children.shift();

      node.data = {
        ...node.data,
        hName: "div",
        hProperties: { className: ["callout", `callout-${type.toLowerCase()}`] },
      };
    });
  };
}

/**
 * Content is first-party only — every post here is written by us and
 * reviewed before it merges. `allowDangerousHtml` is safe under that
 * assumption and is what lets a post embed a <figure> or similar when
 * markdown alone cannot express it.
 *
 * Never point this pipeline at anything a site visitor can submit without
 * adding sanitisation (e.g. rehype-sanitize) first — raw HTML passthrough
 * and untrusted input do not mix.
 */
function compileMarkdown(markdown: string): string {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkCallouts)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .processSync(markdown);

  return String(file);
}

function readSlugs(): string[] {
  return readdirSync(BLOG_DIR)
    // README.md documents the frontmatter shape for whoever writes the next
    // post — it is not itself a post, and has none of the required fields.
    .filter((file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md")
    .map((file) => file.replace(/\.md$/, ""));
}

function readRaw(slug: string): { frontmatter: Frontmatter; body: string } {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  const source = readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  return { frontmatter: data as Frontmatter, body: content };
}

function toMeta(slug: string, frontmatter: Frontmatter, body: string): BlogPostMeta {
  if (!frontmatter.title || !frontmatter.description || !frontmatter.date) {
    throw new Error(
      `content/blog/${slug}.md is missing required frontmatter (title, description, date).`,
    );
  }

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: toIsoDate(frontmatter.date),
    updated: frontmatter.updated ? toIsoDate(frontmatter.updated) : undefined,
    tags: frontmatter.tags ?? [],
    readingMinutes: Math.max(1, Math.round(readingTime(body).minutes)),
    cover: frontmatter.cover,
  };
}

/** Every published post, newest first. Draft posts are hidden outside development. */
export function getAllPosts(): BlogPostMeta[] {
  const showDrafts = process.env.NODE_ENV !== "production";

  return readSlugs()
    .map((slug) => {
      const { frontmatter, body } = readRaw(slug);
      return { frontmatter, meta: toMeta(slug, frontmatter, body) };
    })
    .filter(({ frontmatter }) => showDrafts || !frontmatter.draft)
    .map(({ meta }) => meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  let raw: ReturnType<typeof readRaw>;
  try {
    raw = readRaw(slug);
  } catch {
    return undefined;
  }

  const { frontmatter, body } = raw;
  if (frontmatter.draft && process.env.NODE_ENV === "production") return undefined;

  return {
    ...toMeta(slug, frontmatter, body),
    html: compileMarkdown(body),
  };
}
