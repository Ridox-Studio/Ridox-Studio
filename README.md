<div align="center">

<img src="public/logos/ridox-studio-logo.svg" alt="Ridox Studio" width="110" />

# Ridox Studio

**Software systems engineered at the reaction point.**

Every system is a balance of opposing forces — frontend and backend, chaos and
structure, speed and stability, design and engineering. We build where they meet.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-087EA4?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[Website](https://ridoxstudio.com) · [Work](https://ridoxstudio.com/work) · [Studio](https://ridoxstudio.com/studio) · [Contact](https://ridoxstudio.com/contact)

</div>

---

## The name

Ridox is named after **redox reactions** — reduction and oxidation, two opposing
chemical forces that cannot exist without each other. Neither is the whole
reaction; the energy is in the exchange.

The mark is that idea drawn: two polygon blocks, amber and indigo, split by a
sharp diagonal cut. The entire site, this README included, derives its colour
from those two values and nothing else.

| | Token | Role |
|---|---|---|
| 🟠 | `hsl(33, 95%, 52%)` | **Oxidation** — action, warmth, the energy side |
| 🟣 | `hsl(258, 89%, 62%)` | **Reduction** — stability, depth, the structure side |

## What we build

| | Capability | |
|---|---|---|
| **01** | **Web applications & platforms** | Product surfaces that stay fast as they grow — rendered on the server, typed end to end, instrumented from day one. |
| **02** | **Mobile systems** | Built for the conditions users actually have: patchy signal, old devices, a thumb instead of a cursor. |
| **03** | **Cloud infrastructure & DevOps** | Infrastructure you can read. Declared in code, reproducible per environment, boring in the ways it should be. |
| **04** | **AI & data systems** | Model-backed features with the unglamorous parts handled: evaluation, guardrails, cost control, a fallback when it fails. |
| **05** | **Technical consulting** | Sometimes the deliverable is a decision. We audit, map the tradeoffs, and hand your team a plan they can execute without us. |

## How we work

**01 · Discovery & reaction analysis** — Interviews, code reading, data tracing.
We map what exists, where it strains, and which constraints are real versus
inherited. You get the written analysis whether or not we build anything together.

**02 · Architecture & system design** — The system design, data model and
integration boundaries as reviewable documents. Nothing gets built from an
assumption nobody wrote down.

**03 · Engineering & iteration** — A live preview environment from week one and a
demo every fortnight. Tests, CI and observability are part of done, not a
hardening phase promised for later.

**04 · Launch & equilibrium** — Runbooks, architecture walkthroughs and paired
on-call until your engineers are comfortable. The engagement ends when the system
is stable in your hands.

---

<div align="center">

## This repository

**The source of [ridoxstudio.com](https://ridoxstudio.com).**

</div>

Built to a written specification — [`NEW_WEBSITE.md`](NEW_WEBSITE.md) is the
single source of truth for the brand system, motion architecture and layout
rules. Read it before changing anything visual.

### Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server components, streaming, file routing |
| Language | TypeScript 5 | Typed end to end |
| Styling | Tailwind CSS 4 | CSS-first `@theme`, tokens bound to the logo's HSL values |
| Animation | Framer Motion | Scroll transforms, layout transitions, the door system |
| Scrolling | Lenis | Inertia scrolling, disabled under reduced motion |
| Icons | Lucide | Consistent stroke set |

No UI component library, no WebGL, no GSAP — everything is custom and 2D by
deliberate constraint.

### Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build
npm start            # serve the production build
npm run lint         # eslint
npx tsc --noEmit     # typecheck
```

### Structure

```
app/
├── layout.tsx            # Fonts, metadata, JSON-LD, the persistent shell
├── page.tsx              # Homepage — the curated scroll experience
├── globals.css           # Design tokens, Tailwind theme, type scale
├── work/ studio/         # Case studies and products, with [slug] deep dives
├── process/ contact/     # Methodology and enquiry
├── components/
│   ├── transitions/      # The Redox Door — the site's signature interaction
│   ├── preloader/        # First-load reveal, shares the door choreography
│   ├── navigation/       # Floating trigger + full-screen diagonal menu
│   ├── projects/         # Sticky deck, gallery, cards, deep dives
│   ├── services/         # Pinned horizontal track / touch carousel
│   └── shared/           # Magnetic buttons, reveals, section furniture
├── data/                 # Projects, services, process copy
├── hooks/                # Motion preferences, media queries, pointer, Lenis
└── lib/                  # Easing curves, door variants, site config, OG rendering
```

### Conventions

These are enforced by review, not tooling — see §4 of the spec.

- **No margins.** Spacing is the parent's job: `gap` between siblings, symmetrical
  padding for wall distance. Negative margins need an inline comment justifying them.
- **Animate `transform` and `opacity` only.** Never `width`, `height`, `top`, `left`.
- **Every animation gates on `useReducedMotion()`** and falls back to a plain fade.
  Motion is a three-state preference — `auto` / `full` / `minimal` — with a visible
  control in the footer. Nothing may disable the site with no way back.
- **SEO-critical text is server-rendered.** Animation wrappers may surround it; they
  may not be the only thing that renders it.
- **Touch is designed, not degraded.** Cursor-dependent effects need a touch
  equivalent or clean removal, and tap targets are 44px minimum.

### Contributing

Fork, branch, and open a pull request against `main`. Run the typecheck and lint
before pushing:

```bash
npx tsc --noEmit && npm run lint
```

---

<div align="center">

**Start a reaction.**

[hello@ridoxstudio.com](mailto:hello@ridoxstudio.com)

<sub>© Ridox Studio</sub>

</div>
