"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { EASING } from "@/app/lib/motion";
import { SERVICES } from "@/app/data/content";
import { getProjectsByCategory, getWorkProjects } from "@/app/data/projects";
import { SITE } from "@/app/lib/site";
import { Logo } from "@/app/components/shared/Logo";
import { MagneticButton } from "@/app/components/shared/MagneticButton";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";
import { useMousePosition } from "@/app/hooks/useMousePosition";
import { useMotionPrefs } from "@/app/components/providers/MotionProvider";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

/**
 * Section 13.3 — on touch devices the watermark parallax is driven by the
 * gyroscope instead of the cursor. Static where neither exists.
 */
function useTilt(enabled: boolean) {
  const x = useSpring(0, { stiffness: 60, damping: 20 });
  const y = useSpring(0, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (!enabled) return;
    if (typeof DeviceOrientationEvent === "undefined") return;

    const onOrient = (event: DeviceOrientationEvent) => {
      // gamma: left/right tilt, beta: front/back tilt — clamped to ±3 degrees.
      x.set(Math.max(-3, Math.min(3, (event.gamma ?? 0) / 15)));
      y.set(Math.max(-3, Math.min(3, ((event.beta ?? 0) - 45) / 15)));
    };

    window.addEventListener("deviceorientation", onOrient);
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, [enabled, x, y]);

  return { x, y };
}

const VERTICAL_WORDS =
  "REDUCTION ◆ OXIDATION ◆ ENGINEERING ◆ DESIGN ◆ ARCHITECTURE ◆ TRANSFORMATION ◆ ";

/**
 * Facts, not filler. Every value is derived from the data that renders the
 * rest of the site, so none of it can drift — or be quietly inflated.
 */
const pad = (value: number) => String(value).padStart(2, "0");

const CANVAS_META = [
  { label: "Established", value: String(SITE.founded) },
  { label: "Capabilities", value: pad(SERVICES.length) },
  { label: "Products", value: pad(getProjectsByCategory("studio").length) },
  { label: "Engagements", value: pad(getWorkProjects().length) },
];

/** Section 6.2 — the opening canvas. Not a hero. */
export function OpeningCanvas() {
  const reduce = useReducedMotion();
  const { hasPointer } = useMotionPrefs();
  const pointer = useMousePosition(hasPointer && !reduce);
  const tilt = useTilt(!hasPointer && !reduce);

  const cursorRotate = pointer.x * 6; // ±3 degrees at the viewport edges
  const cursorShift = pointer.y * 6;

  return (
    <section
      data-zone="neutral"
      className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden px-6 py-24 md:px-12"
    >
      {/* Giant watermark — bleeds off the right edge on desktop, centred on mobile */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.10] md:left-auto md:right-[-10vw] md:translate-x-0 md:opacity-[0.16]"
        style={hasPointer ? undefined : { rotate: tilt.x, y: tilt.y }}
        animate={hasPointer && !reduce ? { rotate: cursorRotate, y: cursorShift } : undefined}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
      >
        <div className="w-[78vw] md:w-[54vw]">
          {/* w-full/h-auto override the intrinsic square size */}
          <Logo className="h-auto w-full" />
        </div>
      </motion.div>

      {/* Right-edge vertical word strip — fills the dead column beside the
          wordmark and gives the canvas a second axis of motion. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 overflow-hidden md:flex md:justify-center"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 18%, black 82%, transparent)",
        }}
      >
        <div className={reduce ? "v-marquee [animation:none]" : "v-marquee"}>
          <span className="font-mono text-[0.6875rem] tracking-[0.4em] text-content-tertiary uppercase">
            {`${VERTICAL_WORDS}${VERTICAL_WORDS}`}
          </span>
        </div>
      </div>

      <div className="relative flex w-full max-w-[1400px] flex-col gap-8">
        <motion.p
          className="type-overline font-mono text-content-tertiary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASING.reveal }}
        >
          Reduction ◆ Oxidation
        </motion.p>

        {/* The visible wordmark is the two stacked blocks; the descriptive
            phrase is what search engines and screen readers read as the H1.
            One <h1> per page, keyword-first, with the brand mark intact. */}
        <h1 className="flex flex-col font-display text-content-primary">
          <span className="sr-only">
            {SITE.name} — a software engineering agency building web, mobile,
            cloud and AI systems
          </span>
          <motion.span
            aria-hidden="true"
            className="type-mega block"
            initial={{ opacity: 0, y: reduce ? 0 : 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.3 : 0.9, delay: 0.3, ease: EASING.redox }}
          >
            RIDOX
          </motion.span>
          <motion.span
            aria-hidden="true"
            className="type-mega type-mega-outline block"
            initial={{ opacity: 0, y: reduce ? 0 : 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.3 : 0.9, delay: 0.42, ease: EASING.redox }}
          >
            STUDIO
          </motion.span>
        </h1>

        <motion.p
          className="type-body max-w-xl text-content-secondary"
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.3 : 0.7, delay: 0.65, ease: EASING.reveal }}
        >
          {SITE.tagline}. We build where opposing forces meet — frontend and backend,
          speed and stability, design energy and engineering depth.
        </motion.p>

        {/* The hero had no path forward — a reader who did not want to scroll
            six sections had no way to act.
            Button copy is deliberately plain rather than "Start a Reaction":
            everywhere else that phrase appears, the visitor has already
            scrolled through redox-themed copy that sets it up — here it
            would be the first thing said to someone who has seen only the
            wordmark. Same reasoning that dropped "reaction" from the process
            step titles (aab2cbf), kept as flavour in body copy rather than an
            actionable label a first-time visitor has to decode.
            "Tell us your idea" over "Talk to an engineer": the audience is
            school owners and small-business founders, not developers — they
            think in terms of their problem, not our job titles. It also
            avoids "book a free consultation", which would contradict
            /contact's own "no discovery-call funnel, not a calendar link":
            nothing here promises a call, only that a message gets read and
            answered. */}
        <motion.div
          className="flex flex-wrap items-center gap-x-8 gap-y-4"
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.3 : 0.7, delay: 0.72, ease: EASING.reveal }}
        >
          <MagneticButton href="/contact" label="Contact">
            Tell us your idea
          </MagneticButton>
          <TransitionLink
            href="/work"
            label="Work"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.15em] text-content-secondary uppercase transition-colors hover:text-indigo-300"
          >
            See the work
            <ArrowUpRight size={14} aria-hidden="true" />
          </TransitionLink>
        </motion.div>

        <motion.dl
          className="flex flex-wrap gap-x-10 gap-y-4 border-t border-edge-subtle pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: EASING.reveal }}
        >
          {CANVAS_META.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <dt className="type-overline font-mono text-content-tertiary">
                {item.label}
              </dt>
              <dd className="font-display text-2xl font-extrabold text-content-primary">
                {item.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* Scroll indicator — the vertical strip carries this on desktop, so
          mobile only needs the chevron. */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden"
        animate={reduce ? undefined : { y: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-content-tertiary">
          <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
