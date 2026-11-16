import type { Metadata } from "next";
import { getWorkProjects } from "@/app/data/projects";
import { End, PageHead } from "../../_components/chrome";
import { ProjectIndex } from "../../_components/work";

export const metadata: Metadata = { title: "Client Work" };

export default function WorkPage() {
  return (
    <>
      <main className="nx-stack">
        <PageHead
          label="Client work and consulting"
          title="Selected work"
          lede="Commissioned builds and advisory engagements. Not every useful piece of work is a six-month contract, so the short ones are here too."
        />
        <section className="nx-band" style={{ paddingTop: 0 }}>
          <div className="nx-wrap">
            <ProjectIndex projects={getWorkProjects()} />
          </div>
        </section>
      </main>
      <End />
    </>
  );
}
