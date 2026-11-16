import type { Metadata } from "next";
import { getProjectsByCategory } from "@/app/data/projects";
import { Closing, PageHead } from "../../_components/chrome";
import { WorkCard } from "../../_components/work";

export const metadata: Metadata = { title: "Studio Products" };

export default function StudioPage() {
  const projects = getProjectsByCategory("studio");

  return (
    <>
      <main className="nd-stack">
        <PageHead
          label="Studio products"
          accent="indigo"
          title={
            <>
              Our own <em>products.</em>
            </>
          }
          lede="We build and run our own products. They are how we prove the process before we sell it to anyone: the same architecture, the same standards, our own money."
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
