export interface Project {
  slug: string;
  category: "client" | "studio";
  title: string;
  subtitle: string; // one-line result or product tagline
  description: string; // 2-3 sentences
  coverImage: string; // path to screenshot/visual
  techStack: string[];
  status?: "live" | "beta" | "open-source" | "archived";
  externalUrl?: string;
  year: number;
  /** Shown on the deep-dive page only. */
  highlights?: { label: string; value: string }[];
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: "meridian-logistics-platform",
    category: "client",
    title: "Meridian",
    subtitle: "Cut dispatch turnaround from 40 minutes to under 3",
    description:
      "A freight dispatch and fleet-tracking platform replacing a spreadsheet workflow across 12 depots. We rebuilt routing as an event-driven service, added live vehicle telemetry, and shipped an offline-capable driver app.",
    coverImage: "/projects/meridian.svg",
    techStack: ["Next.js", "NestJS", "PostgreSQL", "Redis", "AWS"],
    status: "live",
    year: 2025,
    featured: true,
    highlights: [
      { label: "Dispatch time", value: "-92%" },
      { label: "Depots live", value: "12" },
      { label: "Uptime", value: "99.97%" },
    ],
  },
  {
    slug: "halcyon-health-portal",
    category: "client",
    title: "Halcyon Health",
    subtitle: "HIPAA-compliant patient portal serving 80k monthly sessions",
    description:
      "A patient records and scheduling portal built for a multi-clinic provider group. Audit logging, role-scoped access, and encrypted document exchange were designed in from the first commit rather than bolted on.",
    coverImage: "/projects/halcyon.svg",
    techStack: ["Next.js", "Laravel", "PostgreSQL", "Terraform"],
    status: "live",
    year: 2025,
    featured: true,
    highlights: [
      { label: "Monthly sessions", value: "80k" },
      { label: "Audit coverage", value: "100%" },
      { label: "LCP", value: "1.1s" },
    ],
  },
  {
    slug: "kestrel-trading-desk",
    category: "client",
    title: "Kestrel",
    subtitle: "Real-time trading desk rendering 200k ticks per minute",
    description:
      "A browser trading terminal with streaming order books and sub-frame chart updates. We moved serialization to binary protocols and pushed rendering onto a canvas layer to hold 60fps under peak load.",
    coverImage: "/projects/kestrel.svg",
    techStack: ["React", "Go", "WebSockets", "ClickHouse"],
    status: "live",
    year: 2024,
    featured: true,
    highlights: [
      { label: "Ticks / minute", value: "200k" },
      { label: "Frame budget", value: "16ms" },
      { label: "Payload size", value: "-71%" },
    ],
  },
  {
    slug: "orbit-commerce",
    category: "client",
    title: "Orbit Commerce",
    subtitle: "Headless storefront rebuild that doubled conversion",
    description:
      "A monolithic storefront split into a headless architecture with edge-rendered catalogue pages. Checkout was rewritten as an isolated service so pricing experiments could ship without touching the core.",
    coverImage: "/projects/orbit.svg",
    techStack: ["Next.js", "Stripe", "GraphQL", "Vercel"],
    status: "live",
    year: 2024,
    highlights: [
      { label: "Conversion", value: "+104%" },
      { label: "TTFB", value: "84ms" },
    ],
  },
  {
    slug: "atlas-field-ops",
    category: "client",
    title: "Atlas Field Ops",
    subtitle: "Offline-first mobile system for crews with no signal",
    description:
      "A field inspection app for infrastructure crews working beyond network coverage. Local-first sync with conflict resolution means a full day of work uploads cleanly the moment a device reconnects.",
    coverImage: "/projects/atlas.svg",
    techStack: ["React Native", "SQLite", "Node.js", "GCP"],
    status: "live",
    year: 2023,
    highlights: [
      { label: "Offline duration", value: "14 days" },
      { label: "Sync conflicts", value: "<0.1%" },
    ],
  },
  {
    slug: "reagent",
    category: "studio",
    title: "Reagent",
    subtitle: "Schema-first API scaffolding for teams that hate boilerplate",
    description:
      "An internal tool we open-sourced: point it at a database schema and it generates typed clients, migration guards, and contract tests. Built because we were writing the same 400 lines on every engagement.",
    coverImage: "/projects/reagent.svg",
    techStack: ["TypeScript", "Postgres", "OpenAPI"],
    status: "open-source",
    externalUrl: "https://github.com/ridox-studio",
    year: 2025,
    featured: true,
    highlights: [
      { label: "Boilerplate saved", value: "~400 LOC" },
      { label: "License", value: "MIT" },
    ],
  },
  {
    slug: "catalyst-observability",
    category: "studio",
    title: "Catalyst",
    subtitle: "Deployment observability that reads like a story, not a dashboard",
    description:
      "A release-timeline tool that correlates deploys with error-rate and latency shifts, then writes a plain-language summary of what changed. Currently in private beta with three of our client teams.",
    coverImage: "/projects/catalyst.svg",
    techStack: ["Next.js", "Go", "ClickHouse", "OpenTelemetry"],
    status: "beta",
    year: 2025,
    featured: true,
    highlights: [
      { label: "Beta teams", value: "3" },
      { label: "Mean detection", value: "42s" },
    ],
  },
  {
    slug: "valence-design-tokens",
    category: "studio",
    title: "Valence",
    subtitle: "A token pipeline that keeps design and code in one language",
    description:
      "A build step that compiles a single token source into CSS variables, Tailwind theme values, and native platform constants. It is the system that keeps this very site's colour scale locked to the logo.",
    coverImage: "/projects/valence.svg",
    techStack: ["TypeScript", "Tailwind", "Style Dictionary"],
    status: "open-source",
    externalUrl: "https://github.com/ridox-studio",
    year: 2024,
  },
];

export function getAllProjects(): Project[] {
  return PROJECTS;
}

export function getProjectsByCategory(category: Project["category"]): Project[] {
  return PROJECTS.filter((project) => project.category === category);
}

export function getFeatured(category: Project["category"], limit: number): Project[] {
  return getProjectsByCategory(category)
    .filter((project) => project.featured)
    .slice(0, limit);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
