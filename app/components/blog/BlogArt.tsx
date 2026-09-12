import clsx from "clsx";
import { Logo } from "@/app/components/shared/Logo";

/**
 * Cycled across the grid by post index — two solid brand hues plus the
 * gradient that already carries meaning everywhere else on the site (BRAND.md
 * §2.4: "gradients always flow amber → indigo"). Three distinct looks without
 * inventing a third colour.
 */
export type ArtVariant = "amber" | "indigo" | "gradient";

export function variantForIndex(index: number): ArtVariant {
  const cycle: ArtVariant[] = ["amber", "indigo", "gradient"];
  return cycle[index % cycle.length];
}

const VARIANT_BG: Record<ArtVariant, string> = {
  amber: "var(--amber-400)",
  indigo: "var(--indigo-300)",
  gradient: "var(--gradient-brand)",
};

/**
 * The card's full-bleed ground colour — amber, indigo, or the brand gradient,
 * cycling by post index. This is deliberately NOT "the image": it is the
 * card's background, with the grid texture every generated surface on the
 * site shares (BRAND.md §6.1). The actual thumbnail (a real cover photo, or
 * ThumbnailPlaceholder below when there is none) sits on top of it as its
 * own distinct rectangle, not painted flat into this background.
 */
export function BlogArt({ variant, className }: { variant: ArtVariant; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={clsx("absolute inset-0", className)}
      style={{ background: VARIANT_BG[variant] }}
    >
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(var(--bg-void) 1px, transparent 1px), linear-gradient(90deg, var(--bg-void) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}

/**
 * What sits in the image rectangle when a post has no real cover photo:
 * always the void ground, never the card's own bright colour inverted per
 * tile. The logo mark carries both brand hues (an amber block and an indigo
 * block), so on a solid amber-or-indigo card half of it would always
 * disappear into whichever hue matches — void is the one ground the full
 * two-tone mark reads correctly against, regardless of which variant the
 * card itself is cycled to.
 */
export function ThumbnailPlaceholder({ title }: { title: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden bg-surface-void px-4"
    >
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <Logo size={32} className="relative" />
      {/* A tiny caption baked into the generated art itself — separate from
          the card's own (larger) title below the rectangle, the same way a
          real cover photo would carry its own watermark. */}
      <span className="type-caption relative line-clamp-2 text-center font-mono text-content-tertiary">
        {title}
      </span>
    </div>
  );
}
