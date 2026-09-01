"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { doorVariants, SLASH } from "@/app/lib/motion";
import { Logo } from "@/app/components/shared/Logo";
import { useMotionPrefs } from "@/app/components/providers/MotionProvider";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

const MINIMUM_VISIBLE_MS = 1600;

/**
 * The wordmark painted on the closed door. Rendered once inside EACH half at
 * identical coordinates, so the two clipped copies line up into one continuous
 * lockup — the diagonal slash cuts through the letters rather than between
 * them, and the word tears along that line as the halves part.
 */
function DoorWordmark() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex flex-col items-center justify-center text-surface-void"
    >
      <span className="type-door font-display">RIDOX</span>
      <span className="type-door font-display">STUDIO</span>
    </div>
  );
}

/**
 * Section 6.1 — the controlled reveal.
 *
 * Runs on every full page load. Client-side route changes never remount this
 * component, so they get the Redox Door instead, exactly as specified.
 *
 * It renders during SSR too: the overlay must own the very first painted frame,
 * otherwise the reader sees the page before the curtain drops.
 */
export function Preloader() {
  const reduce = useReducedMotion();
  const { minimal } = useMotionPrefs();
  const [revealing, setRevealing] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // `minimal` is false during SSR, so the overlay is always in the initial
  // HTML; minimal-mode readers drop it on their first client render.
  const active = !dismissed && !minimal;

  // Hold the overlay until assets are loaded, but never below the minimum.
  useEffect(() => {
    if (!active) return;

    document.body.style.overflow = "hidden";
    const start = performance.now();
    let timer = 0;

    const finish = () => {
      const elapsed = performance.now() - start;
      timer = window.setTimeout(
        () => setRevealing(true),
        Math.max(0, MINIMUM_VISIBLE_MS - elapsed),
      );
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
      window.removeEventListener("load", finish);
    };
  }, [active]);

  const dismiss = () => {
    setDismissed(true);
    document.body.style.overflow = "";
    // Scroll-linked sections measured themselves while the body was locked;
    // a resize tells Framer Motion to re-measure now the page can move.
    window.dispatchEvent(new Event("resize"));
  };

  // Skipping the intro skips the intro — nothing more. Turning motion off
  // site-wide is a separate, explicitly labelled choice in the footer.
  const skip = () => dismiss();

  if (!active) return null;

  return (
    <>
      {/* Without JavaScript the reveal can never run, so never draw the curtain. */}
      <noscript>
        <style>{`#ridox-preloader { display: none !important; }`}</style>
      </noscript>

      {reduce ? (
        // Reduced motion — static mark, plain fade out.
        <AnimatePresence onExitComplete={dismiss}>
          {!revealing && (
            <motion.div
              key="preloader-reduced"
              id="ridox-preloader"
              className="fixed inset-0 z-[60] flex items-center justify-center bg-surface-void"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Logo size={80} />
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <div id="ridox-preloader" className="fixed inset-0 z-[60]">
          {/* The initial load is the Redox Door already shut: the same two
              halves, holding the sliding duality, then parting on reveal. */}
          <motion.div
            className="absolute inset-0 bg-amber-400"
            style={{ clipPath: SLASH.amberHalf }}
            variants={doorVariants(1, 0.6, 1.2)}
            initial="closed"
            animate={revealing ? "offscreen" : "duality"}
            onAnimationComplete={(definition) => {
              if (definition === "offscreen") dismiss();
            }}
          >
            <DoorWordmark />
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-indigo-300"
            style={{ clipPath: SLASH.indigoHalf }}
            variants={doorVariants(-1, 0.6, 1.2)}
            initial="closed"
            animate={revealing ? "offscreen" : "duality"}
          >
            <DoorWordmark />
          </motion.div>

          <AnimatePresence>
            {!revealing && (
              <motion.div
                key="preloader-chrome"
                className="absolute inset-0 flex items-center justify-center"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* No logo mark here — the two halves ARE the mark at
                    viewport scale, so a second one just competes with them. */}
                <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[0.6875rem] text-surface-void md:left-8 md:translate-x-0">
                  Initializing Redox Engine
                  <motion.span
                    aria-hidden="true"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  >
                    _
                  </motion.span>
                </p>

                <button
                  type="button"
                  onClick={skip}
                  className="absolute top-6 right-6 flex min-h-11 min-w-11 items-center rounded-sm px-3 font-mono text-xs text-surface-void underline decoration-surface-void/40 underline-offset-4"
                >
                  Skip intro →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
