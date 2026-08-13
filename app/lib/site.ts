/**
 * The origin every absolute URL is built from — canonicals, JSON-LD, and the
 * og:image URLs crawlers fetch.
 *
 * This MUST match the origin actually serving the site. Hardcoding the final
 * domain before it resolves points social crawlers at nothing (blank previews)
 * and advertises canonicals on a dead host.
 *
 * Set NEXT_PUBLIC_SITE_URL to the production domain once it is live; the
 * Vercel fallbacks keep preview deployments self-consistent until then.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // Set by Vercel to the project's stable production domain.
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;

  // Per-deployment URL — correct for previews, changes every push.
  const deployment = process.env.VERCEL_URL;
  if (deployment) return `https://${deployment}`;

  return "http://localhost:3000";
}

export const SITE = {
  name: "Ridox Studio",
  url: resolveSiteUrl(),
  tagline: "Software systems engineered at the reaction point",
  /** Meta description — kept under 160 chars so search results do not truncate. */
  description:
    "A software engineering agency building web, mobile, cloud and AI systems at the reaction point — where design energy meets engineering depth.",
  /** The full positioning statement, for JSON-LD and anywhere length is free. */
  longDescription:
    "Ridox Studio is a software engineering agency specializing in high-performance web applications, mobile systems, cloud infrastructure, and AI-powered solutions. Built on the principle of Redox duality — balancing design energy with engineering depth.",
  twitter: "@ridoxstudio",
  social: {
    twitter: "https://twitter.com/ridoxstudio",
    github: "https://github.com/ridox-studio",
    linkedin: "https://linkedin.com/company/ridox-studio",
  },
  email: "hello@ridoxstudio.com",
} as const;

/** Section 5.2 — 5 items max, no dropdowns, no sub-menus. */
export const NAV_ITEMS = [
  { label: "Home", href: "/", zone: "neutral" },
  { label: "Work", href: "/work", zone: "indigo" },
  { label: "Studio", href: "/studio", zone: "amber" },
  { label: "Process", href: "/process", zone: "indigo" },
  { label: "Contact", href: "/contact", zone: "amber" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
