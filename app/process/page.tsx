import type { Metadata } from "next";
import { PageHeader } from "@/app/components/shared/PageHeader";
import { Container } from "@/app/components/shared/SectionHeader";
import { ProcessTimeline } from "@/app/components/process/ProcessTimeline";
import { HorizontalScroll } from "@/app/components/services/HorizontalScroll";
import { SectionHeader } from "@/app/components/shared/SectionHeader";
import { Reveal } from "@/app/components/shared/Reveal";
import { ContactSection } from "@/app/components/contact/ContactSection";
import { Footer } from "@/app/components/footer/Footer";
import { PROCESS_STEPS, SERVICES } from "@/app/data/content";
import { buildPageMetadata } from "@/app/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Process",
  description:
    "How a Ridox Studio engagement runs: discovery, architecture and system design, engineering and iteration, then launch and equilibrium.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <main className="flex w-full flex-col">
      <PageHeader
        overline="The process"
        accent="amber"
        title="Four phases"
        lede="No engagement starts with a proposal. It starts with us reading your system and telling you what we actually found — in writing, whether or not you hire us."
      />

      <section data-zone="amber" className="flex w-full flex-col pb-24">
        <Container>
          <ProcessTimeline steps={PROCESS_STEPS} />
        </Container>
      </section>

      <section data-zone="indigo" className="flex w-full flex-col gap-12 pb-24">
        <Container>
          <Reveal>
            <SectionHeader
              overline="Capabilities"
              accent="indigo"
              title="What runs through those phases"
              lede="The same process applies whichever surface the work lands on."
            />
          </Reveal>
        </Container>
        <HorizontalScroll services={SERVICES} />
      </section>

      <ContactSection />
      <Footer />
    </main>
  );
}
