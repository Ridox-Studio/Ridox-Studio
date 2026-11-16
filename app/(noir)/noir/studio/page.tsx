import type { Metadata } from "next";
import { getProjectsByCategory } from "@/app/data/projects";
import { End, PageHead } from "../../_components/chrome";
import { ProjectIndex } from "../../_components/work";

export const metadata: Metadata = { title: "Studio Products" };

export default function StudioPage() {
  return (
    <>
      <main className="nx-stack">
        <PageHead
          label="Studio products"
          title="Our own products"
          lede="We build and run our own products. They are how we prove the process before we sell it to anyone: the same architecture, the same standards, our own money."
        />
        <section className="nx-band" style={{ paddingTop: 0 }}>
          <div className="nx-wrap">
            <ProjectIndex projects={getProjectsByCategory("studio")} />
          </div>
        </section>
      </main>
      <End />
    </>
  );
}
