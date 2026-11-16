import type { Metadata } from "next";
import { DraftStrip, Nav } from "./_components/chrome";
import "./noir.css";

/**
 * DRAFT — the "Noir" design. This route group owns everything under /noir;
 * the live site is untouched. Noir adds no fonts: it is Archivo at both ends
 * of its width axis, plus Inter, both already loaded by the root layout.
 */

// Inherited by every page in the group. Remove on promotion.
export const metadata: Metadata = {
  title: "Noir draft",
  robots: { index: false, follow: false },
};

export default function NoirLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nx">
      <DraftStrip />
      <Nav />
      {children}
    </div>
  );
}
