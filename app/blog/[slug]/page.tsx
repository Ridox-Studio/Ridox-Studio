import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/app/components/shared/SectionHeader";
import { Reveal } from "@/app/components/shared/Reveal";
import { ImageLightbox } from "@/app/components/blog/ImageLightbox";
import { ContactSection } from "@/app/components/contact/ContactSection";
import { Footer } from "@/app/components/footer/Footer";
import { buildPageMetadata } from "@/app/lib/metadata";
import { SITE } from "@/app/lib/site";
import { getAllPostSlugs, getPostBySlug } from "@/app/lib/blog";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const postUrl = `${SITE.url}/blog/${post.slug}`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: postUrl,
    mainEntityOfPage: postUrl,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/logos/ridox-studio-logo.svg` },
    },
    keywords: post.tags.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  return (
    <main data-zone="indigo" className="flex w-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <header className="relative flex w-full flex-col overflow-hidden pt-24 pb-10 md:pt-32 md:pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--gradient-indigo-fade)" }}
        />
        <Container className="relative gap-6">
          <Reveal className="flex flex-col gap-6">
            <p className="type-overline font-mono text-indigo-300">The blog</p>
            <h1 className="type-hero font-display text-content-primary">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 type-overline font-mono text-content-tertiary">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true">◆</span>
              <span>{post.readingMinutes} min read</span>
              {post.updated && post.updated !== post.date && (
                <>
                  <span aria-hidden="true">◆</span>
                  <span>Updated {formatDate(post.updated)}</span>
                </>
              )}
            </div>
          </Reveal>
        </Container>
      </header>

      <Container className="pb-24">
        <ImageLightbox>
          {/* Mobile/tablet only: a plain full-width banner above the article.
              Below `lg` there is no meaningful gutter to float into, so this
              is a separate, simpler render path rather than an unfloated
              version of the desktop image. */}
          {post.cover && (
            <Reveal className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl border border-edge-subtle bg-surface-void lg:hidden">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </Reveal>
          )}

          <Reveal
            delay={0.1}
            // flow-root: a floated child collapses its parent's height unless
            // something clears it, which would let the float bleed into the
            // tags list and ContactSection below. This is the modern
            // clearfix — contain the float without a stray empty <div>.
            className="prose-ridox flow-root"
          >
            {/* Desktop only, and only when there is a cover: floated at a
                fixed size rather than reserved in its own flex column, so it
                only pushes text aside for as long as it is actually there.
                The first few paragraphs wrap beside it; once the article
                scrolls past its height, later paragraphs return to the full
                column width on their own — no breakpoint can do that, only
                a real CSS float can. */}
            {post.cover && (
              <div className="relative float-right mb-6 ml-8 hidden aspect-[4/3] w-80 overflow-hidden rounded-2xl border border-edge-subtle bg-surface-void lg:block xl:w-96">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  sizes="(max-width: 80rem) 20rem, 24rem"
                  className="object-cover"
                />
              </div>
            )}

            {/* Compiled from content/blog/<slug>.md — first-party content
                only, never end-user input. See the trust boundary noted in
                lib/blog.ts. */}
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </Reveal>
        </ImageLightbox>

        {post.tags.length > 0 && (
          <ul className="mt-12 flex flex-wrap gap-2 border-t border-edge-subtle pt-8">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-edge-subtle px-3 py-1 font-mono text-xs text-content-secondary"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </Container>

      <ContactSection />
      <Footer />
    </main>
  );
}
