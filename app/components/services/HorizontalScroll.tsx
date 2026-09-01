"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { Service } from "@/app/data/content";
import { useIsDesktop } from "@/app/hooks/useMediaQuery";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

function ServicePanel({ service, className }: { service: Service; className?: string }) {
  const amber = service.accent === "amber";
  return (
    <article
      className={clsx(
        "flex h-full flex-col justify-center gap-6 rounded-2xl border bg-surface-card p-8 md:p-14",
        amber ? "border-amber-400/25" : "border-indigo-300/25",
        className,
      )}
    >
      <span
        className={clsx(
          "font-mono text-5xl font-medium md:text-7xl",
          amber ? "text-amber-400/30" : "text-indigo-300/30",
        )}
      >
        {service.index}
      </span>
      <h3 className="type-section font-display text-content-primary">{service.title}</h3>
      <p className="type-body max-w-prose text-content-secondary">{service.summary}</p>
      <ul className="flex flex-col gap-3">
        {service.capabilities.map((capability) => (
          <li key={capability} className="flex items-baseline gap-3">
            <span
              aria-hidden="true"
              className={clsx(
                "size-1.5 shrink-0 translate-y-[-0.15em] rounded-full",
                amber ? "bg-amber-400" : "bg-indigo-300",
              )}
            />
            <span className="type-body text-content-primary">{capability}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/**
 * Section 7.4 / 13.6 — desktop maps vertical scroll to horizontal travel;
 * mobile uses a native snap carousel, which is the touch-correct pattern.
 */
export function HorizontalScroll({ services }: { services: Service[] }) {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  const pinned = isDesktop && !reduce;

  if (!pinned) return <ServiceCarousel services={services} />;
  // Remounting on breakpoint change forces useScroll to re-measure cleanly.
  return <PinnedTrack services={services} />;
}

function PinnedTrack({ services }: { services: Service[] }) {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

  // Distance the track must cover so the last panel lands flush at the right.
  const measure = useCallback(() => {
    const node = track.current;
    if (!node) return;
    setTravel((current) => {
      const next = Math.max(0, node.scrollWidth - node.clientWidth);
      return Math.abs(next - current) < 1 ? current : next;
    });
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, services.length]);

  // Panel widths are viewport-relative, and web fonts land after first paint —
  // both change scrollWidth, so observe rather than measuring once.
  useEffect(() => {
    const node = track.current;
    if (!node) return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    Array.from(node.children).forEach((child) => observer.observe(child));
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  return (
    <div
      ref={container}
      // Scroll distance = the horizontal travel plus one viewport of pinning.
      style={{ height: `calc(100svh + ${travel}px)` }}
      className="relative"
    >
      {/* Offset by the pinned section rail so panels clear the label. */}
      <div className="sticky top-[var(--rail-h)] flex h-[calc(100svh-var(--rail-h))] items-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex gap-8 px-12">
          {services.map((service) => (
            <div key={service.index} className="h-[70svh] w-[75vw] shrink-0 xl:w-[55vw]">
              <ServicePanel service={service} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function ServiceCarousel({ services }: { services: Service[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Dot indicators track the snapped panel (Section 13.6).
  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActive(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { root: node, threshold: 0.6 },
    );
    node.querySelectorAll("[data-index]").forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, [services.length]);

  return (
    <div className="flex flex-col gap-6">
      <div
        ref={scroller}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2"
      >
        {services.map((service, index) => (
          <div key={service.index} data-index={index} className="w-[85vw] shrink-0 snap-center">
            <ServicePanel service={service} className="h-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2" aria-hidden="true">
        {services.map((service, index) => (
          <span
            key={service.index}
            className={clsx(
              "h-1 rounded-full transition-all duration-300",
              index === active ? "w-6 bg-amber-400" : "w-1.5 bg-content-tertiary/40",
            )}
          />
        ))}
      </div>
    </div>
  );
}
