import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/app/lib/site";
import { to } from "../_lib/paths";

/** Geometry copied verbatim from public/logos/ridox-studio-logo.svg. */
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <mask id="nd-mark-slash">
          <rect width="100" height="100" fill="#ffffff" />
          <path d="M 48,15 L 56,15 L 40,85 L 32,85 Z" fill="#000000" />
        </mask>
      </defs>
      <g mask="url(#nd-mark-slash)">
        <path d="M 22,22 L 70,22 L 44,78 L 22,78 Z" fill="hsl(33, 95%, 52%)" />
        <path d="M 56,22 L 78,22 L 78,78 L 30,78 Z" fill="hsl(258, 89%, 62%)" opacity="0.9" />
      </g>
    </svg>
  );
}

const NAV = [
  { label: "Work", href: to("/work") },
  { label: "Studio", href: to("/studio") },
  { label: "Process", href: to("/process") },
  { label: "Journal", href: to("/blog") },
] as const;

/** Marks the route as a proposal and links the drafts. Delete on promotion. */
export function DraftStrip() {
  return (
    <div className="nd-draft">
      <div className="nd-draft__inner">
        <span>Draft · Paper · Not indexed</span>
        <nav className="nd-draft__links" aria-label="Draft pages">
          <Link href={to("/system")}>Design system</Link>
          <Link href="/noir">Other draft: Noir</Link>
          <Link href="/">Current site</Link>
        </nav>
      </div>
    </div>
  );
}

export function Nav() {
  return (
    <header className="nd-nav">
      <div className="nd-nav__inner">
        <Link href={to("/")} className="nd-brand" aria-label={`${SITE.name} home`}>
          <Mark />
          <span>{SITE.name}</span>
        </Link>
        <nav className="nd-nav__links" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nd-nav__end">
          <Link href={to("/contact")} className="nd-btn nd-btn--solid nd-btn--small">
            Start a project
          </Link>
          <details className="nd-menu">
            <summary>Menu</summary>
            <nav className="nd-menu__panel" aria-label="Primary">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

function FooterBar() {
  return (
    <footer className="nd-footer">
      <Link href={to("/")} className="nd-brand">
        <Mark size={24} />
        <span>{SITE.name}</span>
      </Link>
      <nav className="nd-footer__cols" aria-label="Footer">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <Link href={to("/privacy")}>Privacy</Link>
      </nav>
      <nav className="nd-footer__cols" aria-label="Social">
        <a href={SITE.social.github} rel="noopener noreferrer" target="_blank">
          GitHub
        </a>
        <a href={SITE.social.linkedin} rel="noopener noreferrer" target="_blank">
          LinkedIn
        </a>
        <a href={SITE.social.x} rel="noopener noreferrer" target="_blank">
          X
        </a>
      </nav>
    </footer>
  );
}

/** Footer alone, for pages that already are the ask (contact). */
export function FooterBand() {
  return (
    <section className="nd-section nd-invert" style={{ paddingBlock: 0 }}>
      <div className="nd-wrap">
        <FooterBar />
      </div>
    </section>
  );
}

/** Closing band: the one place the page asks for something, then the footer. */
export function Closing() {
  return (
    <section className="nd-section nd-invert" style={{ paddingBottom: 0 }}>
      <div className="nd-wrap">
        <div className="nd-cta">
          <div className="nd-stack nd-gap-8">
            <span className="nd-label nd-eyebrow">
              <span className="nd-slash" />
              Start a project
            </span>
            <h2 className="nd-display nd-cta__title">
              Tell us what you are <em>building.</em>
            </h2>
          </div>
          <div className="nd-cta__side">
            <p className="nd-lede">
              The first step is a written analysis and a recommended path. It is yours to keep,
              whether or not we build it together.
            </p>
            <div className="nd-hero__actions">
              <Link href={to("/contact")} className="nd-btn nd-btn--action">
                Start a project
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href={`mailto:${SITE.email}`} className="nd-link">
                {SITE.email}
              </a>
            </div>
          </div>
        </div>
        <FooterBar />
      </div>
    </section>
  );
}

/** Label in the margin column, statement beside it. Opens every section. */
export function SectionHead({
  label,
  accent = "amber",
  title,
  lede,
  action,
}: {
  label: string;
  accent?: "amber" | "indigo";
  title: React.ReactNode;
  lede?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="nd-head">
      <span className="nd-label nd-eyebrow" style={{ alignSelf: "start" }}>
        <span className={accent === "indigo" ? "nd-slash nd-slash--indigo" : "nd-slash"} />
        {label}
      </span>
      <div className="nd-head__body">
        <h2 className="nd-h2">{title}</h2>
        {(lede || action) && (
          <div className="nd-head__row">
            {lede && <p className="nd-lede nd-head__lede">{lede}</p>}
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

/** Opens every inner page: eyebrow, display title, lede, optional extras. */
export function PageHead({
  label,
  accent = "amber",
  title,
  lede,
  children,
}: {
  label: string;
  accent?: "amber" | "indigo";
  title: React.ReactNode;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="nd-pagehead">
      <div className="nd-wrap">
        <div className="nd-pagehead__inner">
          <span className="nd-label nd-eyebrow nd-rise">
            <span className={accent === "indigo" ? "nd-slash nd-slash--indigo" : "nd-slash"} />
            {label}
          </span>
          <h1 className="nd-display nd-rise" style={{ "--nd-i": 1 } as React.CSSProperties}>
            {title}
          </h1>
          {(lede || children) && (
            <div className="nd-pagehead__foot nd-rise" style={{ "--nd-i": 2 } as React.CSSProperties}>
              {lede && <p className="nd-lede nd-pagehead__lede">{lede}</p>}
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
