import type { Metadata } from "next";
import { SITE } from "@/app/lib/site";
import { End, PageHead } from "../../_components/chrome";
import { InquiryForm } from "../../_components/InquiryForm";

export const metadata: Metadata = { title: "Contact" };

const SOCIAL_LABEL: Record<string, string> = {
  x: "X",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  github: "GitHub",
};

export default function ContactPage() {
  return (
    <>
      <main className="nx-stack">
        <PageHead
          label="Start a project"
          title="Send the real problem"
          lede="No discovery-call funnel. Tell us what you are building and what is in the way, and an engineer reads it."
        />
        <section className="nx-band" style={{ paddingTop: 0 }}>
          <div className="nx-wrap">
            <div className="nx-grid">
              <div className="nx-col-label nx-contact__details">
                <div className="nx-stack" style={{ gap: "var(--nx-2)" }}>
                  <h2 className="nx-label">Direct</h2>
                  <a href={`mailto:${SITE.email}`} className="nx-link">
                    {SITE.email}
                  </a>
                </div>
                <div className="nx-stack" style={{ gap: "var(--nx-2)" }}>
                  <h2 className="nx-label">Response time</h2>
                  <p className="nx-body">
                    Two working days, with a real answer rather than a calendar link.
                  </p>
                </div>
                <div className="nx-stack" style={{ gap: "var(--nx-2)" }}>
                  <h2 className="nx-label">What happens next</h2>
                  <p className="nx-body">
                    A written analysis and a recommended path. It is yours to keep, whether or not
                    we build it together.
                  </p>
                </div>
                <div className="nx-stack" style={{ gap: "var(--nx-2)" }}>
                  <h2 className="nx-label">Elsewhere</h2>
                  <ul className="nx-stack">
                    {Object.entries(SITE.social).map(([name, url]) => (
                      <li key={name}>
                        <a href={url} target="_blank" rel="noreferrer noopener" className="nx-link">
                          {SOCIAL_LABEL[name] ?? name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="nx-col-main">
                <InquiryForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <End ask={false} />
    </>
  );
}
