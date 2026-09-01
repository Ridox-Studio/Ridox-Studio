"use client";

import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };

/**
 * Pointer position normalised to -0.5..0.5 relative to the viewport centre.
 * Returns { x: 0, y: 0 } on touch devices — gated on `(hover: hover)` so we
 * never assume a mouse exists (Section 4.2).
 */
export function useMousePosition(enabled = true): Point {
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let frame = 0;
    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setPosition({
          x: event.clientX / window.innerWidth - 0.5,
          y: event.clientY / window.innerHeight - 0.5,
        });
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
    };
  }, [enabled]);

  return position;
}

/**
 * Writes the cursor's position within an element to the `--mouse-x` /
 * `--mouse-y` custom properties, driving the radial spotlight (Section 7.5)
 * without re-rendering React on every frame.
 */
export function useSpotlight<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let frame = 0;
    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        node.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
        node.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
      });
    };

    node.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("mousemove", onMove);
    };
  }, [enabled]);

  return ref;
}
