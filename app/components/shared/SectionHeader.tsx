import clsx from "clsx";
import type { ReactNode } from "react";

/** Shared section masthead — overline, title, optional lede and trailing slot. */
export function SectionHeader({
  overline,
  title,
  lede,
  accent = "amber",
  action,
  className,
}: {
  overline: string;
  title: ReactNode;
  lede?: string;
  accent?: "amber" | "indigo";
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header className={clsx("flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
        <div className="flex flex-col gap-4">
          <p
            className={clsx(
              "type-overline font-mono",
              accent === "amber" ? "text-amber-400" : "text-indigo-300",
            )}
          >
            {overline}
          </p>
          <h2 className="type-section font-display text-content-primary">{title}</h2>
        </div>
        {action}
      </div>
      {lede && <p className="type-body max-w-2xl text-content-secondary">{lede}</p>}
    </header>
  );
}

/** Standard page gutter + 1400px max content width (Section 4.2). */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  // Centred with flex rather than auto margins — Section 4.1 Rule 1.
  return (
    <div className="flex w-full justify-center px-6 md:px-12">
      <div className={clsx("flex w-full max-w-[1400px] flex-col", className)}>{children}</div>
    </div>
  );
}
