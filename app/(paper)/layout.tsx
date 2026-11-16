import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import { DraftStrip, Nav } from "./_components/chrome";
import "./paper.css";

/**
 * DRAFT — the "Paper" design. This route group owns everything under /paper;
 * the live site is untouched. Archivo and Inter come from the root layout;
 * these two are the additions, loaded here so the live site does not pay
 * for them. Fraunces is only ever used italic.
 */
const serif = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Inherited by every page in the group. Remove on promotion.
export const metadata: Metadata = {
  title: "Paper draft",
  robots: { index: false, follow: false },
};

export default function PaperLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`nd ${serif.variable} ${mono.variable}`}>
      <DraftStrip />
      <Nav />
      {children}
    </div>
  );
}
