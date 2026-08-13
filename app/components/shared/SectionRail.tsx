import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * A slim label that pins to the top for the duration of its section, so the
 * reader always knows what they are scrolling through once the section's own
 * heading has left the viewport.
 *
 * Placed as a sibling *after* the full SectionHeader: the big heading still
 * introduces the section, and this takes over as it scrolls away. It unsticks
 * automatically at the end of its parent section.
 */
export function SectionRail({
  overline,
  title,
  accent = "amber",
  action,
}: {
  overline: string;
  title: string;
  accent?: "amber" | "indigo";
  action?: ReactNode;
}) {
  return (
    <div
      className="sticky top-0 z-30 flex h-[var(--rail-h)] w-full justify-center border-y border-edge-subtle bg-surface-deep/85 px-6 backdrop-blur-md md:px-12"
    >
      <div className="flex w-full max-w-[1400px] items-center justify-between gap-4">
        <div className="flex min-w-0 items-baseline gap-3">
          <span
            className={clsx(
              "type-overline shrink-0 font-mono",
              accent === "amber" ? "text-amber-400" : "text-indigo-300",
            )}
          >
            {overline}
          </span>
          <span className="type-caption hidden truncate text-content-secondary md:block">
            {title}
          </span>
        </div>
        {action}
      </div>
    </div>
  );
}
