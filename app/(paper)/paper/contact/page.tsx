import type { Metadata } from "next";
import { SITE } from "@/app/lib/site";
import { FooterBand, PageHead } from "../../_components/chrome";
import { InquiryForm } from "../../_components/InquiryForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <main className="nd-stack">
        <PageHead
          label="Start a project"
          title={
            <>
              Send the <em>real problem.</em>
            </>
          }
          lede="No discovery-call funnel. Tell us what you are building and what is in the way, and an engineer reads it."
        />

        <section className="nd-section" style={{ paddingTop: 0 }}>
          <div className="nd-wrap">
            <div className="nd-contact">
              <div className="nd-contact__details">
                <div className="nd-stack nd-gap-2">
                  <h2 className="nd-label">Direct</h2>
                  <a href={`mailto:${SITE.email}`} className="nd-link">
                    {SITE.email}
                  </a>
                </div>
                <div className="nd-stack nd-gap-2">
                  <h2 className="nd-label">Response time</h2>
                  <p className="nd-body">
                    Two working days, with a real answer rather than a calendar link.
                  </p>
                </div>
                <div className="nd-stack nd-gap-2">
                  <h2 className="nd-label">What happens next</h2>
                  <p className="nd-body">
                    A written analysis and a recommended path. It is yours to keep, whether or not
                    we build it together.
                  </p>
                </div>
                <div className="nd-stack nd-gap-2">
                  <h2 className="nd-label">Elsewhere</h2>
                  <ul className="nd-contact__social">
                    {Object.entries(SITE.social).map(([name, url]) => (
                      <li key={name}>
                        <a href={url} target="_blank" rel="noreferrer noopener" className="nd-link">
                          {name === "x" ? "X" : name.charAt(0).toUpperCase() + name.slice(1)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <InquiryForm />
            </div>
          </div>
        </section>
      </main>
      <FooterBand />
    </>
  );
}
