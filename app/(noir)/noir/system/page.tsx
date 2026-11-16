import type { Metadata } from "next";
import { BandHead, End } from "../../_components/chrome";

export const metadata: Metadata = { title: "Noir design system" };

type Swatch = { name: string; token: string; value: string; use: string };

const GROUND: Swatch[] = [
  { name: "Void", token: "--nx-void", value: "hsl(258 40% 3.5%)", use: "Page" },
  { name: "Raise", token: "--nx-raise", value: "hsl(258 32% 6.5%)", use: "One band, cell hover" },
  { name: "Raise 2", token: "--nx-raise-2", value: "hsl(258 26% 10%)", use: "Reserved: overlays" },
  { name: "Line", token: "--nx-line", value: "hsl(258 22% 14%)", use: "Hairlines" },
  { name: "Line strong", token: "--nx-line-strong", value: "hsl(258 16% 26%)", use: "List heads, numerals" },
  { name: "Ghost", token: "--nx-ghost", value: "hsl(258 24% 11%)", use: "Footer wordmark" },
];

const LIGHT: Swatch[] = [
  { name: "Foreground", token: "--nx-fg", value: "hsl(258 50% 97%)", use: "Headings, the button" },
  { name: "Foreground 2", token: "--nx-fg-2", value: "hsl(258 14% 68%)", use: "Body copy" },
  { name: "Foreground 3", token: "--nx-fg-3", value: "hsl(258 10% 50%)", use: "Labels, second clause" },
  { name: "Amber", token: "--nx-amber", value: "hsl(33 95% 52%)", use: "The slash. Nothing else." },
  { name: "Indigo", token: "--nx-indigo", value: "hsl(258 89% 62%)", use: "In-development dot" },
  { name: "Indigo soft", token: "--nx-indigo-soft", value: "hsl(258 89% 78%)", use: "Journal hover" },
];

const COMPARE = [
  ["Posture", "A studio you would enjoy hiring", "A firm you apply to work with"],
  ["Ground", "Light paper, one night band", "Black throughout, one lifted band"],
  ["Voices", "Two typefaces: grotesque and serif italic", "One typeface at both ends of its width axis"],
  ["Scale", "Display tops out near 7rem", "Display runs to 12.5rem; body drops to 15px"],
  ["Colour", "One amber action per view", "One amber glyph per page"],
  ["Work", "Framed cards with captions", "A full-bleed reel, then a typographic index"],
  ["Shape", "4px and 8px radii", "No radii at all"],
  ["Action", "Amber button", "White button; the page does not ask twice"],
] as const;

function Swatches({ items }: { items: Swatch[] }) {
  return (
    <div className="nxs-swatches">
      {items.map((swatch) => (
        <div key={swatch.token} className="nxs-swatch">
          <div className="nxs-swatch__chip" style={{ background: swatch.value }} />
          <div className="nxs-swatch__meta">
            <span className="nx-label nx-label--fg">{swatch.name}</span>
            <span className="nxs-code">{swatch.token}</span>
            <span className="nxs-code">{swatch.value}</span>
            <span className="nx-body">{swatch.use}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Specimen({ name, spec, children }: { name: string; spec: string; children: React.ReactNode }) {
  return (
    <div className="nxs-specimen">
      <div className="nx-stack" style={{ gap: "var(--nx-2)" }}>
        <span className="nx-label nx-label--fg">{name}</span>
        <span className="nxs-code">{spec}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function NoirSystemPage() {
  return (
    <>
      <main className="nx-stack">
        <section className="nx-band" style={{ paddingBottom: 0 }}>
          <div className="nx-wrap nx-stack" style={{ gap: "var(--nx-8)" }}>
            <span className="nx-label nx-label--fg">Noir · Design system draft</span>
            <h1 className="nx-title" style={{ maxWidth: "14ch" }}>
              One typeface, <span style={{ color: "var(--nx-fg-3)" }}>two extremes.</span>
            </h1>
            <p className="nx-body" style={{ maxWidth: "36rem", fontSize: "1.0625rem" }}>
              Noir carries the redox idea in a single family. Archivo at its widest makes the
              statement; Archivo at its narrowest does the labelling. The page is black, the type is
              white, and amber appears exactly once.
            </p>
          </div>
        </section>

        <section className="nx-band">
          <div className="nx-wrap">
            <BandHead index="01" label="Against Paper">
              <h2 className="nx-statement">
                Paper persuades. <span>Noir assumes you already know.</span>
              </h2>
            </BandHead>
            <div className="nxs-compare">
              <div className="nxs-compare__row">
                <span className="nx-label" />
                <span className="nx-label">Paper</span>
                <span className="nx-label">Noir</span>
              </div>
              {COMPARE.map(([area, paper, noir]) => (
                <div key={area} className="nxs-compare__row">
                  <span className="nx-label nx-label--fg">{area}</span>
                  <span className="nx-body">{paper}</span>
                  <span style={{ color: "var(--nx-fg)" }}>{noir}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="nx-band nx-band--line">
          <div className="nx-wrap">
            <BandHead index="02" label="Colour">
              <h2 className="nx-statement">
                Black, white, <span>and one mark of amber.</span>
              </h2>
            </BandHead>
            <div className="nx-stack" style={{ gap: "var(--nx-12)" }}>
              <div className="nx-stack" style={{ gap: "var(--nx-4)" }}>
                <span className="nx-label nx-label--fg">Ground</span>
                <Swatches items={GROUND} />
              </div>
              <div className="nx-stack" style={{ gap: "var(--nx-4)" }}>
                <span className="nx-label nx-label--fg">Light and sources</span>
                <Swatches items={LIGHT} />
              </div>
              <ul className="nxs-rules">
                <li>Amber is the slash in the hero and nowhere else. Not a button, not a hover.</li>
                <li>Every neutral stays on the indigo hue. There is still no pure black or white.</li>
                <li>Images sit desaturated in lists and take their colour on hover.</li>
                <li>Hierarchy comes from three greys and from size, never from a tint.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="nx-band nx-band--line">
          <div className="nx-wrap">
            <BandHead index="03" label="Typography">
              <h2 className="nx-statement">
                Width does the work <span>that colour used to.</span>
              </h2>
            </BandHead>
            <div className="nx-stack" style={{ borderTop: "1px solid var(--nx-line-strong)" }}>
              <Specimen name="Mega" spec="Archivo 500 · wdth 125 · -0.045em · 0.92">
                <p className="nx-mega">
                  We build it <span className="nx-slash">/</span>
                </p>
              </Specimen>
              <Specimen name="Title" spec="Archivo 500 · wdth 125 · -0.04em · 0.95">
                <p className="nx-title">Resurgee</p>
              </Specimen>
              <Specimen name="Statement" spec="Archivo 400 · wdth 100 · -0.032em · 1.12">
                <p className="nx-statement nx-statement--long">
                  Four phases. <span>Each one closes with something you can read and approve.</span>
                </p>
              </Specimen>
              <Specimen name="Heading 3" spec="Archivo 500 · wdth 112 · -0.025em · 1.15">
                <h3 className="nx-h3">Cloud Infrastructure &amp; DevOps</h3>
              </Specimen>
              <Specimen name="Body" spec="Inter 400 · 0.9375rem · 1.6">
                <p className="nx-body" style={{ maxWidth: "34rem" }}>
                  Infrastructure you can read. Declared in code, reproducible per environment, and
                  boring in exactly the ways it should be.
                </p>
              </Specimen>
              <Specimen name="Label" spec="Archivo 500 · wdth 70 · +0.11em · caps · 0.75rem">
                <span className="nx-label nx-label--fg">Studio product · 2026 · In development</span>
              </Specimen>
            </div>
          </div>
        </section>

        <section className="nx-band nx-band--line">
          <div className="nx-wrap">
            <BandHead index="04" label="Components">
              <h2 className="nx-statement">
                Few parts, <span>all of them square.</span>
              </h2>
            </BandHead>
            <div className="nx-stack" style={{ gap: "var(--nx-4)" }}>
              <div className="nxs-panel">
                <span className="nx-btn">Start a project</span>
                <span className="nx-btn nx-btn--ghost">Secondary</span>
                <span className="nx-link">Text link</span>
              </div>
              <div className="nxs-panel">
                <span className="nx-label">Label</span>
                <span className="nx-label nx-label--fg">Label, foreground</span>
                <span className="nx-label nx-status nx-status--live">Live</span>
                <span className="nx-label nx-status nx-status--building">In development</span>
                <span className="nx-label nx-status">Neutral</span>
              </div>
              <div className="nx-cells">
                <article className="nx-cell">
                  <div className="nx-cell__head">
                    <span className="nx-label nx-label--num">01</span>
                    <h3 className="nx-h3">Cell</h3>
                  </div>
                  <p className="nx-body">
                    Cells share one-pixel rules instead of having borders and gaps of their own.
                  </p>
                </article>
                <article className="nx-cell">
                  <div className="nx-cell__head">
                    <span className="nx-label nx-label--num">02</span>
                    <h3 className="nx-h3">No radius</h3>
                  </div>
                  <p className="nx-body">Every corner in the system is square, including buttons.</p>
                </article>
                <article className="nx-cell">
                  <div className="nx-cell__head">
                    <span className="nx-label nx-label--num">03</span>
                    <h3 className="nx-h3">No shadow</h3>
                  </div>
                  <p className="nx-body">Depth is a slightly lighter black, and only on hover.</p>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>
      <End />
    </>
  );
}
