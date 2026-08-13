# Ridox Studio — Website Architecture & Motion Specification

> **This is the single source of truth for any developer or AI agent building the Ridox Studio website.**
> Read this entire document before writing a single line of code.

---

## 0. What This Site Is NOT

Before anything else, understand what we are **not** building:

- ❌ A standard hero → services → testimonials → footer template
- ❌ A navbar with logo-left, links-center, CTA-right
- ❌ Fade-in cards on scroll
- ❌ A "dark mode portfolio" with generic gradients
- ❌ Any layout that looks like it came from a Framer/Webflow template gallery

This site is an **experience**. Every scroll pixel, every hover, every transition must feel intentional and crafted. If a section looks like something you've seen on 50 other agency sites, delete it and rethink.

---

## 1. Brand Foundation

### 1.1 The Name: Ridox

Named after **Redox Reactions** (Reduction + Oxidation) — two opposing chemical forces that cannot exist without each other. Combined with **Japanese duality philosophy** (a drop of one energy always lives inside the other).

**For a software agency, this means:** Every system is a balance of opposing forces — frontend & backend, chaos & structure, speed & stability, design & engineering. Ridox Studio exists at the reaction point where these dualities transform into energy.

### 1.2 The Logo: Variant 7 — Monolith Cutout Slash

Two geometric polygon blocks (Amber left, Indigo right) split by a sharp diagonal negative-space slash. Each block contains a **seed dot** of the opposing color — Indigo seed inside Amber, Amber seed inside Indigo. This is the visual embodiment of the Redox duality.

**The logo SVG files live at:** `public/logos/ridox/variant7*.svg`

---

## 2. Color System (Locked to Logo HSL Values)

Every color in the entire site derives from the two HSL values used in the Variant 7 logo SVGs. No freelancing colors.

### 2.1 Primary Brand Colors (from logo source)

| Token | HSL (Source of Truth) | Hex Equivalent | Role |
|---|---|---|---|
| `--amber` | `hsl(33, 95%, 52%)` | `#f59e0b` | Oxidation energy — action, warmth, frontend, CTAs |
| `--indigo` | `hsl(258, 89%, 62%)` | `#7c3aed` | Reduction depth — stability, backend, structure |

### 2.2 Full Shade Scale

Derived by adjusting the lightness channel of each primary HSL. These are the ONLY shades allowed:

```css
:root {
  /* === AMBER SCALE (Oxidation Energy) === */
  --amber-50:  hsl(33, 95%, 95%);   /* Tinted backgrounds */
  --amber-100: hsl(33, 95%, 88%);
  --amber-200: hsl(33, 95%, 76%);
  --amber-300: hsl(33, 95%, 64%);
  --amber-400: hsl(33, 95%, 52%);   /* ← PRIMARY (logo value) */
  --amber-500: hsl(33, 95%, 44%);   /* Hover/pressed state */
  --amber-600: hsl(33, 95%, 36%);   /* Dark accent */
  --amber-glow: hsla(33, 95%, 52%, 0.25);  /* Box shadows, glows */
  --amber-ghost: hsla(33, 95%, 52%, 0.08); /* Ghost backgrounds */

  /* === INDIGO SCALE (Reduction Depth) === */
  --indigo-50:  hsl(258, 89%, 95%);
  --indigo-100: hsl(258, 89%, 85%);
  --indigo-200: hsl(258, 89%, 74%);
  --indigo-300: hsl(258, 89%, 62%);  /* ← PRIMARY (logo value) */
  --indigo-400: hsl(258, 89%, 52%);  /* Hover/pressed state */
  --indigo-500: hsl(258, 89%, 42%);
  --indigo-600: hsl(258, 89%, 30%);  /* Deep accent */
  --indigo-glow: hsla(258, 89%, 62%, 0.25);
  --indigo-ghost: hsla(258, 89%, 62%, 0.08);

  /* === SURFACES (Dark to Light hierarchy) === */
  --bg-void:     hsl(258, 40%, 4%);   /* #080612 — deepest background, preloader */
  --bg-deep:     hsl(258, 35%, 7%);   /* #0d0b1a — primary page background */
  --bg-card:     hsl(258, 30%, 10%);  /* #141029 — card surfaces */
  --bg-elevated: hsl(258, 25%, 14%);  /* Hover-state card, modals */
  --bg-surface:  hsl(258, 20%, 18%);  /* Highest elevation surfaces */

  /* === TEXT === */
  --text-primary:  hsl(258, 60%, 96%);  /* #f0eeff — headings, primary body */
  --text-secondary: hsl(258, 30%, 68%); /* #9b90c2 — descriptions, meta */
  --text-tertiary: hsl(258, 20%, 45%);  /* Disabled, timestamps */

  /* === BORDERS === */
  --border-subtle:  hsla(258, 40%, 25%, 0.5);  /* Default card borders */
  --border-visible: hsla(258, 40%, 35%, 0.7);  /* Hover/focus borders */

  /* === SEMANTIC === */
  --success: hsl(152, 70%, 48%);
  --error:   hsl(0, 80%, 58%);
  --warning: var(--amber-400);

  /* === GRADIENTS === */
  --gradient-brand: linear-gradient(135deg, var(--amber-400), var(--indigo-300));
  --gradient-amber-fade: linear-gradient(180deg, var(--amber-ghost), transparent);
  --gradient-indigo-fade: linear-gradient(180deg, var(--indigo-ghost), transparent);
  --gradient-slash: linear-gradient(135deg, var(--amber-400) 0%, var(--amber-400) 48%, transparent 48%, transparent 52%, var(--indigo-300) 52%, var(--indigo-300) 100%);
}
```

### 2.3 Tailwind Config Extension

```js
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        amber: {
          50:  'var(--amber-50)',
          100: 'var(--amber-100)',
          200: 'var(--amber-200)',
          300: 'var(--amber-300)',
          400: 'var(--amber-400)',  // DEFAULT — use text-amber-400
          500: 'var(--amber-500)',
          600: 'var(--amber-600)',
          glow: 'var(--amber-glow)',
          ghost: 'var(--amber-ghost)',
        },
        indigo: {
          50:  'var(--indigo-50)',
          100: 'var(--indigo-100)',
          200: 'var(--indigo-200)',
          300: 'var(--indigo-300)',  // DEFAULT — use text-indigo-300
          400: 'var(--indigo-400)',
          500: 'var(--indigo-500)',
          600: 'var(--indigo-600)',
          glow: 'var(--indigo-glow)',
          ghost: 'var(--indigo-ghost)',
        },
        surface: {
          void:     'var(--bg-void)',
          deep:     'var(--bg-deep)',
          card:     'var(--bg-card)',
          elevated: 'var(--bg-elevated)',
          surface:  'var(--bg-surface)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
    },
  },
};
```

### 2.4 Color Usage Rules

1. **Primary amber (`--amber-400`)** is reserved for: CTAs, active states, the "energy" side of any duality pairing, hover accents.
2. **Primary indigo (`--indigo-300`)** is reserved for: Structural elements, links, selected states, the "depth" side of any duality pairing.
3. **Never use raw white (`#fff`) for text.** Always use `--text-primary` which has a faint indigo tint.
4. **Never use raw black (`#000`) for backgrounds.** Always use the `--bg-*` scale which carries the brand's deep indigo undertone.
5. **Gradients always flow Amber → Indigo** (warm to cool, energy to depth), matching the logo's left-to-right energy flow.

---

## 3. Typography

### 3.1 Font Stack

| Role | Font | Weight Range | Usage |
|---|---|---|---|
| Display / Headings | **Archivo** (Google Fonts, variable `wght` + `wdth`) | 700–900 at `wdth` 110–125 | All headings, hero text, section titles |
| Body | **Inter** (Google Fonts, variable) | 400–600 | Paragraphs, descriptions, UI labels |
| Accent / Tags / Status | **Bitcount Prop Single** (Google Fonts) | 400–500 | Tech stack pills, overlines, status labels, preloader text |

Archivo is set at its widest (`font-variation-settings: "wdth" 125`) with short leading for headings — the wide, heavy, tight-set masthead voice. Bitcount Prop Single is the accent voice only; it never carries headings or body copy.

### 3.2 Type Scale

| Element | Size (Desktop) | Size (Mobile) | Weight | Letter Spacing |
|---|---|---|---|---|
| Hero Display | `clamp(3.5rem, 8vw, 7rem)` | fluid | 900 | `-0.03em` |
| Section Title | `clamp(2rem, 4vw, 3.5rem)` | fluid | 800 | `-0.025em` |
| Card Title | `1.5rem` | `1.25rem` | 700 | `-0.01em` |
| Body | `1rem` | `0.9375rem` | 400 | `0` |
| Caption / Meta | `0.8125rem` | `0.75rem` | 500 | `0.02em` |
| Overline / Label | `0.6875rem` | `0.625rem` | 700 | `0.15em` uppercase |

---

## 4. Layout Rules (Mandatory — No Exceptions)

### 4.1 Box-Model Discipline

Every element is a box. Parents contain children. Spacing is controlled exclusively by the parent.

#### Rule 1: NO MARGINS

```jsx
// ❌ NEVER
<div className="mb-4 mt-2 ml-6">Content</div>

// ✅ ALWAYS — parent controls spacing via gap
<div className="flex flex-col gap-4">
  <div>Content 1</div>
  <div>Content 2</div>
</div>
```

**The only tolerated exception:** `scroll-margin-top` for anchor navigation targets, and negative margins for intentional bleed/overlap layouts that are explicitly designed (documented inline with a comment explaining why).

#### Rule 2: Gap for All Sibling Spacing

```jsx
// Vertical stacking
<div className="flex flex-col gap-6">{children}</div>

// Horizontal row
<div className="flex flex-row gap-4">{children}</div>

// Grid
<div className="grid grid-cols-3 gap-8">{children}</div>
```

#### Rule 3: Symmetrical Padding for Wall Distance

Padding pushes content away from container edges. Keep it symmetrical unless there is a deliberate asymmetric design reason (documented inline).

```jsx
// ✅ Symmetrical
<div className="p-8">...</div>
<div className="px-8 py-6">...</div>

// ❌ Random one-sided
<div className="pr-4">...</div>
```

#### Rule 4: Relative + Absolute Containment

Any floating/overlapping element must live inside a `relative` parent. No orphaned `absolute` elements.

### 4.2 Responsive Strategy

- **Mobile-first** — base styles target phones, then scale up
- **Breakpoints:** `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`
- **Max content width:** `1400px` centered
- **Dark mode only** — no light mode toggle. The brand IS dark.
- **Touch detection:** Use `@media (hover: hover)` to gate cursor-dependent features. Never assume a mouse exists.

### 4.3 Accessibility Baseline

- All interactive elements must have visible focus states (use `focus-visible:ring-2 ring-amber-400/50`)
- Respect `prefers-reduced-motion`: wrap all Framer Motion animations in a check, provide instant alternatives
- All images need alt text; decorative SVGs get `aria-hidden="true"`
- Minimum contrast ratio 4.5:1 for body text, 3:1 for large text

---

## 5. Navigation — The Floating Trigger

**There is no traditional navbar.**

### 5.1 Concept: The Reaction Trigger

A single small floating element — the **Variant 7 logo mark** (just the icon, ~40px) — sits fixed in a corner (bottom-right or top-right). It pulses subtly with the Amber/Indigo seed dot animation.

**On click/tap**, it expands into a **full-screen overlay menu** that uses the diagonal slash angle of the logo as the visual split:
- The left half of the overlay carries the Amber tint (`--amber-ghost` background)
- The right half carries the Indigo tint (`--indigo-ghost` background)
- A diagonal slash divides them (matching the logo's 45 degree cut angle)
- Navigation links appear along the diagonal, staggered with entrance animations
- The overlay dismiss animation reverses — content collapses back into the small logo mark

### 5.2 Menu Items

```
Work          → scrolls to / reveals the project showcase
Studio        → scrolls to / reveals internal products and tools
Process       → scrolls to / reveals the agency workflow
Contact       → opens the inquiry modal
```

Keep it to 4–5 items maximum. No dropdowns. No sub-menus.

### 5.3 Scroll Context Indicator

As the user scrolls through sections, the floating logo mark's border color shifts:
- In the "Work" zone → Indigo border (showcasing depth of client work)
- In the "Studio" zone → Amber border (showcasing creative energy of own products)
- This is subtle — a 2px border color transition, not flashy

---

## 6. The Opening Experience (Not a "Hero")

### 6.1 Preloader → Reveal Sequence

The site does NOT just load and show content. It performs a **controlled reveal**:

**Phase 1 — Preloader Modal (Full Screen)**

A fixed full-screen overlay (`bg-[--bg-void]`) containing:
- **Center:** The Variant 7 logo SVG at ~120px, animated with the **Sliding Duality** effect:
  - The Amber polygon slides diagonally (top-right → bottom-left direction) by plus/minus 10px
  - The Indigo polygon slides the opposite direction (bottom-left → top-right) by plus/minus 10px
  - They pass each other through the negative-space slash channel
  - The seed dots remain stationary — anchoring the composition while the blocks move
  - Motion: `ease-in-out`, 2s loop, infinite until load completes
- **Bottom-left:** Tiny mono text status: `"Initializing Redox Engine..."` with a blinking cursor
- **Top-right:** Low-bandwidth escape link: `"Skip to content →"` — sets `localStorage` flag `ridox_minimal_mode` and kills all heavy animations site-wide

**Phase 2 — The Slash Reveal**

When assets are loaded, the preloader does not just fade out. The **diagonal slash expands**:
- The slash line of the logo scales up to become a full-viewport diagonal split
- The left half (Amber-tinted) slides off to the top-left
- The right half (Indigo-tinted) slides off to the bottom-right
- Behind them: the actual page content is revealed
- Total duration: ~1.2s with a cubic-bezier ease `[0.76, 0, 0.24, 1]`

### 6.2 The Opening Canvas (Replaces Traditional Hero)

Once the preloader reveals, the user sees the **Opening Canvas** — NOT a standard hero section:

**Layout:** Full viewport height. No container max-width constraint — edge to edge.

**Content:**
- The Variant 7 logo mark rendered at **massive scale** (~40vw) as a semi-transparent watermark, positioned off-center (bleeding off the right edge), using `--indigo-ghost` opacity
- **Agency name** as enormous kinetic display type: `RIDOX` in `--text-primary` at hero display size, `STUDIO` below it in `--amber-400` at overline size with wide letter-spacing
- **One-line positioning statement** in `--text-secondary` — something like *"Software systems engineered at the reaction point"*
- **No traditional CTA buttons here.** Instead, a subtle scroll indicator — a small animated chevron or the word `SCROLL` rotated 90 degrees on the right edge, pulsing gently
- **Cursor interaction:** As the mouse moves across the canvas, the giant watermark logo subtly rotates/shifts with parallax (2–3 degrees max), creating depth without being gimmicky

---

## 7. Scroll-Driven Motion Architecture

### 7.1 Philosophy: Motion as Narrative

Every animation tells part of the Redox story. Scrolling is the user's way of driving the chemical reaction forward.

**Rules:**
- No animation exists purely for decoration. Each one reinforces the duality/energy/reaction theme.
- All motion respects `prefers-reduced-motion` — provide `opacity: 0 → 1` fallback instead of transforms.
- Timing: Use `cubic-bezier(0.76, 0, 0.24, 1)` as the default easing (fast start, smooth land).

### 7.2 Kinetic Velocity Marquee (Between Sections)

Giant text strips that scroll horizontally, driven by the user's scroll velocity:

```
→ RIDOX STUDIO ◆ SOFTWARE SYSTEMS ◆ REDOX DUALITY ◆ RIDOX STUDIO ◆
← ENGINEERING ◆ DESIGN ◆ ARCHITECTURE ◆ TRANSFORMATION ◆ ENGINEERING ◆
```

- Top line moves **left** as user scrolls down (and right when scrolling up)
- Bottom line moves **right** (opposite direction)
- Speed is proportional to scroll velocity — fast scroll = fast marquee, idle = stopped
- Text is rendered in `--text-tertiary` at ~`6rem` weight 900, all caps
- Implementation: `useScroll()` + `useVelocity()` + `useTransform()` from Framer Motion

Place these between major sections as breathing/transition elements.

### 7.3 Project Showcase: Stacked Folder Deck

Projects are NOT displayed as a grid of cards. They are a **vertical stack** that the user scrolls through like flipping through physical file folders:

- Each project occupies a `100vh` sticky container
- As the user scrolls, the current project card slides up and scales down slightly (`scale: 0.95`, `y: -20px`), revealing the next project card underneath
- Each card has: full-bleed project screenshot/visual on one side, project details on the other
- The card's accent border color alternates: Amber for client projects, Indigo for studio products
- 5–8 projects maximum in this deck

### 7.4 Horizontal Scroll Section (Services)

The services/capabilities section scrolls **horizontally** while the user scrolls vertically:

- A sticky container pins the section to the viewport
- Vertical scroll maps to horizontal translation of the inner content
- Each service is a full-viewport-width panel that slides in from the right
- Panels use alternating Amber/Indigo accent theming

### 7.5 Magnetic Cursor Effects

- **CTA elements:** Buttons/links magnetically pull toward the cursor within a 50px radius on hover
- **Project cards:** A soft radial gradient spotlight follows the cursor position over the card surface:
  ```css
  background: radial-gradient(
    600px circle at var(--mouse-x) var(--mouse-y),
    var(--indigo-ghost),
    transparent 60%
  );
  ```
- Track mouse position with `onMouseMove`, update CSS custom properties `--mouse-x` and `--mouse-y`

### 7.6 Page Transitions — The Redox Door

This is the **signature interaction** of the entire site. The Variant 7 logo blocks ARE the page transition. Every route change uses this system.

#### How It Works

The two polygon halves of the Variant 7 logo (Amber left block + Indigo right block) function as **sliding doors** that close over the current page, animate while loading, then open to reveal the new page.

#### The 3-Phase Transition Sequence

**Phase 1 — Doors Close (Current Page → Transition Overlay)**

When a navigation link is clicked:
1. A fixed full-screen overlay appears (`z-50`, `pointer-events: all`)
2. The **Amber polygon block** scales up from the logo mark and slides in from the top-left, covering the left half of the screen
3. The **Indigo polygon block** scales up and slides in from the bottom-right, covering the right half
4. They meet in the center along the **diagonal slash angle** (matching the logo's cut line) — not a vertical split, a 45-degree diagonal split
5. The negative-space slash channel remains visible between them as a thin diagonal gap
6. Duration: ~0.6s, easing: `EASING.redox`
7. The current page content is now fully covered

**Phase 2 — Loading State (Doors Closed, Logo Animating)**

While the new page route loads behind the overlay:
1. The two closed door blocks perform the **Sliding Duality animation** — the Amber block slides diagonally up-right by ±8px while the Indigo block slides diagonally down-left by ±8px, passing each other through the slash gap
2. The seed dots (Indigo dot in Amber zone, Amber dot in Indigo zone) remain stationary, pulsing gently
3. This loops continuously until the new page signals it is ready
4. Optionally: a small mono-text label at the center reads the destination name (e.g., `"// WORK"` or `"// CONTACT"`)
5. If loading takes more than 3 seconds, subtly show the skip-to-content link

**Phase 3 — Doors Open (Transition Overlay → New Page)**

When the new page is hydrated and ready:
1. The sliding duality animation stops — blocks snap to their closed resting position
2. The **Amber block slides out to the top-left** (off-screen)
3. The **Indigo block slides out to the bottom-right** (off-screen)
4. They split apart along the diagonal slash, revealing the new page content underneath
5. Duration: ~0.8s, easing: `EASING.redox`
6. The overlay unmounts

#### Implementation Notes

- Use Next.js App Router `usePathname()` + `useRouter()` to detect route changes
- Wrap all navigation in a custom `TransitionLink` component that triggers Phase 1 before `router.push()`
- The transition overlay is a persistent component in `layout.tsx` — it never unmounts, it just toggles visibility
- On the initial site load, only the Preloader runs (Section 6.1). The Redox Door transition is for **subsequent** page navigations only
- The floating logo trigger (Section 5) animates in sync — when doors close, the trigger fades out; when doors open, it fades back in

#### Reduced Motion Fallback

If `prefers-reduced-motion` is active:
- Skip the diagonal door animation entirely
- Use a simple crossfade (current page fades out 300ms → new page fades in 300ms)
- No sliding duality loop during loading

---

## 8. Page Content Architecture

### 8.1 Site Structure

The site uses **Next.js App Router with multiple routes**. Each major section is its own page. The Redox Door transition (Section 7.6) fires on every route change.

The homepage is a curated scroll experience that previews all sections. Deeper pages provide full content.

#### Routes

```
/                   → Homepage (curated scroll experience)
/work               → Full client case studies gallery
/work/[slug]        → Individual project deep-dive page
/studio             → Internal products and public tools showcase
/studio/[slug]      → Individual product page
/process            → Full agency workflow and methodology
/contact            → Inquiry form and project estimator
```

#### Homepage Scroll Flow

```
PRELOADER (Phase 1 + Phase 2 Slash Reveal — first visit only)
│
OPENING CANVAS (Full viewport — replaces hero)
│
VELOCITY MARQUEE STRIP #1
│
WORK PREVIEW — 3 Featured Client Projects (Stacked Folder Deck)
│   "View All Work →" link triggers Redox Door transition to /work
│
VELOCITY MARQUEE STRIP #2
│
STUDIO PREVIEW — 2 Featured Internal Products
│   "Explore Studio →" link triggers Redox Door transition to /studio
│
HORIZONTAL SCROLL — Services and Capabilities
│   Panel 1: Web Applications and Platforms
│   Panel 2: Mobile Systems
│   Panel 3: Cloud Infrastructure and DevOps
│   Panel 4: AI and Data Systems
│   Panel 5: Technical Consulting
│
THE PROCESS — Agency Workflow (Vertical Timeline)
│   Step 1: Discovery and Reaction Analysis
│   Step 2: Architecture and System Design
│   Step 3: Engineering and Iteration
│   Step 4: Launch and Equilibrium
│
CONTACT — Inquiry CTA
│   Full-width section with a single bold CTA
│   "Start a Reaction" → Redox Door transition to /contact
│
FOOTER (Minimal)
│   Logo mark + copyright + sparse social links
```

#### Sub-Page Layout Pattern

Every sub-page (`/work`, `/studio`, `/process`, `/contact`) follows this structure:
1. User clicks link → Redox Door closes (Phase 1)
2. New page loads behind closed doors
3. Redox Door opens (Phase 3) → reveals the page
4. Page content enters with staggered reveals (no additional preloader needed)
5. The floating logo trigger is always present for navigation back

### 8.2 Project Card Data Shape

```ts
interface Project {
  slug: string;
  category: 'client' | 'studio';
  title: string;
  subtitle: string;        // one-line result or product tagline
  description: string;     // 2-3 sentences
  coverImage: string;      // path to screenshot/visual
  techStack: string[];     // ["Next.js", "Laravel", "PostgreSQL"]
  status?: 'live' | 'beta' | 'open-source' | 'archived';
  externalUrl?: string;
  year: number;
}
```

For v1, projects can be hardcoded in a `data/projects.ts` file. No CMS needed yet.

---

## 9. Tech Stack and Libraries

### 9.1 Core

| Library | Version | Purpose |
|---|---|---|
| **Next.js** | 14+ (App Router) | Framework — RSC + streaming + file routing |
| **TypeScript** | 5+ | Type safety across all components |
| **Tailwind CSS** | 4+ | Utility styling with CSS variable integration |

### 9.2 Animation and Scroll

| Library | Purpose |
|---|---|
| **`framer-motion`** | All animations — preloader, reveals, scroll transforms, layout transitions, magnetic hover |
| **`lenis`** (`lenis/react`) | Smooth inertia scrolling — replaces native scroll for buttery feel |

### 9.3 Icons and Visual Assets

| Library | Purpose |
|---|---|
| **`lucide-react`** | Primary icon set — clean, consistent stroke icons |
| **Custom SVG** | All logo marks, brand illustrations — built from Variant 7 geometry using Amber/Indigo palette only |

### 9.4 Utilities

| Library | Purpose |
|---|---|
| **`clsx`** | Conditional className composition |
| **`react-intersection-observer`** | Viewport detection for lazy-loading heavy animation sections |

### 9.5 What NOT to Install

- ❌ No UI component libraries (no shadcn, no MUI, no Chakra) — everything is custom
- ❌ No Three.js / R3F — we achieve depth with 2D transforms, parallax, and SVG, not WebGL
- ❌ No GSAP — Framer Motion covers everything we need and integrates natively with React
- ❌ No analytics/tracking in v1 — add later

---

## 10. File Structure

```
app/
├── layout.tsx              # Root layout — fonts, Lenis provider, metadata
├── page.tsx                # Single-page scroll experience (server component shell)
├── globals.css             # CSS variables (Section 2), base resets, font-face
│
├── components/
│   ├── transitions/
│   │   ├── RedoxDoor.tsx           # The persistent page transition overlay (lives in layout.tsx)
│   │   ├── TransitionLink.tsx      # Custom <Link> wrapper that triggers Redox Door before navigating
│   │   └── TransitionContext.tsx   # React context for transition state management
│   ├── preloader/
│   │   └── Preloader.tsx           # Full-screen preloader + slash reveal (initial load only)
│   ├── navigation/
│   │   ├── FloatingTrigger.tsx     # Small fixed logo mark button
│   │   └── FullScreenMenu.tsx      # Diagonal-split overlay menu
│   ├── opening/
│   │   └── OpeningCanvas.tsx       # Full-viewport opening experience
│   ├── marquee/
│   │   └── VelocityMarquee.tsx     # Scroll-velocity horizontal text strip
│   ├── projects/
│   │   ├── ProjectDeck.tsx         # Sticky stacked folder scroll container
│   │   └── ProjectCard.tsx         # Individual project card
│   ├── services/
│   │   └── HorizontalScroll.tsx    # Horizontal-scroll services panels
│   ├── process/
│   │   └── ProcessTimeline.tsx     # Vertical animated workflow steps
│   ├── contact/
│   │   └── ContactSection.tsx      # CTA + inquiry overlay
│   ├── footer/
│   │   └── Footer.tsx
│   └── shared/
│       ├── MagneticButton.tsx      # Cursor-magnetic CTA button
│       ├── CursorSpotlight.tsx     # Radial gradient mouse follower
│       └── Logo.tsx                # Variant 7 SVG component with animation props
│
├── data/
│   └── projects.ts                 # Hardcoded project data array
│
├── hooks/
│   ├── useMousePosition.ts
│   ├── useSmoothScroll.ts
│   └── useReducedMotion.ts         # prefers-reduced-motion check
│
└── lib/
    └── motion.ts                   # Shared animation variants and easing curves
```

---

## 11. Key Animation Specifications

### 11.1 Shared Easing Curves

```ts
// lib/motion.ts
export const EASING = {
  /** Fast start, smooth landing — primary easing for all transitions */
  redox:     [0.76, 0, 0.24, 1],
  /** Snappy micro-interactions */
  snap:      [0.22, 1, 0.36, 1],
  /** Gentle reveals */
  reveal:    [0.16, 1, 0.3, 1],
  /** Spring-like overshoot for magnetic buttons */
  magnetic:  { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 },
} as const;
```

### 11.2 Preloader Timing (Initial Load Only)

| Phase | Duration | Delay | Easing |
|---|---|---|---|
| Logo slide loop | 2s per cycle | 0 | `easeInOut` |
| Status text blink | 0.8s | 0 | `steps(1)` |
| Slash expand reveal | 1.2s | on load complete | `EASING.redox` |
| Content fade-in (behind) | 0.6s | 0.3s after slash starts | `EASING.reveal` |

### 11.3 Redox Door Timing (Page Transitions)

| Phase | Duration | Delay | Easing |
|---|---|---|---|
| Phase 1: Doors close | 0.6s | 0 (on link click) | `EASING.redox` |
| Phase 2: Sliding duality loop | 1.6s per cycle | after doors closed | `easeInOut` |
| Phase 2: Destination label fade-in | 0.3s | 0.2s after doors closed | `EASING.reveal` |
| Phase 3: Doors open | 0.8s | on new page ready | `EASING.redox` |
| Phase 3: Content stagger reveal | 0.5s per element | 0.2s after doors start opening | `EASING.reveal` |
| Skip link appearance | 0s → visible | 3s after Phase 2 starts | instant |

### 11.4 Scroll Animation Durations

- **Velocity marquee:** Continuous, speed = `scrollVelocity * 0.05`
- **Project card stack:** Each card transition spans `33vh` of scroll distance
- **Horizontal scroll mapping:** 1px vertical scroll = 1px horizontal translation
- **Section entrance reveals:** 0.8s duration, triggered at 20% viewport intersection

---

## 12. Performance and Accessibility Guardrails

### 12.1 Performance

- **All animations are GPU-accelerated** — only animate `transform` and `opacity`, never `width`, `height`, `top`, `left`
- **Lazy-load below-fold sections** — use `react-intersection-observer` to mount heavy animation components only when approaching viewport
- **Images:** Use Next.js `<Image>` with `priority` on opening canvas, `loading="lazy"` on everything else. WebP/AVIF format.
- **Font loading:** Preload display font. Use `font-display: swap`.

### 12.2 Reduced Motion

```ts
// hooks/useReducedMotion.ts
import { useReducedMotion } from 'framer-motion';

// In every animated component:
const shouldReduce = useReducedMotion();
// If true: replace transforms with simple opacity fades (0 → 1, 300ms)
// If true: disable velocity marquee (show static text instead)
// If true: disable magnetic cursor effects
// If true: preloader shows logo static, then fades out normally
```

### 12.3 Minimal Mode (Low Bandwidth)

If `localStorage.getItem('ridox_minimal_mode') === 'true'`:
- Skip preloader entirely
- Disable Lenis smooth scroll (use native scroll)
- Disable velocity marquees
- Disable magnetic cursor / spotlight effects
- Project deck becomes a simple vertical list with no sticky behavior
- Services become a standard vertical stack (no horizontal scroll)
- All transitions reduce to 200ms opacity fades

---

## 13. Mobile Responsiveness — Interaction Adaptations

Every signature interaction must feel **equally intentional** on mobile. This is not about degrading gracefully — it is about designing a touch-native experience that carries the same Redox energy. No interaction should feel like a broken desktop version.

### 13.1 The Redox Door (Page Transitions) — Mobile

**The diagonal door transition works on mobile.** It is purely GPU-animated transforms on two SVG/CSS polygon elements — no cursor dependency.

| Aspect | Desktop | Mobile (< `md:768px`) |
|---|---|---|
| Diagonal split angle | 45 degrees | 45 degrees (unchanged — this is the logo's angle, it does not change) |
| Door close/open duration | 0.6s / 0.8s | 0.5s / 0.6s (slightly faster — mobile users expect snappier transitions) |
| Loading state animation | Sliding duality loop | Same loop, but logo mark at ~80px instead of ~120px |
| Destination label | `"// WORK"` centered | Same, but at `text-xs` |
| Skip link | Top-right, shows after 3s | Same position, but slightly larger tap target (`min-height: 44px`) |

### 13.2 Floating Trigger Navigation — Mobile

| Aspect | Desktop | Mobile |
|---|---|---|
| Trigger position | Bottom-right corner | Bottom-right corner (unchanged) |
| Trigger size | ~40px | **~48px** (meets 44px minimum tap target) |
| Tap behavior | Click → overlay | Tap → same full-screen overlay |
| Overlay layout | Diagonal split with links along the diagonal | **Full-screen vertical stack** — the diagonal Amber/Indigo tint background stays, but links are stacked vertically centered with large tap targets (`py-4` per link, `text-2xl`). The diagonal slash is rendered as a decorative background element, not a functional divider |
| Dismiss | Click logo or click outside | Tap the logo mark (now at top of overlay) or swipe down |
| Scroll context border | 2px border color shift | Same — still visible at 48px |

### 13.3 Opening Canvas — Mobile

| Aspect | Desktop | Mobile |
|---|---|---|
| Layout | Full viewport, edge to edge | Full viewport, edge to edge (unchanged) |
| Giant watermark logo | ~40vw, off-center right bleed | **~60vw**, centered behind text, lower opacity (`0.04` instead of `0.08`) to avoid competing with text |
| `RIDOX` display text | `clamp(3.5rem, 8vw, 7rem)` | Fluid — will resolve to ~3.5rem on small screens |
| Positioning statement | Single line | May wrap to 2 lines — ensure `max-width` and line-height handle this |
| Cursor parallax on watermark | Mouse-driven 2–3 degree shift | **Replaced with gyroscope tilt** on devices that support `DeviceOrientationEvent`. If not supported, the watermark is static. Request permission on iOS (`DeviceOrientationEvent.requestPermission()`) |
| Scroll indicator | `SCROLL` rotated 90 degrees on right edge | **Small animated chevron centered at bottom** — more natural for thumb-driven scrolling |

### 13.4 Velocity Marquee — Mobile

| Aspect | Desktop | Mobile |
|---|---|---|
| Text size | ~`6rem` | **~`3rem`** — still large and impactful, but fits the viewport |
| Scroll-velocity driven | `useVelocity()` maps scroll speed to horizontal movement | **Same behavior** — touch-scroll velocity drives the marquee. Lenis handles touch inertia, so the marquee responds to swipe speed naturally |
| Number of text lines | 2 lines (left + right) | **1 line only** — reduce to a single strip to save vertical space. Alternate direction between marquee instances |
| Interaction | Passive (scroll-driven only) | Same — no tap interaction needed |

### 13.5 Stacked Folder Deck (Projects) — Mobile

| Aspect | Desktop | Mobile |
|---|---|---|
| Card layout | Split — image on one side, details on other | **Vertical stack within each card** — image on top (16:9 aspect, full-width), details below |
| Sticky stacking behavior | `100vh` sticky per card, scroll-driven scale/translate | **Same sticky stacking** — this works well on mobile because each card is a full swipe-height. Reduce to `90vh` per card so users can see the next card peeking underneath |
| Card scale-down on stack | `scale: 0.95` | `scale: 0.97` — less dramatic on small screens |
| Number of projects shown | 5–8 | **3–5** on homepage preview — link to `/work` for full list |
| Tech stack pills | Horizontal row with wrapping | Same, but `text-[10px]` and `px-2` to fit more per row |

### 13.6 Horizontal Scroll (Services) — Mobile

This is the highest-risk section for mobile. Horizontal scroll mapped to vertical scroll can feel confusing on touch.

| Aspect | Desktop | Mobile |
|---|---|---|
| Scroll mapping | Vertical scroll → horizontal translation (sticky container) | **Option A (Recommended): Native horizontal swipe carousel** — ditch the vertical-to-horizontal mapping. Use a snap-scrolling horizontal container (`overflow-x: auto`, `scroll-snap-type: x mandatory`). Each panel snaps into place on swipe. Add dot indicators below showing position |
| | | **Option B: Vertical stack** — if the carousel feels too simple, stack service panels vertically with staggered entrance animations. Each panel gets a full-width card with the alternating Amber/Indigo accent |
| Panel width | 100vw per panel | 85vw per panel with `scroll-snap-align: center` (so the next panel peeks at the edges) |
| Indicators | None needed (scroll position is obvious) | **Dot indicators or a thin progress bar** below the carousel |

### 13.7 Cursor Effects — Mobile

There is no cursor on mobile. Every cursor-dependent interaction needs a touch equivalent or clean removal.

| Desktop Effect | Mobile Adaptation |
|---|---|
| Magnetic hover buttons | **Removed entirely.** Buttons use a press-state animation instead — on `touchstart`, scale down to `0.95` with a quick spring, on `touchend` scale back to `1.0`. The indigo/amber glow ring appears on press |
| Cursor spotlight on cards | **Removed entirely.** Replace with a **static gradient sheen** on the card — a fixed-angle `linear-gradient` using `--indigo-ghost` that simulates depth without needing cursor position |
| Hover border color change on cards | Triggered on **tap/focus** instead of hover. Use `:active` and `:focus-visible` states |

### 13.8 Preloader — Mobile

| Aspect | Desktop | Mobile |
|---|---|---|
| Logo animation size | ~120px | **~80px** |
| Status text | Bottom-left | **Bottom-center** |
| Skip link | Top-right | Top-right, but `min-height: 44px` and `min-width: 44px` tap target |
| Slash reveal | Diagonal split slides off | Same animation — works identically on mobile (pure transform) |

### 13.9 Contact / Inquiry Form — Mobile

| Aspect | Desktop | Mobile |
|---|---|---|
| Form layout | 2-column (details left, form right) | **Single column stack** — all fields full-width |
| Input sizing | Standard | All inputs `min-height: 48px` for comfortable thumb tapping |
| Submit button | Magnetic hover effect | Full-width button, press-state animation (scale spring) |

### 13.10 General Mobile Rules

1. **All tap targets minimum 44x44px** — buttons, links, the floating trigger, form inputs
2. **No hover-only states** — every `:hover` must have a corresponding `:active` or `:focus-visible` for touch
3. **Swipe gestures:** Only use for native-feeling patterns (horizontal carousel, pull-to-dismiss overlay). Do not invent custom swipe gestures
4. **Safe areas:** Respect `env(safe-area-inset-*)` for notch/dynamic island devices. The floating trigger must not sit under the home indicator
5. **Lenis on mobile:** Enable with `touchMultiplier: 1.5` for natural swipe inertia. If performance issues arise on older devices, disable Lenis on mobile entirely and use native scroll
6. **Test on real devices:** The diagonal SVG mask transitions (Redox Door, Preloader) must be tested on Safari iOS specifically — WebKit handles SVG masks differently from Chromium. If Safari chokes, fall back to CSS `clip-path: polygon()` which has better iOS performance

---

## 14. SEO, OpenGraph, and Search Visibility

The site must be as discoverable and shareable as it is visually impressive. A beautiful site that nobody can find or that shows a blank preview when shared on LinkedIn is a wasted effort.

### 14.1 SSR Strategy — Why It Matters

**All SEO-critical content must be server-rendered.** Next.js App Router Server Components handle this by default, but the rule must be followed deliberately:

| Content Type | Rendering | Why |
|---|---|---|
| Page text, headings, descriptions | **Server Component** (default) | Googlebot indexes server-rendered HTML on first pass, no render queue delay |
| Meta tags, OpenGraph, JSON-LD | **`generateMetadata()` in `layout.tsx` / `page.tsx`** | Social crawlers (Facebook, Twitter, LinkedIn, WhatsApp) do NOT execute JavaScript — if OG tags aren't in the initial HTML, you get blank previews |
| Animation wrappers, interactive UI | **Client Component** (`'use client'`) | These still SSR their initial HTML before hydration — text inside them is still indexable |
| Preloader, Redox Door, cursor effects | **Client Component** | Pure visual — no SEO content inside these |

**Rule:** Never put SEO-critical text (headings, project descriptions, service names) inside a component that only renders on the client with no server fallback. If a section is wrapped in `<AnimatePresence>` or `<motion.div>`, the text content inside it must still be present in the server-rendered HTML — Framer Motion supports this by default.

### 14.2 Metadata Per Page

Use Next.js `generateMetadata()` in every route's `page.tsx`:

```ts
// app/page.tsx (Homepage)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ridox Studio — Software Systems Engineered at the Reaction Point',
  description: 'Ridox Studio is a software engineering agency specializing in high-performance web applications, mobile systems, cloud infrastructure, and AI-powered solutions. Built on the principle of Redox duality — balancing design energy with engineering depth.',
  keywords: ['software agency', 'web development', 'mobile apps', 'cloud infrastructure', 'AI development', 'Ridox Studio'],
};
```

```ts
// app/work/page.tsx
export const metadata: Metadata = {
  title: 'Client Work — Ridox Studio',
  description: 'Case studies and project showcases from Ridox Studio. Web applications, mobile platforms, and enterprise systems built for clients across industries.',
};
```

```ts
// app/work/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);
  return {
    title: `${project.title} — Ridox Studio`,
    description: project.description,
  };
}
```

**Every route must have a unique, descriptive `title` and `description`.** No two pages should share the same metadata.

### 14.3 OpenGraph Tags (Social Sharing Previews)

When someone shares your URL on LinkedIn, Twitter, WhatsApp, Slack, or Discord, these tags control what preview card appears. **This is non-negotiable — every page needs them.**

```ts
// In generateMetadata() for each page:
export const metadata: Metadata = {
  title: 'Ridox Studio — Software Systems Engineered at the Reaction Point',
  description: '...',
  openGraph: {
    title: 'Ridox Studio — Software Systems Engineered at the Reaction Point',
    description: 'Software engineering agency balancing design energy with engineering depth.',
    url: 'https://ridoxstudio.com',
    siteName: 'Ridox Studio',
    images: [
      {
        url: '/og/home.png',        // 1200x630px OG image
        width: 1200,
        height: 630,
        alt: 'Ridox Studio — Redox Duality Logo on dark background',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ridox Studio — Software Systems Engineered at the Reaction Point',
    description: 'Software engineering agency balancing design energy with engineering depth.',
    images: ['/og/home.png'],
    creator: '@ridoxstudio',       // Update with actual handle
  },
};
```

### 14.4 OpenGraph Images

Every page needs a dedicated OG image (`1200x630px`) stored in `public/og/`:

```
public/og/
├── home.png          # Homepage — Variant 7 logo centered on dark bg with "RIDOX STUDIO" text
├── work.png          # Work page — "Client Work" title with project collage or logo mark
├── studio.png        # Studio page — "Studio Products" with product icons
├── process.png       # Process page — workflow visualization
├── contact.png       # Contact page — "Start a Reaction" CTA
└── projects/
    ├── [slug].png    # Per-project OG image — project screenshot with Ridox branding overlay
    └── ...
```

**OG image design rules:**
- Dark background using `--bg-void` (`#080612`)
- Variant 7 logo mark in the corner or as a watermark
- Bold text using Plus Jakarta Sans 700+ weight
- Amber and Indigo accents consistent with brand palette
- No tiny text — must be readable at thumbnail size in a social feed

For dynamic project pages, generate OG images using **Next.js OG Image Generation** (`next/og` with `ImageResponse`) or pre-generate them as static PNGs.

### 14.5 Structured Data (JSON-LD)

Structured data tells Google exactly what your site is, enabling rich search results (knowledge panels, sitelinks, organization info).

**Add to the root `layout.tsx`:**

```tsx
// app/layout.tsx — inject JSON-LD into <head>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Ridox Studio',
      url: 'https://ridoxstudio.com',
      logo: 'https://ridoxstudio.com/logos/ridox/variant7.svg',
      description: 'Software engineering agency specializing in high-performance web applications, mobile systems, cloud infrastructure, and AI solutions.',
      sameAs: [
        'https://twitter.com/ridoxstudio',
        'https://github.com/ridox-studio',
        'https://linkedin.com/company/ridox-studio',
        // Add actual social profiles
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        url: 'https://ridoxstudio.com/contact',
      },
    }),
  }}
/>
```

**Add `WebSite` schema for sitelinks search box:**

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Ridox Studio',
      url: 'https://ridoxstudio.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://ridoxstudio.com/work?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    }),
  }}
/>
```

**Per-project pages — add `CreativeWork` schema:**

```tsx
// app/work/[slug]/page.tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      url: `https://ridoxstudio.com/work/${project.slug}`,
      image: project.coverImage,
      creator: {
        '@type': 'Organization',
        name: 'Ridox Studio',
      },
      dateCreated: project.year.toString(),
      keywords: project.techStack.join(', '),
    }),
  }}
/>
```

### 14.6 Google Sitelinks Optimization

**Sitelinks** are the indented sub-links that appear under your main search result in Google (e.g., "Work", "Studio", "Process", "Contact" showing directly in the search result). You cannot directly control them, but you can strongly influence them:

1. **Clear internal link structure:** The floating trigger menu links to `/work`, `/studio`, `/process`, `/contact` — these become sitelink candidates
2. **Descriptive page titles:** Each page has a unique, clear `<title>` tag (Section 14.2)
3. **Sitemap:** Submit all routes (Section 14.7)
4. **Breadcrumbs (optional):** For project detail pages (`/work/[slug]`), add breadcrumb structured data:

```tsx
{
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ridoxstudio.com' },
    { '@type': 'ListItem', position: 2, name: 'Work', item: 'https://ridoxstudio.com/work' },
    { '@type': 'ListItem', position: 3, name: project.title, item: `https://ridoxstudio.com/work/${project.slug}` },
  ],
}
```

5. **Semantic HTML:** Use proper heading hierarchy — one `<h1>` per page, `<h2>` for sections, `<nav>` for navigation, `<main>` for content, `<footer>` for footer. The full-screen menu overlay should be a `<nav aria-label="Main navigation">`.

### 14.7 Sitemap and robots.txt

**Sitemap — auto-generate with Next.js:**

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getAllProjects } from '@/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getAllProjects();

  const projectUrls = projects.map((project) => ({
    url: `https://ridoxstudio.com/work/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    { url: 'https://ridoxstudio.com',         lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: 'https://ridoxstudio.com/work',    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: 'https://ridoxstudio.com/studio',  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://ridoxstudio.com/process', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://ridoxstudio.com/contact', lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.5 },
    ...projectUrls,
  ];
}
```

**robots.txt:**

```ts
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: 'https://ridoxstudio.com/sitemap.xml',
  };
}
```

### 14.8 Canonical URLs

Every page must have a canonical URL to prevent duplicate content issues:

```ts
// In generateMetadata():
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://ridoxstudio.com/work',
  },
  // ... rest of metadata
};
```

### 14.9 SEO Checklist (Per Page)

Before any page ships, verify:

- [ ] Unique `<title>` tag (50–60 characters)
- [ ] Unique `<meta name="description">` (120–160 characters)
- [ ] OpenGraph tags: `og:title`, `og:description`, `og:image` (1200x630), `og:url`, `og:type`
- [ ] Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- [ ] Dedicated OG image in `public/og/`
- [ ] Single `<h1>` per page
- [ ] Proper heading hierarchy (`<h1>` → `<h2>` → `<h3>`, no skipping)
- [ ] Semantic HTML (`<nav>`, `<main>`, `<article>`, `<footer>`)
- [ ] JSON-LD structured data (Organization on root, CreativeWork on projects, BreadcrumbList on nested pages)
- [ ] Canonical URL set
- [ ] All images have descriptive `alt` text
- [ ] Page is server-rendered (SEO text visible in View Source without JavaScript)
- [ ] Page appears in `sitemap.xml`

---

**This is the complete specification. An agent or developer with this document has everything needed to build the Ridox Studio website — desktop, mobile, and fully optimized for search and social sharing — without guessing.**

