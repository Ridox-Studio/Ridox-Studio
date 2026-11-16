import Image from "next/image";
import Link from "next/link";
import { PROCESS_STEPS, SERVICES } from "@/app/data/content";
import {
  getFeatured,
  getProjectsByCategory,
  getWorkProjects,
} from "@/app/data/projects";
import { getAllPosts } from "@/app/lib/blog";
import { SITE } from "@/app/lib/site";
import { BandHead, End } from "../_components/chrome";
import { CATEGORY_LABEL, ProjectIndex, pad } from "../_components/work";
import { projectHref, to } from "../_lib/paths";

/** The studio's written voice rules, not new claims. */
const TENETS = [
  {
    title: "No invented numbers",
    body: "No metric appears in our work or our reporting unless it can be pointed at. Where we have no numbers, we describe behaviour instead.",
  },
  {
    title: "We say the hard part",
    body: "\"Still in development\" beats implying otherwise. You hear about a limitation from us first, with the trade-off behind it.",
  },
  {
    title: "Nothing we build needs us",
    body: "Decision records travel with the codebase. Runbooks and paired on-call continue until your engineers are comfortable operating it.",
  },
] as const;

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export default async function NoirHomePage() {
  const lead = getFeatured(getWorkProjects(), 1)[0];
  const studio = getProjectsByCategory("studio");
  // Client build first, then our own products, then advisory.
  const index = [...getWorkProjects().filter((p) => p.category === "client"), ...studio, ...getProjectsByCategory("consulting")];
  const posts = (await getAllPosts()).slice(0, 3);

  return (
    <>
      <main className="nx-stack">
        {/* ------------------------------------------------------ Hero */}
        <section className="nx-hero">
          <div className="nx-wrap">
            <div className="nx-hero__intro">
              <span className="nx-label nx-label--fg nx-hero__kicker nx-rise">
                Product studio and software engineering agency
              </span>
              <p className="nx-hero__lede nx-rise" style={{ "--nx-i": 1 } as React.CSSProperties}>
                Web, mobile, cloud and AI systems, designed, built and handed over with the
                reasoning written down. We run products of our own, so what we sell is what we
                already operate.
              </p>
            </div>
            <div className="nx-hero__bottom">
              <h1 className="nx-mega nx-hero__title">
                <span className="nx-rise" style={{ "--nx-i": 2 } as React.CSSProperties}>
                  We build it
                </span>
                <span className="nx-rise" style={{ "--nx-i": 3 } as React.CSSProperties}>
                  <span className="nx-slash" aria-hidden="true" style={{ display: "inline" }}>
                    /
                  </span>{" "}
                  You run it.
                </span>
              </h1>
              <div className="nx-hero__meta nx-rise" style={{ "--nx-i": 4 } as React.CSSProperties}>
                <div className="nx-hero__facts nx-label">
                  <span>Est. {SITE.founded}</span>
                  <span>{SITE.location} / Worldwide</span>
                  <span>{pad(studio.length)} products of our own</span>
                </div>
                <Link href={to("/contact")} className="nx-btn">
                  Start a project
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ Reel */}
        {lead && (
          <section className="nx-reel">
            <Link
              href={projectHref(lead)}
              className="nx-reel__frame"
              aria-label={`${lead.title}: ${lead.subtitle}`}
            >
              <Image src={lead.coverImage} alt="" fill priority sizes="100vw" />
            </Link>
            <div className="nx-reel__caption">
              <div>
                <span className="nx-label nx-label--fg">
                  {lead.title} · {lead.subtitle}
                </span>
                <span className="nx-label">
                  {CATEGORY_LABEL[lead.category]} · {lead.year}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------- Statement */}
        <section className="nx-band">
          <div className="nx-wrap">
            <div className="nx-grid">
              <div className="nx-col-label nx-stack" style={{ gap: "var(--nx-2)" }}>
                <span className="nx-label nx-label--num">01</span>
                <span className="nx-label nx-label--fg">The studio</span>
              </div>
              <p className="nx-statement nx-statement--long nx-col-main">
                Ridox is a product studio that takes client work.{" "}
                <span>
                  The engagement ends when the system is stable in your hands, with runbooks,
                  decision records and a team that can operate it without us.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- Index */}
        <section id="work" className="nx-band nx-band--line">
          <div className="nx-wrap">
            <BandHead
              index="02"
              label={`Index / ${pad(index.length)} projects`}
              action={
                <Link href={to("/work")} className="nx-link">
                  All work
                </Link>
              }
            >
              <h2 className="nx-statement">Work we can talk through line by line.</h2>
            </BandHead>
            <ProjectIndex projects={index} />
          </div>
        </section>

        {/* ---------------------------------------------- Capabilities */}
        <section id="capabilities" className="nx-band nx-band--line">
          <div className="nx-wrap">
            <BandHead index="03" label="Capabilities">
              <h2 className="nx-statement">
                Six capabilities, one system.{" "}
                <span>Each exists because the others need it.</span>
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

        {/* --------------------------------------------------- Process */}
        <section id="process" className="nx-band nx-band--line nx-band--raise">
          <div className="nx-wrap">
            <BandHead
              index="04"
              label="Process"
              action={
                <Link href={to("/process")} className="nx-link">
                  The full process
                </Link>
              }
            >
              <h2 className="nx-statement">
                Four phases.{" "}
                <span>Each one closes with something you can read and approve.</span>
              </h2>
            </BandHead>
            <ol className="nx-phases">
              {PROCESS_STEPS.map((step) => (
                <li key={step.index} className="nx-phase">
                  <span className="nx-phase__num" aria-hidden="true">
                    {step.index}
                  </span>
                  <div className="nx-phase__body">
                    <h3 className="nx-h3">{step.title}</h3>
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

        {/* ------------------------------------------------ Principles */}
        <section className="nx-band nx-band--line">
          <div className="nx-wrap">
            <BandHead index="05" label="What you can hold us to">
              <h2 className="nx-statement">Specific, rather than impressive.</h2>
            </BandHead>
            <div className="nx-tenets">
              {TENETS.map((tenet) => (
                <div key={tenet.title} className="nx-tenet">
                  <h3 className="nx-h3">{tenet.title}</h3>
                  <p className="nx-body">{tenet.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- Journal */}
        {posts.length > 0 && (
          <section id="journal" className="nx-band nx-band--line">
            <div className="nx-wrap">
              <BandHead
                index="06"
                label="Journal"
                action={
                  <Link href={to("/blog")} className="nx-link">
                    All posts
                  </Link>
                }
              >
                <h2 className="nx-statement">Notes from the build.</h2>
              </BandHead>
              <div className="nx-posts">
                {posts.map((post) => (
                  <Link key={post.slug} href={to(`/blog/${post.slug}`)} className="nx-post">
                    <time className="nx-label nx-label--num nx-post__date" dateTime={post.date}>
                      {dateFormat.format(new Date(post.date))}
                    </time>
                    <h3 className="nx-h3 nx-post__title">{post.title}</h3>
                    <span className="nx-label nx-post__end">{post.readingMinutes} min</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <End />
    </>
  );
}
