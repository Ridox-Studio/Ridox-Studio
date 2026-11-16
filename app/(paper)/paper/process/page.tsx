import type { Metadata } from "next";
import { PROCESS_STEPS, SERVICES } from "@/app/data/content";
import { Closing, PageHead, SectionHead } from "../../_components/chrome";

export const metadata: Metadata = { title: "Process" };

export default function ProcessPage() {
  return (
    <>
      <main className="nd-stack">
        <PageHead
          label="The process"
          title={
            <>
              Four phases, <em>written down.</em>
            </>
          }
          lede="No engagement starts with a proposal. It starts with understanding where you are, whether that is a live product, a prototype or an idea, and telling you in writing what we found and what we would do, whether or not you hire us."
        />

        <section className="nd-section" style={{ paddingTop: 0 }}>
          <div className="nd-wrap">
            <ol className="nd-rows">
              {PROCESS_STEPS.map((step) => (
                <li key={step.index} className="nd-row nd-row--phase">
                  <span className="nd-phase__index">{step.index}</span>
                  <div className="nd-row__body">
                    <h2 className="nd-h2">{step.title}</h2>
                    <p className="nd-lede">{step.summary}</p>
                  </div>
                  <p className="nd-body">{step.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="nd-section nd-section--ruled" style={{ background: "var(--nd-paper-2)" }}>
          <div className="nd-wrap">
            <SectionHead
              label="Capabilities"
              accent="indigo"
              title={
                <>
                  What runs through <em>those phases.</em>
                </>
              }
              lede="The same process applies whichever surface the work lands on."
            />
            <div className="nd-rows">
              {SERVICES.map((service) => (
                <div key={service.index} className="nd-row nd-row--capability">
                  <div className="nd-row__lead">
                    <span className="nd-label">{service.index}</span>
                    <h3 className="nd-h3">{service.title}</h3>
                  </div>
                  <p className="nd-body">{service.summary}</p>
                  <ul className="nd-row__list">
                    {service.capabilities.map((capability) => (
                      <li key={capability}>{capability}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Closing />
    </>
  );
}
