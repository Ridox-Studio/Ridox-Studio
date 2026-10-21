import type { Metadata, Viewport } from "next";
import { Archivo, Inter, Bitcount_Prop_Single } from "next/font/google";
import { FOUNDER, SCHEMA_IDS, SITE } from "@/app/lib/site";
import { SiteShell } from "@/app/components/providers/SiteShell";
import { SiteAnalytics } from "@/app/components/analytics/SiteAnalytics";
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
    // Leads with the phrase people actually search; brand stays first for
    // recognition on branded queries. Kept ~54 chars — Google and LinkedIn
    // truncate past ~60.
    default: `${SITE.name} — Software Development & Engineering Agency`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  // No canonical here: it would be inherited by every route that forgets to
  // set its own, pointing them all at the homepage. buildPageMetadata sets a
  // self-referencing one per page.
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

/** The capabilities the studio sells, reused across the schema blocks. */
const SERVICE_AREAS = [
  "Web application development",
  "Mobile app development",
  "Cloud infrastructure and DevOps",
  "AI and machine learning systems",
  "Software architecture and system design",
  "Product engineering",
];

/**
 * One node, two types: ProfessionalService narrows "an organization" to "a
 * firm you can hire", the type Google associates with agency search intent.
 * Merged rather than emitted as a second block so there is no question of
 * whether they are the same entity.
 */
const organizationSchema = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": SCHEMA_IDS.organization,
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logos/ridox-studio-logo.svg`,
  image: `${SITE.url}/logos/social/ridox-studio-profile-dark-1024.png`,
  description: SITE.longDescription,
  slogan: SITE.tagline,
  email: SITE.email,
  // Derived so adding a profile to SITE.social is the only edit needed.
  sameAs: Object.values(SITE.social),
  // Country-level only — the studio is not tied to one city, and claiming a
  // street address it does not have would be worse than claiming none.
  address: { "@type": "PostalAddress", addressCountry: "NG" },
  areaServed: "Worldwide",
  knowsAbout: SERVICE_AREAS,
  foundingDate: String(SITE.founded),
  founder: FOUNDER,
  priceRange: "$$",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: SITE.email,
    url: `${SITE.url}/contact`,
    areaServed: "Worldwide",
    availableLanguage: ["en"],
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Software engineering services",
    itemListElement: SERVICE_AREAS.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service },
    })),
  },
};

// No SearchAction: /work has no `q` search, and advertising one that does
// nothing is a broken signal, not a neutral one.
const websiteSchema = {
  "@type": "WebSite",
  "@id": SCHEMA_IDS.website,
  name: SITE.name,
  alternateName: ["Ridox", "ridoxstudio"],
  // Same string as the homepage canonical and sitemap <loc> — Next.js always
  // renders the root canonical without a trailing slash.
  url: SITE.url,
  publisher: { "@id": SCHEMA_IDS.organization },
};

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [organizationSchema, websiteSchema],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      {/* suppressHydrationWarning is scoped to this one tag's attributes only
          — it does not hide mismatches in children. Needed here because
          browser extensions (Grammarly, password managers, ad blockers)
          inject attributes like data-gr-ext-installed onto <body> before
          React hydrates, which is a real DOM difference but not a bug in
          this app; without it, every visitor running such an extension sees
          a hydration-mismatch overlay in dev for something we cannot fix. */}
      <body suppressHydrationWarning>
        <SiteShell>{children}</SiteShell>
        <SiteAnalytics />
      </body>
    </html>
  );
}
