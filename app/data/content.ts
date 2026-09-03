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
    title: "Discovery",
    summary:
      "We start by understanding where you are and what you are trying to reach.",
    detail:
      "Whether you have a live product, a prototype, or just an idea written down, the first work is the same: we map the goal, the users, the constraints, and the current state — through interviews and a read of whatever already exists. You leave with a written analysis and a recommended path, whether or not we build it together.",
    accent: "amber",
  },
  {
    index: "02",
    title: "Architecture & Planning",
    summary: "The plan, written down — with the trade-off behind every decision.",
    detail:
      "System design, data model, scope, and milestones as reviewable documents. You approve the shape and the sequence before engineering starts, and the decision records travel with the codebase so nothing is built from an assumption nobody wrote down.",
    accent: "indigo",
  },
  {
    index: "03",
    title: "Build & Iterate",
    summary: "Two-week iterations, with a working preview from the first week.",
    detail:
      "You get a live preview environment early and a demo every two weeks. Tests, CI, and monitoring are part of the definition of done, not a hardening phase promised for later. We release to production when a milestone is genuinely ready — the two weeks are a rhythm for feedback, not a countdown to launch.",
    accent: "amber",
  },
  {
    index: "04",
    title: "Launch & Handover",
    summary: "We hand over a system your team can run without us.",
    detail:
      "Runbooks, architecture walkthroughs, and paired on-call until your engineers are comfortable operating it. The engagement ends when the system is stable in your hands — that is the equilibrium we are aiming for.",
    accent: "indigo",
  },
];

/** Section 7.2 — marquee strips placed between major sections. */
export const MARQUEE_LINES = {
  first: ["RIDOX STUDIO", "SOFTWARE SYSTEMS", "REDOX DUALITY"],
  second: ["ENGINEERING", "DESIGN", "ARCHITECTURE", "TRANSFORMATION"],
} as const;
