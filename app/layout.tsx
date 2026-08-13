import type { Metadata, Viewport } from "next";
import { Archivo, Inter, Bitcount_Prop_Single } from "next/font/google";
import { SITE } from "@/app/lib/site";
import { SiteShell } from "@/app/components/providers/SiteShell";
import "./globals.css";

/**
 * Display — Archivo carries both a weight and a width axis, so headings can
 * be set Expanded + Black for the wide, heavy, tight-leading masthead look.
 */
// NB: these variable names must NOT collide with the Tailwind theme tokens
// (--font-display / --font-body / --font-mono). Same name means the token
// resolves to itself, which is a circular reference CSS silently discards.
const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
  preload: true,
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Accent voice — status labels, tech pills, overlines. */
const mono = Bitcount_Prop_Single({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-bitcount",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Software Systems Engineered at the Reaction Point`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "software agency",
    "web development",
    "mobile apps",
    "cloud infrastructure",
    "AI development",
    "Ridox Studio",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  // Favicons come from the file conventions app/icon.svg + app/apple-icon.png
  openGraph: {
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    creator: SITE.twitter,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0b1a",
  colorScheme: "dark",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logos/ridox-studio-logo.svg`,
  description: SITE.description,
  sameAs: [SITE.social.twitter, SITE.social.github, SITE.social.linkedin],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    url: `${SITE.url}/contact`,
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE.url}/work?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
