import type { Metadata } from "next";
import { getWorkProjects } from "@/app/data/projects";
import { Closing, PageHead } from "../../_components/chrome";
import { WorkCard } from "../../_components/work";

export const metadata: Metadata = { title: "Client Work" };

export default function WorkPage() {
  const projects = getWorkProjects();

  return (
    <>
      <main className="nd-stack">
        <PageHead
          label="Client work and consulting"
          title={
            <>
              Selected <em>work.</em>
            </>
          }
          lede="Commissioned builds and advisory engagements. Not every useful piece of work is a six-month contract, so the short ones are here too."
        />
        <section className="nd-section" style={{ paddingTop: 0 }}>
          <div className="nd-wrap">
            <div className="nd-work">
              {projects.map((project, index) => (
                <WorkCard key={project.slug} project={project} priority={index < 2} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Closing />
    </>
  );
}
