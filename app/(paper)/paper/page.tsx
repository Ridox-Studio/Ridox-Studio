import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PROCESS_STEPS, SERVICES } from "@/app/data/content";
import {
  getFeatured,
  getProjectsByCategory,
  getWorkProjects,
} from "@/app/data/projects";
import { getAllPosts } from "@/app/lib/blog";
import { SITE } from "@/app/lib/site";
import { Closing, SectionHead } from "../_components/chrome";
import { StatusTag, WorkCard } from "../_components/work";
import { projectHref, to } from "../_lib/paths";

/** The three commitments are the studio's written voice rules, not new claims. */
const PRINCIPLES = [
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
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export default async function PaperHomePage() {
  const clientLead = getFeatured(getWorkProjects(), 1)[0];
  const studio = getProjectsByCategory("studio");
  const studioLead = studio[0];
  const selected = [clientLead, ...studio].filter(Boolean);
  const advisory = getProjectsByCategory("consulting");
  const posts = (await getAllPosts()).slice(0, 3);

  const facts = [
    { label: "Founded", value: String(SITE.founded) },
    { label: "Based", value: `${SITE.location}, working worldwide` },
    { label: "Our own products", value: `${studio.length} built and run in-house` },
    { label: "Cadence", value: "A working demo every two weeks" },
  ];

  return (
    <>
      <main className="nd-stack">
        {/* ------------------------------------------------------ Hero */}
        <section className="nd-hero">
          <div className="nd-wrap">
            <div className="nd-hero__top">
              <div className="nd-stack nd-gap-8 nd-hero__title">
                <span className="nd-label nd-eyebrow nd-rise">
                  <span className="nd-slash" />
                  Product studio and software engineering agency
                </span>
                <h1 className="nd-display nd-rise" style={{ "--nd-i": 1 } as React.CSSProperties}>
                  Software your team <br className="nd-br-wide" />
                  can run <em>without us.</em>
                </h1>
              </div>
              <div
                className="nd-hero__aside nd-rise"
                style={{ "--nd-i": 2 } as React.CSSProperties}
              >
                <p className="nd-lede">
                  Ridox designs and builds web, mobile, cloud and AI systems, then hands them over
                  with the reasoning written down. We run products of our own, so what we sell is
                  what we already operate.
                </p>
                <div className="nd-hero__actions">
                  <Link href={to("/contact")} className="nd-btn nd-btn--action">
                    Start a project
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                  <Link href="#work" className="nd-link">
                    See the work
                  </Link>
                </div>
              </div>
            </div>

            {clientLead && studioLead && (
              <div className="nd-rise" style={{ "--nd-i": 3 } as React.CSSProperties}>
                <div className="nd-split">
                  <Link
                    href={projectHref(clientLead)}
                    className="nd-split__half nd-split__half--a"
                    aria-label={`${clientLead.title}: ${clientLead.subtitle}`}
                  >
                    <span className="nd-split__frame">
                      <Image
                        src={clientLead.coverImage}
                        alt=""
                        fill
                        priority
                        sizes="(min-width: 760px) 56vw, 100vw"
                      />
                    </span>
                  </Link>
                  <Link
                    href={projectHref(studioLead)}
                    className="nd-split__half nd-split__half--b"
                    aria-label={`${studioLead.title}: ${studioLead.subtitle}`}
                  >
                    <span className="nd-split__frame">
                      <Image
                        src={studioLead.coverImage}
                        alt=""
                        fill
                        priority
                        sizes="(min-width: 760px) 56vw, 100vw"
                      />
                    </span>
                  </Link>
                </div>
                <div className="nd-split__captions">
                  <div className="nd-split__caption">
                    <span className="nd-label nd-eyebrow">
                      <span className="nd-slash" />
                      Client work
                    </span>
                    <span className="nd-small">
                      {clientLead.title}. {clientLead.subtitle}
                    </span>
                  </div>
                  <div className="nd-split__caption nd-split__caption--b">
                    <span className="nd-label nd-eyebrow">
                      <span className="nd-slash nd-slash--indigo" />
                      Studio products
                    </span>
                    <span className="nd-small">
                      {studioLead.title}. {studioLead.subtitle}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="nd-section" style={{ paddingBlock: 0 }}>
          <div className="nd-wrap">
            <dl className="nd-facts">
              {facts.map((fact) => (
                <div key={fact.label} className="nd-fact">
                  <dt className="nd-label">{fact.label}</dt>
                  <dd className="nd-fact__value">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ------------------------------------------------------ Work */}
        <section id="work" className="nd-section">
          <div className="nd-wrap">
            <SectionHead
              label="Selected work"
              title={
                <>
                  Work we can talk through <em>line by line.</em>
                </>
              }
              lede="Fewer engagements than a big agency lists. Each one is something we built, run, or advised on closely enough to explain every decision in it."
              action={
                <Link href={to("/work")} className="nd-link">
                  All work
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              }
            />
            <div className="nd-stack nd-gap-16">
              <div className="nd-work">
                {selected.map((project) => (
                  <WorkCard key={project.slug} project={project} />
                ))}
              </div>

              {advisory.length > 0 && (
                <div className="nd-stack nd-gap-6">
                  <span className="nd-label nd-label--fg">Advisory engagements</span>
                  <div className="nd-rows">
                    {advisory.map((project) => (
                      <Link
                        key={project.slug}
                        href={projectHref(project)}
                        className="nd-row nd-row--advisory"
                      >
                        <h3 className="nd-h3 nd-row__title">{project.title}</h3>
                        <p className="nd-body">{project.subtitle}</p>
                        <span className="nd-row__end">
                          <StatusTag status={project.status} />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- Process */}
        <section className="nd-section nd-invert">
          <div className="nd-wrap">
            <SectionHead
              label="How an engagement runs"
              title={
                <>
                  It ends when the system is <em>stable in your hands.</em>
                </>
              }
              lede="Four stages, each closed by something you can read and approve. Nothing gets built from an assumption nobody wrote down."
              action={
                <Link href={to("/process")} className="nd-link">
                  The full process
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              }
            />
            <ol className="nd-steps">
              {PROCESS_STEPS.map((step) => (
                <li key={step.index} className="nd-step">
                  <span className="nd-step__index">{step.index}</span>
                  <h3 className="nd-h3">{step.title}</h3>
                  <p className="nd-small">{step.summary}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------------------------------------- Capabilities */}
        <section className="nd-section">
          <div className="nd-wrap">
            <SectionHead
              label="Capabilities"
              accent="indigo"
              title={
                <>
                  Six capabilities, <em>one system.</em>
                </>
              }
              lede="We do not sell isolated deliverables. Every capability below exists because the others need it."
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

        {/* ------------------------------------------------ Principles */}
        <section className="nd-section nd-section--ruled" style={{ background: "var(--nd-paper-2)" }}>
          <div className="nd-wrap">
            <SectionHead
              label="What you can hold us to"
              title={
                <>
                  Specific, rather than <em>impressive.</em>
                </>
              }
            />
            <div className="nd-principles">
              {PRINCIPLES.map((principle) => (
                <div key={principle.title} className="nd-principle">
                  <h3 className="nd-h3">{principle.title}</h3>
                  <p className="nd-body">{principle.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- Journal */}
        {posts.length > 0 && (
          <section className="nd-section nd-section--ruled">
            <div className="nd-wrap">
              <SectionHead
                label="Journal"
                accent="indigo"
                title={
                  <>
                    Notes from <em>the build.</em>
                  </>
                }
                action={
                  <Link href={to("/blog")} className="nd-link">
                    All posts
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                }
              />
              <div className="nd-rows">
                {posts.map((post) => (
                  <Link key={post.slug} href={to(`/blog/${post.slug}`)} className="nd-row nd-row--post">
                    <span className="nd-label">{dateFormat.format(new Date(post.date))}</span>
                    <div className="nd-row__body">
                      <h3 className="nd-h3 nd-row__title">{post.title}</h3>
                      <p className="nd-small">{post.description}</p>
                    </div>
                    <span className="nd-label nd-row__end">{post.readingMinutes} min read</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Closing />
    </>
  );
}
