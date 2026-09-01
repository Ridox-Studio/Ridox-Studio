import type { ReactNode } from "react";
import clsx from "clsx";
import { Container } from "@/app/components/shared/SectionHeader";
import { Reveal } from "@/app/components/shared/Reveal";

/**
 * Sub-page masthead. Sub-pages need no preloader — the Redox Door has already
 * covered the swap — so content simply enters with a staggered reveal (8.1).
 */
export function PageHeader({
  overline,
  title,
  lede,
  accent = "amber",
  children,
}: {
  overline: string;
  title: string;
  lede: string;
  accent?: "amber" | "indigo";
  children?: ReactNode;
}) {
  return (
    <header className="relative flex w-full flex-col overflow-hidden pt-24 pb-10 md:pt-32 md:pb-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            accent === "amber"
              ? "var(--gradient-amber-fade)"
              : "var(--gradient-indigo-fade)",
        }}
      />
      <Container className="relative gap-6">
        <Reveal className="flex flex-col gap-6">
          <p
            className={clsx(
              "type-overline font-mono",
              accent === "amber" ? "text-amber-400" : "text-indigo-300",
            )}
          >
            {overline}
          </p>
          <h1 className="type-hero font-display text-content-primary">{title}</h1>
          <p className="type-body max-w-2xl text-content-secondary">{lede}</p>
          {children}
        </Reveal>
      </Container>
    </header>
  );
}
