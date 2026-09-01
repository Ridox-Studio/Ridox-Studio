import { Container } from "@/app/components/shared/SectionHeader";
import { Logo } from "@/app/components/shared/Logo";
import { MotionToggle } from "@/app/components/shared/MotionToggle";
import { NAV_ITEMS, SITE } from "@/app/lib/site";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";

export function Footer() {
  return (
    <footer className="w-full border-t border-edge-subtle py-12">
      <Container className="gap-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Logo size={28} title={`${SITE.name} logo`} />
            <span className="font-display text-sm font-bold tracking-tight text-content-primary">
              {SITE.name}
            </span>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    label={item.label}
                    className="font-mono text-xs tracking-[0.15em] text-content-secondary uppercase transition-colors hover:text-amber-400"
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {Object.entries(SITE.social).map(([name, url]) => (
              <li key={name}>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-xs tracking-[0.15em] text-content-tertiary uppercase transition-colors hover:text-indigo-300"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6 border-t border-edge-subtle pt-6 md:flex-row md:items-end md:justify-between">
          <p className="font-mono text-[0.6875rem] text-content-tertiary">
            © {new Date().getFullYear()} {SITE.name} — {SITE.tagline}.
          </p>
          <MotionToggle />
        </div>
      </Container>
    </footer>
  );
}
