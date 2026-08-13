export const SITE = {
  name: "Ridox Studio",
  url: "https://ridoxstudio.com",
  tagline: "Software systems engineered at the reaction point",
  description:
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
