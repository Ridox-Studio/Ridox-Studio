import type { Metadata } from "next";
import { PageHeader } from "@/app/components/shared/PageHeader";
import { Container } from "@/app/components/shared/SectionHeader";
import { InquiryForm } from "@/app/components/contact/InquiryForm";
import { Reveal } from "@/app/components/shared/Reveal";
import { Footer } from "@/app/components/footer/Footer";
import { SITE } from "@/app/lib/site";

const description =
  "Start a project with Ridox Studio. Tell us what you are building and what is in the way — we reply to every enquiry within two working days.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact — ${SITE.name}`,
    description,
    url: `${SITE.url}/contact`,
  },
  twitter: { title: `Contact — ${SITE.name}`, description },
};

export default function ContactPage() {
  return (
    <main data-zone="amber" className="flex w-full flex-col">
      <PageHeader
        overline="Start a reaction"
        accent="amber"
        title="Contact"
        lede="No discovery-call funnel. Send the real problem and an engineer reads it."
      />

      <Container className="gap-16 pb-32">
        <div className="flex flex-col gap-12 md:flex-row md:gap-20">
          {/* Details column — stacks above the form on mobile (Section 13.9) */}
          <Reveal className="flex flex-col gap-8 md:w-72 md:shrink-0">
            <div className="flex flex-col gap-2">
              <h2 className="type-overline font-mono text-content-tertiary">Direct</h2>
              <a
                href={`mailto:${SITE.email}`}
                className="type-body text-content-primary transition-colors hover:text-amber-400"
              >
                {SITE.email}
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="type-overline font-mono text-content-tertiary">Response time</h2>
              <p className="type-body text-content-secondary">
                Two working days, with a real answer rather than a calendar link.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="type-overline font-mono text-content-tertiary">Elsewhere</h2>
              <ul className="flex flex-col gap-2">
                {Object.entries(SITE.social).map(([name, url]) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="type-body text-content-secondary capitalize transition-colors hover:text-indigo-300"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-1 flex-col">
            <InquiryForm />
          </Reveal>
        </div>
      </Container>

      <Footer />
    </main>
  );
}
