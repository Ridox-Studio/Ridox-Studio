import type { Metadata, Viewport } from "next";
import { Archivo, Inter, Bitcount_Prop_Single } from "next/font/google";
import { SITE } from "@/app/lib/site";
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

/** The capabilities the studio sells, reused across the schema blocks. */
const SERVICE_AREAS = [
  "Web application development",
  "Mobile app development",
  "Cloud infrastructure and DevOps",
  "AI and machine learning systems",
  "Software architecture and system design",
  "Product engineering",
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
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
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: SITE.email,
    url: `${SITE.url}/contact`,
    areaServed: "Worldwide",
    availableLanguage: ["en"],
  },
};

/**
 * ProfessionalService narrows the entity from "an organization" to "a firm you
 * can hire", which is the type Google associates with agency search intent.
 * Same name/url as the Organization block so they resolve to one entity.
 */
const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}/logos/social/ridox-studio-profile-dark-1024.png`,
  description: SITE.longDescription,
  address: { "@type": "PostalAddress", addressCountry: "NG" },
  areaServed: "Worldwide",
  priceRange: "$$",
  serviceType: SERVICE_AREAS,
  sameAs: Object.values(SITE.social),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Software engineering services",
    itemListElement: SERVICE_AREAS.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service },
    })),
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
        <SiteAnalytics />
      </body>
    </html>
  );
}
