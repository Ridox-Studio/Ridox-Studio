"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Wraps a block of post content (cover image + rendered markdown) and turns
 * every <img> inside it into a click-to-enlarge trigger — one delegated
 * listener rather than instrumenting each image, since the markdown body is
 * raw HTML we don't control image-by-image. Desktop only (`lg`, 1024px):
 * on a phone the image is already full width, so there is nothing worth
 * enlarging further.
 */
export function ImageLightbox({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<{ src: string; alt: string } | null>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const img = (event.target as HTMLElement).closest("img");
    if (!img) return;
    event.preventDefault();
    setOpen({ src: img.currentSrc || img.src, alt: img.alt || "" });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <>
      <div onClick={handleClick} className="contents lg:[&_img]:cursor-zoom-in">
        {children}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={open.alt || "Enlarged image"}
            className="fixed inset-0 z-50 flex items-center justify-center bg-surface-void/95 p-6 backdrop-blur-sm"
            onClick={() => setOpen(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <button
              type="button"
              aria-label="Close image"
              className="absolute top-6 right-6 text-content-primary/70 transition-colors hover:text-content-primary"
              onClick={() => setOpen(null)}
            >
              <X size={28} />
            </button>
            {/* Source is whatever the markdown/cover image already resolved
                to (including Next's optimized srcset via currentSrc) — plain
                img, not next/image, since this is an already-loaded runtime
                src. */}
            <motion.img
              src={open.src}
              alt={open.alt}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
