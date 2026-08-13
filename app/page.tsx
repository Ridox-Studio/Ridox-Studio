import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { OpeningCanvas } from "@/app/components/opening/OpeningCanvas";
import { VelocityMarquee } from "@/app/components/marquee/VelocityMarquee";
import { ProjectDeck } from "@/app/components/projects/ProjectDeck";
import { HorizontalScroll } from "@/app/components/services/HorizontalScroll";
import { ProcessTimeline } from "@/app/components/process/ProcessTimeline";
import { ContactSection } from "@/app/components/contact/ContactSection";
import { Footer } from "@/app/components/footer/Footer";
import { Container, SectionHeader } from "@/app/components/shared/SectionHeader";
import { SectionRail } from "@/app/components/shared/SectionRail";
import { Reveal } from "@/app/components/shared/Reveal";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";
import { MARQUEE_LINES, PROCESS_STEPS, SERVICES } from "@/app/data/content";
import { getFeatured, getProjectsByCategory, getWorkProjects } from "@/app/data/projects";
import { buildPageMetadata } from "@/app/lib/metadata";
import { SITE } from "@/app/lib/site";

// The homepage sets its own full title rather than taking the "%s — Ridox
// Studio" template, which would repeat the name.
export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Engineered at the Reaction Point",
    description: SITE.description,
    path: "/",
    socialDescription:
      "Software engineering agency balancing design energy with engineering depth.",
  }),
  title: `${SITE.name} — Engineered at the Reaction Point`,
};

const linkClass =
  "inline-flex w-fit items-center gap-2 font-mono text-xs tracking-[0.15em] uppercase transition-colors";

export default function HomePage() {
  const clientWork = getFeatured(getWorkProjects(), 3);
  const studioWork = getFeatured(getProjectsByCategory("studio"), 3);

  return (
    <main className="flex w-full flex-col">
      <OpeningCanvas />

      <VelocityMarquee top={MARQUEE_LINES.first} bottom={MARQUEE_LINES.second} />

      <section data-zone="indigo" className="flex w-full flex-col gap-8 py-8">
        <Container>
          <Reveal>
            <SectionHeader
              overline="Client work"
              accent="indigo"
              title="Work we can talk through line by line"
              lede="Commissioned builds and advisory work. Fewer engagements than a big agency lists, each one we can talk through line by line."
              action={
                <TransitionLink
                  href="/work"
                  label="Work"
                  className={`${linkClass} text-indigo-300 hover:text-indigo-200`}
                >
                  View all work
                  <ArrowUpRight size={14} aria-hidden="true" />
                </TransitionLink>
              }
            />
          </Reveal>
        </Container>
        <SectionRail
          overline="Client work"
          accent="indigo"
          title="Work we can talk through line by line"
          action={
            <TransitionLink
              href="/work"
              label="Work"
              className={`${linkClass} shrink-0 text-indigo-300 hover:text-indigo-200`}
            >
              All work
              <ArrowUpRight size={14} aria-hidden="true" />
            </TransitionLink>
          }
        />
        <Container>
          <ProjectDeck projects={clientWork} />
        </Container>
      </section>

      <VelocityMarquee top={MARQUEE_LINES.second} bottom={MARQUEE_LINES.first} />

      <section data-zone="amber" className="flex w-full flex-col gap-8 py-8">
        <Container>
          <Reveal>
            <SectionHeader
              overline="Studio products"
              accent="amber"
              title="Products we build and run ourselves"
              lede="We are a product studio that takes client work. These are ours — shipped, maintained, and the reason we know what we are selling."
              action={
                <TransitionLink
                  href="/studio"
                  label="Studio"
                  className={`${linkClass} text-amber-400 hover:text-amber-300`}
                >
                  Explore studio
                  <ArrowUpRight size={14} aria-hidden="true" />
                </TransitionLink>
              }
            />
          </Reveal>
        </Container>
        <SectionRail
          overline="Studio products"
          title="Products we build and run ourselves"
          action={
            <TransitionLink
              href="/studio"
              label="Studio"
              className={`${linkClass} shrink-0 text-amber-400 hover:text-amber-300`}
            >
              All products
              <ArrowUpRight size={14} aria-hidden="true" />
            </TransitionLink>
          }
        />
        <Container>
          <ProjectDeck projects={studioWork} />
        </Container>
      </section>

      <section data-zone="indigo" className="flex w-full flex-col gap-8 py-14">
        <Container>
          <Reveal>
            <SectionHeader
              overline="Capabilities"
              accent="indigo"
              title="Five surfaces, one system"
              lede="We do not sell isolated deliverables. Every capability below exists because the others need it."
            />
          </Reveal>
        </Container>
        <SectionRail
          overline="Capabilities"
          accent="indigo"
          title="Five surfaces, one system"
        />
        <HorizontalScroll services={SERVICES} />
      </section>

      <section data-zone="amber" className="flex w-full flex-col gap-8 py-14">
        <Container className="gap-8">
          <Reveal>
            <SectionHeader
              overline="The process"
              accent="amber"
              title="How an engagement actually runs"
              lede="Four phases, each with a written artefact you keep whether or not we continue."
              action={
                <TransitionLink
                  href="/process"
                  label="Process"
                  className={`${linkClass} text-amber-400 hover:text-amber-300`}
                >
                  Read the full process
                  <ArrowUpRight size={14} aria-hidden="true" />
                </TransitionLink>
              }
            />
          </Reveal>
          <ProcessTimeline steps={PROCESS_STEPS} />
        </Container>
      </section>

      <ContactSection />
      <Footer />
    </main>
  );
}
