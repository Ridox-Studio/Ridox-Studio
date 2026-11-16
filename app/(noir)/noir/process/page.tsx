import type { Metadata } from "next";
import { PROCESS_STEPS, SERVICES } from "@/app/data/content";
import { BandHead, End, PageHead } from "../../_components/chrome";

export const metadata: Metadata = { title: "Process" };

export default function ProcessPage() {
  return (
    <>
      <main className="nx-stack">
        <PageHead
          label="The process"
          title="Four phases"
          lede="No engagement starts with a proposal. It starts with understanding where you are, whether that is a live product, a prototype or an idea, and telling you in writing what we found and what we would do, whether or not you hire us."
        />

        <section className="nx-band" style={{ paddingTop: 0 }}>
          <div className="nx-wrap">
            <ol className="nx-phases">
              {PROCESS_STEPS.map((step) => (
                <li key={step.index} className="nx-phase">
                  <span className="nx-phase__num" aria-hidden="true">
                    {step.index}
                  </span>
                  <div className="nx-phase__body">
                    <h2 className="nx-h3">{step.title}</h2>
                    <p className="nx-body" style={{ color: "var(--nx-fg)" }}>
                      {step.summary}
                    </p>
                  </div>
                  <p className="nx-body nx-phase__detail">{step.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="nx-band nx-band--line nx-band--raise">
          <div className="nx-wrap">
            <BandHead index="01" label="Capabilities">
              <h2 className="nx-statement">
                What runs through those phases. <span>The same process, whichever surface the work lands on.</span>
              </h2>
            </BandHead>
            <div className="nx-cells">
              {SERVICES.map((service) => (
                <article key={service.index} className="nx-cell">
                  <div className="nx-cell__head">
                    <span className="nx-label nx-label--num">{service.index}</span>
                    <h3 className="nx-h3">{service.title}</h3>
                  </div>
                  <p className="nx-body">{service.summary}</p>
                  <ul className="nx-cell__list nx-label">
                    {service.capabilities.map((capability) => (
                      <li key={capability}>{capability}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <End />
    </>
  );
}
