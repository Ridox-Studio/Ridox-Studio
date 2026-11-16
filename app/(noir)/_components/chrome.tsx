import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/app/lib/site";
import { to } from "../_lib/paths";

/** Geometry copied verbatim from public/logos/ridox-studio-logo.svg. */
export function Mark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <mask id="nx-mark-slash">
          <rect width="100" height="100" fill="#ffffff" />
          <path d="M 48,15 L 56,15 L 40,85 L 32,85 Z" fill="#000000" />
        </mask>
      </defs>
      <g mask="url(#nx-mark-slash)">
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
    <div className="nx-draft">
      <div className="nx-draft__inner nx-label">
        <span>Draft · Noir · Not indexed</span>
        <nav className="nx-draft__links" aria-label="Draft pages">
          <Link href={to("/system")}>Design system</Link>
          <Link href="/paper">Other draft: Paper</Link>
          <Link href="/">Current site</Link>
        </nav>
      </div>
    </div>
  );
}

export function Nav() {
  return (
    <header className="nx-nav">
      <div className="nx-nav__inner">
        <Link href={to("/")} className="nx-brand" aria-label={`${SITE.name} home`}>
          <Mark />
          <span>{SITE.name}</span>
        </Link>
        <nav className="nx-nav__links nx-label" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nx-nav__end">
          <Link href={to("/contact")} className="nx-nav__cta nx-label nx-label--fg">
            Start a project
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
          <details className="nx-menu">
            <summary className="nx-label nx-label--fg">Menu</summary>
            <nav className="nx-menu__panel" aria-label="Primary">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="nx-h3">
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

/** The ask, the links, and the wordmark as a ground plane. */
export function End({ ask = true }: { ask?: boolean }) {
  return (
    <footer className="nx-end">
      <div className="nx-wrap">
        {ask && (
        <div className="nx-end__ask">
          <span className="nx-label">Start a project</span>
          <Link href={to("/contact")} className="nx-title nx-end__cta">
            Tell us what you are building{" "}
            <ArrowUpRight aria-hidden="true" strokeWidth={1.25} />
          </Link>
          <p className="nx-body" style={{ maxWidth: "30rem" }}>
            The first step is a written analysis and a recommended path. It is yours to keep,
            whether or not we build it together.
          </p>
        </div>
        )}
        <div className="nx-end__row">
          <a href={`mailto:${SITE.email}`} className="nx-link">
            {SITE.email}
          </a>
          <nav className="nx-end__links nx-label" aria-label="Footer">
            <a href={SITE.social.github} rel="noopener noreferrer" target="_blank">
              GitHub
            </a>
            <a href={SITE.social.linkedin} rel="noopener noreferrer" target="_blank">
              LinkedIn
            </a>
            <a href={SITE.social.x} rel="noopener noreferrer" target="_blank">
              X
            </a>
            <a href={SITE.social.instagram} rel="noopener noreferrer" target="_blank">
              Instagram
            </a>
            <Link href={to("/privacy")}>Privacy</Link>
          </nav>
        </div>
      </div>
      <div className="nx-end__mark" aria-hidden="true">
        RIDOX
      </div>
    </footer>
  );
}

/** Label in the first three columns, statement in the rest. Opens every band. */
export function BandHead({
  index,
  label,
  children,
  action,
}: {
  index: string;
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="nx-grid nx-bandhead">
      <div className="nx-col-label nx-stack" style={{ gap: "var(--nx-2)" }}>
        <span className="nx-label nx-label--num">{index}</span>
        <span className="nx-label nx-label--fg">{label}</span>
      </div>
      <div className="nx-col-main nx-stack" style={{ gap: "var(--nx-8)" }}>
        {children}
        {action}
      </div>
    </div>
  );
}

/** Opens every inner page: label, wide title, optional lede and extras. */
export function PageHead({
  label,
  title,
  lede,
  children,
}: {
  label: string;
  title: React.ReactNode;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="nx-pagehead">
      <div className="nx-wrap">
        <div className="nx-pagehead__inner">
          <span className="nx-label nx-label--fg nx-rise">{label}</span>
          <h1 className="nx-title nx-rise" style={{ "--nx-i": 1 } as React.CSSProperties}>
            {title}
          </h1>
          {(lede || children) && (
            <div className="nx-pagehead__foot nx-rise" style={{ "--nx-i": 2 } as React.CSSProperties}>
              {lede && <p className="nx-pagehead__lede">{lede}</p>}
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
