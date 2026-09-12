import type { Metadata } from "next";
import { PageHeader } from "@/app/components/shared/PageHeader";
import { Container } from "@/app/components/shared/SectionHeader";
import { RevealGroup, RevealItem } from "@/app/components/shared/Reveal";
import { BlogCard } from "@/app/components/blog/BlogCard";
import { ContactSection } from "@/app/components/contact/ContactSection";
import { Footer } from "@/app/components/footer/Footer";
import { buildPageMetadata } from "@/app/lib/metadata";
import { getAllPosts } from "@/app/lib/blog";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog",
  description:
    "Decisions from inside the build — why RISMS never holds a school's fees, what breaks when AI-built products meet production, and the rest of what we learn shipping.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main data-zone="indigo" className="flex w-full flex-col">
      <PageHeader
        overline="The blog"
        accent="indigo"
        title="Decisions, not adjectives"
        lede="What we actually found in the code, and the reasoning behind the calls we made — written down so the next person does not have to relearn it."
      />

      <Container className="gap-12 pb-24">
        {posts.length === 0 ? (
          <p className="type-body text-content-secondary">
            Nothing published yet — the first post is on its way.
          </p>
        ) : (
          <RevealGroup
            as="ul"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.08}
          >
            {posts.map((post, index) => (
              <RevealItem as="li" key={post.slug}>
                <BlogCard post={post} index={index} priority={index === 0} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </Container>

      <ContactSection />
      <Footer />
    </main>
  );
}
