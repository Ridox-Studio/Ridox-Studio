"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EASING } from "@/app/lib/motion";
import { NAV_ITEMS } from "@/app/lib/site";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";
import { useTransition } from "@/app/components/transitions/TransitionContext";

/** "/work/netcart" -> "/work", "/work" -> "/". Always somewhere real. */
function parentOf(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return "/";
  return `/${segments.slice(0, -1).join("/")}`;
}

function labelFor(pathname: string): string {
  if (pathname === "/") return "Home";
  const match = NAV_ITEMS.find((item) => item.href === pathname);
  if (match) return match.label;
  // A deep link: name it after its section rather than its slug.
  const parent = NAV_ITEMS.find((item) => item.href === parentOf(pathname));
  return parent?.label ?? "Back";
}

/**
 * The counterpart to the floating menu trigger, mirrored to the top-left.
 *
 * Navigation lives at the bottom-right, which makes "go back" — the most
 * common thing a reader wants on a sub-page — a two-tap job on a phone. This
 * makes it one.
 *
 * It resolves a destination rather than calling history.back(): a reader who
 * arrived from a search result or a shared link has no in-app history, and
 * back() would throw them off the site entirely. Where we know the previous
 * route we return to it; otherwise we walk up to the parent section.
 */
export function BackTrigger() {
  const pathname = usePathname();
  const { covered, previousPath } = useTransition();

  // The homepage is the root — there is nowhere above it to go.
  if (pathname === "/") return null;

  const destination = previousPath ?? parentOf(pathname);
  const label = labelFor(destination);

  return (
    <motion.div
      className="fixed top-[max(1.5rem,env(safe-area-inset-top))] left-[max(1.5rem,env(safe-area-inset-left))] z-[45]"
      animate={{ opacity: covered ? 0 : 1, scale: covered ? 0.8 : 1 }}
      transition={{ duration: 0.3, ease: EASING.snap }}
    >
      <TransitionLink
        href={destination}
        label={label}
        aria-label={`Back to ${label}`}
        className="group flex min-h-11 items-center gap-2 rounded-xl border-2 border-edge-subtle bg-surface-card/80 px-3 backdrop-blur-md transition-colors hover:border-amber-400"
      >
        <ArrowLeft
          size={16}
          aria-hidden="true"
          className="text-content-secondary transition-colors group-hover:text-amber-400"
        />
        {/* The arrow alone carries the meaning on a phone, where space is
            tighter and the gesture is already familiar. */}
        <span className="hidden font-mono text-xs tracking-[0.15em] text-content-secondary uppercase transition-colors group-hover:text-amber-400 sm:inline">
          {label}
        </span>
      </TransitionLink>
    </motion.div>
  );
}
