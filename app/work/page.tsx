import type { Metadata } from "next";
import { PageHeader } from "@/app/components/shared/PageHeader";
import { Container } from "@/app/components/shared/SectionHeader";
import { ProjectGallery } from "@/app/components/projects/ProjectGallery";
import { ContactSection } from "@/app/components/contact/ContactSection";
import { Footer } from "@/app/components/footer/Footer";
import { getProjectsByCategory } from "@/app/data/projects";
import { SITE } from "@/app/lib/site";

const description =
  "Case studies and project showcases from Ridox Studio. Web applications, mobile platforms, and enterprise systems built for clients across industries.";

export const metadata: Metadata = {
  title: "Client Work",
  description,
  alternates: { canonical: "/work" },
  openGraph: {
    title: `Client Work — ${SITE.name}`,
    description,
    url: `${SITE.url}/work`,
    // og:image comes from app/work/opengraph-image.tsx
  },
  twitter: {
    title: `Client Work — ${SITE.name}`,
    description,
  },
};

export default function WorkPage() {
  const projects = getProjectsByCategory("client");

  return (
    <main data-zone="indigo" className="flex w-full flex-col">
      <PageHeader
        overline="Client work"
        accent="indigo"
        title="Case studies"
        lede="Every engagement below started with a system under strain. These are the constraints we found, the architecture we chose, and what changed after."
      />
      <Container className="pb-24">
        <ProjectGallery projects={projects} />
      </Container>
      <ContactSection />
      <Footer />
    </main>
  );
}
