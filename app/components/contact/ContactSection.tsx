import { Container } from "@/app/components/shared/SectionHeader";
import { MagneticButton } from "@/app/components/shared/MagneticButton";
import { Reveal } from "@/app/components/shared/Reveal";
import { SITE } from "@/app/lib/site";

/** Homepage closer — one bold CTA, routed through the Redox Door. */
export function ContactSection() {
  return (
    <section
      data-zone="amber"
      className="relative flex w-full flex-col overflow-hidden py-28 md:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-amber-fade)" }}
      />
      <Container className="relative items-center gap-10 text-center">
        <Reveal className="flex flex-col items-center gap-6">
          <p className="type-overline font-mono text-amber-400">Start here</p>
          <h2 className="type-hero font-display text-content-primary">
            Start a Reaction
          </h2>
          <p className="type-body max-w-xl text-content-secondary">
            Tell us what you are building and what is currently in the way. We reply to
            every enquiry within two working days — with a real answer, not a calendar
            link.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col items-center gap-4">
          <MagneticButton href="/contact" label="Contact">
            Start a reaction
          </MagneticButton>
          <a
            href={`mailto:${SITE.email}`}
            className="font-mono text-xs tracking-[0.15em] text-content-tertiary uppercase transition-colors hover:text-indigo-300"
          >
            or {SITE.email}
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
