"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import { EASING, SLASH, staggerChild, staggerParent } from "@/app/lib/motion";
import { NAV_ITEMS, SITE } from "@/app/lib/site";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

/**
 * Section 5.1 — the trigger expands into a full-screen overlay split along the
 * logo's diagonal. Desktop steps the links down the slash; mobile stacks them
 * centred with large tap targets (Section 13.2).
 */
export function FullScreenMenu({ onDismiss }: { onDismiss: () => void }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape closes; focus moves into the overlay for keyboard users.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onDismiss]);

  return (
    <motion.div
      ref={panelRef}
      tabIndex={-1}
      className="fixed inset-0 z-40 outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.2 : 0.4, ease: EASING.redox }}
    >
      {/* Backdrop — click outside the links dismisses */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onDismiss}
        className="absolute inset-0 bg-surface-void/95 backdrop-blur-xl"
      />

      {/* Diagonal duality tint — decorative on both breakpoints */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-amber-ghost"
        style={{ clipPath: SLASH.amberHalf }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-indigo-ghost"
        style={{ clipPath: SLASH.indigoHalf }}
      />

      <nav
        aria-label="Main navigation"
        className="pointer-events-none relative flex h-full flex-col items-center justify-center px-6 py-24"
      >
        <motion.ul
          className="pointer-events-auto flex w-full max-w-2xl flex-col items-center gap-2 md:items-stretch md:gap-1"
          variants={staggerParent(reduce ? 0 : 0.07, 0.15)}
          initial="hidden"
          animate="visible"
        >
          {NAV_ITEMS.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <motion.li
                key={item.href}
                variants={staggerChild(reduce)}
                className="w-full"
                // Desktop only: each link steps further along the slash line.
                // This is layout, not motion — it must not depend on `reduce`,
                // or the diagonal collapses into a plain stack.
                style={{ "--step": `${index * 5}%` } as React.CSSProperties}
              >
                <TransitionLink
                  href={item.href}
                  label={item.label}
                  onNavigate={onDismiss}
                  className={clsx(
                    "group flex w-full items-baseline justify-center gap-4 rounded-sm py-4 text-2xl font-black tracking-tight transition-colors md:justify-start md:py-3 md:ps-[var(--step)] md:text-5xl",
                    isActive
                      ? "text-amber-400"
                      : "text-content-primary hover:text-amber-400",
                  )}
                >
                  <span className="font-mono text-[0.6875rem] font-medium tracking-[0.15em] text-content-tertiary">
                    0{index + 1}
                  </span>
                  <span className="font-display">{item.label}</span>
                </TransitionLink>
              </motion.li>
            );
          })}
        </motion.ul>

        <motion.p
          className="pointer-events-auto absolute bottom-10 font-mono text-[0.6875rem] tracking-[0.15em] text-content-tertiary uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <a href={`mailto:${SITE.email}`} className="hover:text-indigo-300">
            {SITE.email}
          </a>
        </motion.p>
      </nav>
    </motion.div>
  );
}
