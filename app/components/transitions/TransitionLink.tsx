"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { useTransition } from "@/app/components/transitions/TransitionContext";

type TransitionLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Shown between the closed doors during Phase 2, e.g. "Work" → "// WORK". */
  label?: string;
  onNavigate?: () => void;
  "aria-label"?: string;
};

/**
 * Every internal navigation goes through here: the Redox Door closes first,
 * then the route changes (Section 7.6). Renders a real <a href> so crawlers
 * and middle-click still see an ordinary link.
 */
export function TransitionLink({
  href,
  children,
  className,
  label,
  onNavigate,
  ...rest
}: TransitionLinkProps) {
  const { navigate } = useTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Let the browser handle new-tab / download / modified clicks natively.
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    onNavigate?.();
    navigate(href, label);
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
