"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";
import { Logo } from "@/app/components/shared/Logo";

/**
 * next/image with a branded fallback. A missing or broken cover renders the
 * Variant 7 mark on the void surface rather than the browser's broken-image
 * glyph, so a bad asset never breaks the brand.
 */
export function ProjectImage({
  src,
  alt,
  title,
  accent = "amber",
  priority = false,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  /** Shown inside the fallback panel. */
  title: string;
  accent?: "amber" | "indigo";
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={clsx(
          "absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface-void",
          className,
        )}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{ background: "var(--gradient-slash)", filter: "blur(80px)" }}
        />
        <Logo size={56} />
        <span
          className={clsx(
            "relative font-mono text-[0.6875rem] tracking-[0.15em] uppercase",
            accent === "amber" ? "text-amber-400" : "text-indigo-300",
          )}
        >
          {title}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      loading={priority ? undefined : "lazy"}
      sizes={sizes}
      onError={() => setFailed(true)}
      className={clsx("object-cover", className)}
    />
  );
}
