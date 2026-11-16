import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Closing, SectionHead } from "../../_components/chrome";
import { to } from "../../_lib/paths";

export const metadata: Metadata = { title: "Paper design system" };

type Swatch = { name: string; token: string; value: string; use: string };

const BRAND: Swatch[] = [
  { name: "Amber", token: "--nd-amber", value: "hsl(33 95% 52%)", use: "The one action per view" },
  { name: "Amber deep", token: "--nd-amber-deep", value: "hsl(33 95% 44%)", use: "Action, hover" },
  { name: "Amber wash", token: "--nd-amber-wash", value: "hsl(33 95% 92%)", use: "Highlight ground" },
  { name: "Indigo", token: "--nd-indigo", value: "hsl(258 89% 62%)", use: "Marks, status dots" },
  { name: "Indigo ink", token: "--nd-indigo-ink", value: "hsl(258 89% 48%)", use: "Links, focus ring" },
  { name: "Indigo wash", token: "--nd-indigo-wash", value: "hsl(258 89% 96%)", use: "Selected ground" },
];

const PAPER: Swatch[] = [
  { name: "Paper", token: "--nd-paper", value: "hsl(258 40% 98.5%)", use: "Page" },
  { name: "Paper 2", token: "--nd-paper-2", value: "hsl(258 32% 96%)", use: "Raised band, hover" },
  { name: "Paper 3", token: "--nd-paper-3", value: "hsl(258 26% 92%)", use: "Wells, placeholders" },
  { name: "Line", token: "--nd-line", value: "hsl(258 22% 87%)", use: "Hairline rules" },
  { name: "Line strong", token: "--nd-line-strong", value: "hsl(258 16% 70%)", use: "Table heads, outlines" },
];

const INK: Swatch[] = [
  { name: "Ink", token: "--nd-ink", value: "hsl(258 40% 8%)", use: "Headings, body" },
  { name: "Ink 2", token: "--nd-ink-2", value: "hsl(258 14% 32%)", use: "Descriptions" },
  { name: "Ink 3", token: "--nd-ink-3", value: "hsl(258 10% 43%)", use: "Labels, meta" },
  { name: "Night", token: "--nd-night", value: "hsl(258 40% 7%)", use: "The inverted band" },
  { name: "Night 2", token: "--nd-night-2", value: "hsl(258 30% 11%)", use: "Raised, on night" },
  { name: "On night", token: "--nd-on-night", value: "hsl(258 60% 96%)", use: "Text on night" },
];

const CHANGES = [
  {
    area: "Ground",
    was: "Dark on every page",
    now: "Light paper, with one night band per page for contrast. The work is dark; the page around it no longer competes.",
  },
  {
    area: "Colour",
    was: "Amber-to-indigo gradients, glows, alternating zones",
    now: "No gradients. Indigo tints every neutral. Amber fills one element per view, and that element is the action.",
  },
  {
    area: "Display type",
    was: "Archivo Black, width 125, leading 0.82",
    now: "Archivo 600 at normal width, tight tracking. Quieter, and legible at a glance.",
  },
  {
    area: "Second voice",
    was: "None. Duality lived only in colour",
    now: "Fraunces italic on one phrase per heading. Grotesque for the engineering, serif for the judgement.",
  },
  {
    area: "Labels",
    was: "Bitcount, a pixel face",
    now: "JetBrains Mono. The face the work is actually written in.",
  },
  {
    area: "Navigation",
    was: "Preloader, floating trigger, full-screen menu, page-transition doors",
    now: "A plain bar that is always there. Nothing stands between a visitor and the page.",
  },
  {
    area: "Motion",
    was: "Marquees, cursor spotlight, horizontal scroll, smooth-scroll hijack",
    now: "Native scroll. One entrance on load, hover states, nothing else.",
  },
  {
    area: "The slash",
    was: "A door wipe between routes",
    now: "A still mark: it leads every label and cuts the hero image in two.",
  },
] as const;

const SPACE = [
  ["--nd-space-1", "0.25rem", 4],
  ["--nd-space-2", "0.5rem", 8],
  ["--nd-space-3", "0.75rem", 12],
  ["--nd-space-4", "1rem", 16],
  ["--nd-space-6", "1.5rem", 24],
  ["--nd-space-8", "2rem", 32],
  ["--nd-space-12", "3rem", 48],
  ["--nd-space-16", "4rem", 64],
  ["--nd-space-24", "6rem", 96],
] as const;

function Swatches({ items }: { items: Swatch[] }) {
  return (
    <div className="nds-grid">
      {items.map((swatch) => (
        <div key={swatch.token} className="nds-swatch">
          <div className="nds-swatch__chip" style={{ background: swatch.value }} />
          <div className="nds-swatch__meta">
            <span className="nds-swatch__name">{swatch.name}</span>
            <span className="nds-code">{swatch.token}</span>
            <span className="nds-code">{swatch.value}</span>
            <span className="nd-small">{swatch.use}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Specimen({ name, spec, children }: { name: string; spec: string; children: React.ReactNode }) {
  return (
    <div className="nds-specimen">
      <div className="nd-stack nd-gap-2">
        <span className="nd-label nd-label--fg">{name}</span>
        <span className="nds-code">{spec}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ComponentSamples() {
  return (
    <>
      <div className="nds-panel">
        <span className="nd-btn nd-btn--action">
          Start a project
          <ArrowRight size={18} aria-hidden="true" />
        </span>
        <span className="nd-btn nd-btn--solid">Solid</span>
        <span className="nd-btn nd-btn--ghost">Ghost</span>
        <span className="nd-link">
          Text link
          <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </div>
      <div className="nds-panel">
        <span className="nd-label nd-eyebrow">
          <span className="nd-slash" />
          Eyebrow
        </span>
        <span className="nd-label nd-eyebrow">
          <span className="nd-slash nd-slash--indigo" />
          Eyebrow, indigo
        </span>
        <span className="nd-tag nd-tag--live">
          <span className="nd-tag__dot" />
          Live
        </span>
        <span className="nd-tag nd-tag--building">
          <span className="nd-tag__dot" />
          In development
        </span>
        <span className="nd-tag">Neutral</span>
      </div>
    </>
  );
}

export default function DesignSystemPage() {
  return (
    <>
      <main className="nd-stack">
        <section className="nd-hero" style={{ paddingBottom: 0 }}>
          <div className="nd-wrap">
            <div className="nd-stack nd-gap-8">
              <span className="nd-label nd-eyebrow">
                <span className="nd-slash" />
                Design system v2 · Draft
              </span>
              <h1 className="nd-display">
                Same reaction, <em>less noise.</em>
              </h1>
              <p className="nd-lede" style={{ maxWidth: "42rem" }}>
                The idea behind Ridox has not moved: two opposing forces, and the point where they
                meet. This draft keeps both colours and the slash, and removes most of what was
                built around them. Every token and component below is live on the{" "}
                <Link href={to("/")} className="nd-link" style={{ display: "inline", minHeight: 0 }}>
                  landing page draft
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ Changes */}
        <section className="nd-section">
          <div className="nd-wrap">
            <SectionHead
              label="What changes"
              title={
                <>
                  Eight decisions, each one <em>a removal.</em>
                </>
              }
              lede="Expensive work reads as confident, and confidence shows as restraint. Most of this system is the previous one with things taken away."
            />
            <div className="nds-table">
              {CHANGES.map((change) => (
                <div key={change.area} className="nds-table__row">
                  <span className="nd-label nd-label--fg">{change.area}</span>
                  <span className="nd-small nds-was">{change.was}</span>
                  <span className="nd-small" style={{ color: "var(--nd-fg)" }}>
                    {change.now}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- Colour */}
        <section className="nd-section nd-section--ruled">
          <div className="nd-wrap">
            <SectionHead
              label="Colour"
              title={
                <>
                  Indigo is the structure. Amber is <em>the action.</em>
                </>
              }
              lede="Both sources come straight from the logo, as before. Every neutral sits on the indigo hue, so there is still no pure grey, black or white anywhere."
            />
            <div className="nd-stack nd-gap-12">
              <div className="nd-stack nd-gap-4">
                <span className="nd-label nd-label--fg">Sources</span>
                <Swatches items={BRAND} />
              </div>
              <div className="nd-stack nd-gap-4">
                <span className="nd-label nd-label--fg">Paper</span>
                <Swatches items={PAPER} />
              </div>
              <div className="nd-stack nd-gap-4">
                <span className="nd-label nd-label--fg">Ink and night</span>
                <Swatches items={INK} />
              </div>
              <div className="nd-stack nd-gap-4">
                <span className="nd-label nd-label--fg">Rules</span>
                <ul className="nd-row__list" style={{ fontSize: "var(--nd-text-body)" }}>
                  <li>One amber fill per view. If two things are amber, neither is the action.</li>
                  <li>Amber is never text on paper. It fails contrast below large display sizes.</li>
                  <li>No gradients, glows or tinted shadows.</li>
                  <li>One night band per page, plus the closing band.</li>
                  <li>Components read semantic tokens only, so they work on paper and on night unchanged.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------- Typography */}
        <section className="nd-section nd-section--ruled">
          <div className="nd-wrap">
            <SectionHead
              label="Typography"
              accent="indigo"
              title={
                <>
                  Two voices, <em>one sentence.</em>
                </>
              }
              lede="Archivo states it. Fraunces italic takes the one phrase that carries the judgement. Inter does the reading, JetBrains Mono does the labelling."
            />
            <div className="nd-stack" style={{ borderTop: "1px solid var(--nd-rule-strong)" }}>
              <Specimen name="Display" spec="Archivo 600 · -0.045em · 0.96">
                <p className="nd-display" style={{ fontFamily: "var(--nd-font-display)" }}>
                  Built to be <em>handed over.</em>
                </p>
              </Specimen>
              <Specimen name="Heading 2" spec="Archivo 600 · -0.038em · 1.02">
                <h2 className="nd-h2">
                  The plan, <em>written down.</em>
                </h2>
              </Specimen>
              <Specimen name="Heading 3" spec="Archivo 600 · -0.025em · 1.15">
                <h3 className="nd-h3">Cloud infrastructure and DevOps</h3>
              </Specimen>
              <Specimen name="Lede" spec="Inter 400 · 1.125–1.375rem · 1.45">
                <p className="nd-lede" style={{ maxWidth: "40rem" }}>
                  Infrastructure you can read. Declared in code, reproducible per environment, and
                  boring in exactly the ways it should be.
                </p>
              </Specimen>
              <Specimen name="Body" spec="Inter 400 · 1.0625rem · 1.6">
                <p className="nd-body" style={{ maxWidth: "40rem" }}>
                  You get a live preview environment early and a demo every two weeks. Tests, CI and
                  monitoring are part of the definition of done, not a hardening phase promised for
                  later.
                </p>
              </Specimen>
              <Specimen name="Small" spec="Inter 400 · 0.9375rem · 1.55">
                <p className="nd-small">Designed in collaboration with an external product designer.</p>
              </Specimen>
              <Specimen name="Label" spec="JetBrains Mono 500 · 0.75rem · +0.06em · caps">
                <span className="nd-label">Client build · 2026</span>
              </Specimen>
            </div>
          </div>
        </section>

        {/* --------------------------------------------- Components */}
        <section className="nd-section nd-section--ruled">
          <div className="nd-wrap">
            <SectionHead
              label="Components"
              title={
                <>
                  The same parts, <em>on either ground.</em>
                </>
              }
              lede="Left on paper, right on night. Nothing is restyled between the two. The inverted band only remaps the semantic tokens."
            />
            <div className="nds-two">
              <div className="nd-stack nd-gap-4">
                <ComponentSamples />
              </div>
              <div className="nd-stack nd-gap-4 nd-invert" style={{ background: "none" }}>
                <ComponentSamples />
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------- Space, shape */}
        <section className="nd-section nd-section--ruled">
          <div className="nd-wrap">
            <SectionHead
              label="Space, shape, motion"
              accent="indigo"
              title={
                <>
                  A four-pixel grid and <em>hairlines.</em>
                </>
              }
            />
            <div className="nds-two" style={{ gap: "var(--nd-space-16)" }}>
              <div className="nd-stack nd-gap-4">
                <span className="nd-label nd-label--fg">Spacing scale</span>
                {SPACE.map(([token, rem, px]) => (
                  <div key={token} className="nds-space">
                    <span className="nds-code" style={{ width: "8.5rem", flex: "none" }}>
                      {token}
                    </span>
                    <span className="nds-space__bar" style={{ width: px }} />
                    <span className="nds-code">
                      {rem} · {px}px
                    </span>
                  </div>
                ))}
              </div>
              <div className="nd-stack nd-gap-8">
                <div className="nd-stack nd-gap-2">
                  <span className="nd-label nd-label--fg">Layout</span>
                  <p className="nd-small">
                    Content is capped at 1320px with 1.5rem gutters, 3rem from 768px. Sections open
                    with a 3/9 split: label in the margin column, statement beside it. Section
                    padding runs from 4.5rem to 10rem with the viewport.
                  </p>
                </div>
                <div className="nd-stack nd-gap-2">
                  <span className="nd-label nd-label--fg">Shape</span>
                  <p className="nd-small">
                    4px on controls, 8px on images and panels, full pills for tags only. Separation
                    is a 1px rule, never a shadow. The single shadow in the system belongs to the
                    mobile menu.
                  </p>
                </div>
                <div className="nd-stack nd-gap-2">
                  <span className="nd-label nd-label--fg">Motion</span>
                  <p className="nd-small">
                    The redox curve, cubic-bezier(0.76, 0, 0.24, 1), is kept for image scale on
                    hover at 600ms. Colour and position changes take 180ms on an ease-out. One
                    staggered rise on load. Transform and opacity only, and all of it stands down
                    under reduced motion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Closing />
    </>
  );
}
