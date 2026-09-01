import type { Metadata } from "next";
import { PageHeader } from "@/app/components/shared/PageHeader";
import { Container } from "@/app/components/shared/SectionHeader";
import { ProjectGallery } from "@/app/components/projects/ProjectGallery";
import { ContactSection } from "@/app/components/contact/ContactSection";
import { Footer } from "@/app/components/footer/Footer";
import { getProjectsByCategory } from "@/app/data/projects";
import { buildPageMetadata } from "@/app/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Studio Products",
  description:
    "Products and open-source tools built by Ridox Studio — developer tooling, observability and design-token infrastructure born out of client work.",
  path: "/studio",
});

export default function StudioPage() {
  const projects = getProjectsByCategory("studio");

  return (
    <main data-zone="amber" className="flex w-full flex-col">
      <PageHeader
        overline="Studio products"
        accent="amber"
        title="Our own products"
        lede="We build and run our own products. They are how we prove the process before we sell it to anyone — the same architecture, the same standards, our own money."
      />
      <Container className="pb-24">
        <ProjectGallery projects={projects} />
      </Container>
      <ContactSection />
      <Footer />
    </main>
  );
}
