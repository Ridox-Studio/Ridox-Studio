import type { Metadata } from "next";
import { PageHeader } from "@/app/components/shared/PageHeader";
import { Container } from "@/app/components/shared/SectionHeader";
import { ProjectGallery } from "@/app/components/projects/ProjectGallery";
import { ContactSection } from "@/app/components/contact/ContactSection";
import { Footer } from "@/app/components/footer/Footer";
import { getWorkProjects } from "@/app/data/projects";
import { buildPageMetadata } from "@/app/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Work",
  description:
    "Case studies from Ridox Studio — web applications, mobile platforms and enterprise systems built for clients across industries.",
  path: "/work",
});

export default function WorkPage() {
  const projects = getWorkProjects();

  return (
    <main data-zone="indigo" className="flex w-full flex-col">
      <PageHeader
        overline="Client work & consulting"
        accent="indigo"
        title="Selected work"
        lede="Commissioned builds and advisory engagements. Not every useful piece of work is a six-month contract, so the short ones are here too."
      />
      <Container className="pb-24">
        <ProjectGallery projects={projects} />
      </Container>
      <ContactSection />
      <Footer />
    </main>
  );
}
