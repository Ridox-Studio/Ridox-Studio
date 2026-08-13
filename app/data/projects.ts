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
  /** Anyone who worked on this besides us. Credit is cheap; taking it is not. */
  credits?: string;
  /**
   * What the thing actually does, specifically. With no metrics to point at,
   * specificity is the proof — "AI rescheduling" is a claim anyone can type;
   * describing the exact behaviour is something only the builder can write.
   * Every entry here must be true of the shipped code.
   */
  features?: { title: string; detail: string }[];
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
      "Cilbup — \"public\" reversed — lets anyone send a creator an anonymous message, and optionally attach a tip to get priority attention. Tips settle in USD so earnings hold their value in markets where the local currency does not, while a fan pays however suits them — crypto or fiat. Creators get a dashboard for messages, earnings and analytics, and it installs as a PWA, so the people it is built for get an app without an app store.",
    coverImage: "/projects/cilbup.png",
    techStack: ["Next.js", "React 19", "TypeScript", "PWA", "Prisma", "MongoDB", "Redis", "Chainrails"],
    status: "live",
    externalUrl: "https://www.cilbup.site",
    year: 2026,
    featured: true,
    highlights: [
      { label: "Settles in", value: "USD" },
      { label: "Fans pay with", value: "Crypto or fiat" },
      { label: "In development since", value: "2022" },
    ],
    credits: "Designed in collaboration with an external product designer.",
    features: [
      {
        title: "Anonymous by construction",
        detail:
          "Senders are never named. A creator sees a short reference like #21e5, so there is no identity to leak, subpoena or accidentally render.",
      },
      {
        title: "Tips buy attention, not access",
        detail:
          "Anyone can message for free. Attaching a tip moves a message up the creator's queue — the incentive is priority, not a paywall.",
      },
      {
        title: "Paid in whatever, earned in USD",
        detail:
          "A fan tips with crypto or fiat, whichever they have. It lands as USD, because a creator in a market with an unstable currency should not watch last month's tips lose value while they wait to withdraw.",
      },
      {
        title: "The processor is a detail, not a dependency",
        detail:
          "Providers sit behind one interface, so the default moved from Paystack to Chainrails without the tipping flow noticing. The next switch will be the same.",
      },
      {
        title: "Messages are shareable assets",
        detail:
          "Any message can be exported as a card to post elsewhere. The best messages become the creator's own marketing, which is where new senders come from.",
      },
      {
        title: "Mood, at a glance",
        detail:
          "The dashboard scores incoming messages positive, negative or neutral, so a creator can gauge the tone of an inbox before opening it.",
      },
      {
        title: "An app without an app store",
        detail:
          "It installs as a PWA and reaches creators over email, WhatsApp and browser push — built for phones on Nigerian data, not for a download funnel.",
      },
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
    features: [
      {
        title: "Four surfaces, four audiences",
        detail:
          "Platform admin, institution staff, student and guardian each get their own layout and navigation. No screen tries to serve two people at once.",
      },
      {
        title: "Every school is its own front door",
        detail:
          "Institution routes bind to a slug and log in through that school's own branded page. There is no generic dashboard a parent could land on by accident.",
      },
      {
        title: "Money is an append-only ledger",
        detail:
          "Multi-currency wallets are recorded as entries that are never edited or deleted. Balances are derived, so a fee dispute can be traced rather than argued.",
      },
      {
        title: "Guardians see every ward at once",
        detail:
          "One login covers children across different institutions — monitoring and paying fees without a separate account per school.",
      },
    ],
  },
  {
    slug: "resurgee",
    category: "studio",
    title: "Resurgee",
    subtitle: "An AI layer over the task manager you already use",
    description:
      "Resurgee augments Google Tasks and Calendar rather than replacing them. It watches for tasks about to slip, suggests rescheduling options when they do, and plans your day through a conversational assistant — across multiple linked Google accounts.",
    coverImage: "/projects/resurgee.png",
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
    features: [
      {
        title: "It asks before it nags",
        detail:
          "Ahead of a scheduled task it checks in — are you still doing this? A reminder fires into the void; this expects an answer.",
      },
      {
        title: "Rescheduling that knows your day",
        detail:
          "Say no and it proposes slots drawn from your real calendar, the patterns it has learned from you, and the weather where you are. Not the next free hour — a time that will actually work.",
      },
      {
        title: "It decides if you do not",
        detail:
          "One suggestion is pre-selected and applied on a countdown. Miss the prompt and the task still moves, because a missed task quietly staying missed is the failure mode this exists to fix.",
      },
      {
        title: "Every account in one place",
        detail:
          "Work, school and personal Google accounts link together, so planning happens across your whole life rather than one calendar at a time.",
      },
      {
        title: "Augments, never replaces",
        detail:
          "Everything writes back to Google Tasks. Stop using Resurgee tomorrow and your tasks are exactly where you left them.",
      },
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
    coverImage: "/projects/netcart.png",
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
    features: [
      {
        title: "The home screen ships from the server",
        detail:
          "Banners, categories and featured stores are described by the backend and rendered by the app, so merchandising changes go live without an App Store review.",
      },
      {
        title: "Invoices and receipts generate themselves",
        detail:
          "The API renders them as both PDF and image, so the same document works as a download, an email attachment and a WhatsApp share.",
      },
      {
        title: "Nothing is load-bearing",
        detail:
          "Email, file storage and payments each sit behind adapters — switch Cloudinary for Firebase, or one processor for another, without touching business logic.",
      },
      {
        title: "A separate surface for the people delivering",
        detail:
          "Shoppers get their own flow — available, claimed, active, history — with an online toggle, rather than a customer app with extra buttons bolted on.",
      },
      {
        title: "Operations, not just a dashboard",
        detail:
          "The portal covers fleet management, order escalations, fraud controls and analytics: what running the business needs, not just what looks good in a demo.",
      },
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
    coverImage: "/projects/cy-academy.png",
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
    coverImage: "/projects/cy-udida-portfolio.png",
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
