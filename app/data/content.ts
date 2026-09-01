export type Accent = "amber" | "indigo";

export interface Service {
  index: string;
  title: string;
  summary: string;
  capabilities: string[];
  accent: Accent;
}

/** Section 8.1 — the horizontal-scroll capability panels. */
export const SERVICES: Service[] = [
  {
    index: "01",
    title: "Web Applications & Platforms",
    summary:
      "Product surfaces that stay fast as they grow — rendered on the server, typed end to end, and instrumented from day one.",
    capabilities: [
      "Next.js & React architecture",
      "Design systems and component libraries",
      "Performance and Core Web Vitals work",
      "Legacy platform migration",
    ],
    accent: "amber",
  },
  {
    index: "02",
    title: "Mobile Systems",
    summary:
      "Apps built for the conditions your users actually have: patchy signal, old devices, and a thumb instead of a cursor.",
    capabilities: [
      "React Native & native modules",
      "Offline-first sync and conflict resolution",
      "App Store and Play release pipelines",
      "Push, deep links, and lifecycle plumbing",
    ],
    accent: "indigo",
  },
  {
    index: "03",
    title: "Cloud Infrastructure & DevOps",
    summary:
      "Infrastructure you can read. Declared in code, reproducible per environment, and boring in exactly the ways it should be.",
    capabilities: [
      "Terraform and infrastructure as code",
      "CI/CD pipelines and preview environments",
      "Observability, alerting, and on-call design",
      "Cost and capacity review",
    ],
    accent: "amber",
  },
  {
    index: "04",
    title: "AI & Data Systems",
    summary:
      "Model-backed features with the unglamorous parts handled: evaluation, guardrails, cost control, and a fallback when it fails.",
    capabilities: [
      "Retrieval pipelines and vector search",
      "LLM feature design and evaluation harnesses",
      "Data warehousing and analytics",
      "Streaming and event-driven pipelines",
    ],
    accent: "indigo",
  },
  {
    index: "05",
    title: "Technical Consulting",
    summary:
      "Sometimes the deliverable is a decision. We audit, map the tradeoffs, and hand your team a plan they can execute without us.",
    capabilities: [
      "Architecture and codebase audits",
      "Technical due diligence",
      "Team structure and delivery process",
      "Fractional technical leadership",
    ],
    accent: "amber",
  },
  {
    index: "06",
    title: "Technical Enablement & Coaching",
    summary:
      "AI will get you most of the way to a working product. We do the part that breaks in production — and leave your team able to do it themselves next time.",
    capabilities: [
      "Getting AI-built projects production-ready",
      "Email deliverability, domains and DNS",
      "Deployment, environments and CI setup",
      "Pair sessions and code review for founders and small teams",
    ],
    accent: "indigo",
  },
];

export interface ProcessStep {
  index: string;
  title: string;
  summary: string;
  detail: string;
  accent: Accent;
}

/** Section 8.1 — the four workflow steps. */
export const PROCESS_STEPS: ProcessStep[] = [
  {
    index: "01",
    title: "Discovery & Reaction Analysis",
    summary: "We find the forces already acting on your system before proposing anything.",
    detail:
      "Two weeks of interviews, code reading, and data tracing. We map what exists, where it strains, and which constraints are real versus inherited. You get a written analysis whether or not we build anything together.",
    accent: "amber",
  },
  {
    index: "02",
    title: "Architecture & System Design",
    summary: "Every decision written down, with the tradeoff that produced it.",
    detail:
      "We produce the system design, data model, and integration boundaries as reviewable documents. Nothing gets built from an assumption nobody wrote down — architecture decision records travel with the codebase.",
    accent: "indigo",
  },
  {
    index: "03",
    title: "Engineering & Iteration",
    summary: "Shipping in two-week reactions, with a working environment throughout.",
    detail:
      "You get a live preview environment from the first week and a demo every fortnight. Tests, CI, and observability are part of the definition of done, not a hardening phase we promise for later.",
    accent: "amber",
  },
  {
    index: "04",
    title: "Launch & Equilibrium",
    summary: "We hand over a system your team can hold without us.",
    detail:
      "Runbooks, architecture walkthroughs, and paired on-call rotations until your engineers are comfortable. The engagement ends when the system is stable in your hands — that is the equilibrium we are aiming for.",
    accent: "indigo",
  },
];

/** Section 7.2 — marquee strips placed between major sections. */
export const MARQUEE_LINES = {
  first: ["RIDOX STUDIO", "SOFTWARE SYSTEMS", "REDOX DUALITY"],
  second: ["ENGINEERING", "DESIGN", "ARCHITECTURE", "TRANSFORMATION"],
} as const;
