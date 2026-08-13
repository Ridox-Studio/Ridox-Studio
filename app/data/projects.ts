export interface Project {
  slug: string;
  /**
   * `client`     — commissioned build.
   * `consulting` — advisory: architecture, integration, direction. No build.
   * `studio`     — our own product.
   */
  category: "client" | "consulting" | "studio";
  title: string;
  subtitle: string; // one-line result or product tagline
  description: string; // 2-3 sentences
  /**
   * Path to the screenshot/visual. Rendered with `object-cover` into panes
   * whose aspect ratio varies with the viewport, so the crop is not
   * predictable — keep anything that must stay legible near the centre.
   */
  coverImage: string;
  techStack: string[];
  status?: "live" | "beta" | "in-development" | "open-source" | "archived";
  externalUrl?: string;
  year: number;
  /** Shown on the deep-dive page only. Facts we can stand behind, not metrics. */
  highlights?: { label: string; value: string }[];
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  // ---------------------------------------------------------------- studio
  {
    slug: "cilbup",
    category: "studio",
    title: "Cilbup",
    subtitle: "Anonymous messaging and tipping for creators",
    description:
      "Cilbup — \"public\" reversed — lets anyone send a creator an anonymous message, and optionally attach a tip to get priority attention. Tips settle in four currencies through swappable payment providers, and creators get a dashboard for messages, earnings and analytics with delivery over email, WhatsApp and browser push.",
    coverImage: "/projects/cilbup.svg",
    techStack: ["Next.js", "React 19", "TypeScript", "Prisma", "MongoDB", "Redis", "Chainrails"],
    status: "live",
    externalUrl: "https://www.cilbup.site",
    year: 2026,
    featured: true,
    highlights: [
      { label: "Currencies", value: "NGN · USD · GBP · EUR" },
      { label: "Payment providers", value: "Pluggable" },
      { label: "In development since", value: "2022" },
    ],
  },
  {
    slug: "risms",
    category: "studio",
    title: "RISMS",
    subtitle: "Multi-tenant school management built for African institutions",
    description:
      "A school management system covering academics, staff, students, timetabling, fees and multi-currency wallets. It segregates into four distinct persona surfaces — system admin, institution staff, student portal and guardian — so no screen tries to serve two audiences at once.",
    coverImage: "/projects/risms.svg",
    techStack: ["Laravel 11", "PHP 8.3", "Vue 3", "Inertia v2", "Tailwind 4", "Paystack"],
    status: "in-development",
    year: 2026,
    featured: true,
    highlights: [
      { label: "Persona surfaces", value: "4" },
      { label: "Architecture", value: "Multi-tenant" },
      { label: "Wallet ledger", value: "Append-only" },
    ],
  },
  {
    slug: "resurgee",
    category: "studio",
    title: "Resurgee",
    subtitle: "An AI layer over the task manager you already use",
    description:
      "Resurgee augments Google Tasks and Calendar rather than replacing them. It watches for tasks about to slip, suggests rescheduling options when they do, and plans your day through a conversational assistant — across multiple linked Google accounts.",
    coverImage: "/projects/resurgee.svg",
    techStack: ["Next.js", "FastAPI", "Python 3.12", "PostgreSQL", "Celery", "Redis", "Flutter"],
    status: "in-development",
    externalUrl: "https://www.resurgee.xyz",
    year: 2026,
    featured: true,
    highlights: [
      { label: "Surfaces", value: "Web · Mobile · API" },
      { label: "Integrations", value: "Google Tasks & Calendar" },
      { label: "Started", value: "2025" },
    ],
  },

  // ---------------------------------------------------------------- client
  {
    slug: "netcart",
    category: "client",
    title: "Netcart",
    subtitle: "One marketplace system across three surfaces",
    description:
      "A marketplace and delivery platform built end to end: a Flutter app for customers, an operations portal for fleet, escalations, analytics and fraud controls, and the API underneath both — auth, catalogue, cart, orders, payments, withdrawals and earnings. Email, storage and payment providers sit behind adapters, so none of them is load-bearing.",
    coverImage: "/projects/netcart.svg",
    techStack: [
      "Flutter",
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Express 5",
      "Prisma",
      "MongoDB",
      "Paystack",
    ],
    status: "in-development",
    year: 2026,
    featured: true,
    highlights: [
      { label: "Surfaces", value: "App · Portal · API" },
      { label: "Provider adapters", value: "Email · Storage · Payments" },
      { label: "API contract", value: "OpenAPI" },
    ],
  },

  // ------------------------------------------------------------ consulting
  {
    slug: "cy-academy",
    category: "consulting",
    title: "CY Academy",
    subtitle: "Technical direction for an AI-built course platform",
    description:
      "The client built the platform themselves with AI assistance. We advised on how to structure and set up the project, connected a working transactional email service, and walked them through the course upload workflow and the operational pieces that AI-generated scaffolding leaves out.",
    coverImage: "/projects/cy-academy.svg",
    techStack: ["Architecture review", "Email deliverability", "Content workflow"],
    status: "live",
    externalUrl: "https://cyacademy.xyz",
    year: 2026,
    highlights: [
      { label: "Engagement", value: "Advisory" },
      { label: "Built by", value: "The client" },
    ],
  },
  {
    slug: "cy-udida-portfolio",
    category: "consulting",
    title: "CY Udida",
    subtitle: "Portfolio site review and setup direction",
    description:
      "A personal portfolio for the same client. We reviewed the build and gave direction on setup and deployment — a small engagement, included because not every useful piece of work is a six-month contract.",
    coverImage: "/projects/cy-udida-portfolio.svg",
    techStack: ["Review", "Deployment"],
    status: "live",
    externalUrl: "https://cyudida.com",
    year: 2026,
    highlights: [{ label: "Engagement", value: "Advisory" }],
  },
];

export function getAllProjects(): Project[] {
  return PROJECTS;
}

export function getProjectsByCategory(category: Project["category"]): Project[] {
  return PROJECTS.filter((project) => project.category === category);
}

/** Everything shown under /work — commissioned builds and advisory engagements. */
export function getWorkProjects(): Project[] {
  return PROJECTS.filter(
    (project) => project.category === "client" || project.category === "consulting",
  );
}

export function getFeatured(projects: Project[], limit: number): Project[] {
  return projects.filter((project) => project.featured).slice(0, limit);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

/** Which route a project's deep dive lives on. */
export function getProjectHref(project: Project): string {
  return project.category === "studio"
    ? `/studio/${project.slug}`
    : `/work/${project.slug}`;
}
