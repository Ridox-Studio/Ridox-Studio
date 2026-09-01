<div align="center">

<img src="public/logos/ridox-studio-logo.svg" alt="Ridox Studio" width="90" />

# Ridox Studio — Brand Guide

**The reference for anything carrying our name.** Website, products, decks,
invoices, social, README files in other repositories.

</div>

---

## Why this file exists

Brand details drift. The RISMS README documented Plus Jakarta Sans months after
we moved to Archivo, because the decision lived in one repo and the description
lived in another. This file is the single place to check before writing
"our colours are…" anywhere.

Two rules keep it honest:

1. **This file is the source of truth for identity.** If code disagrees with
   this file, one of them is a bug — decide which and fix it.
2. **The website is the reference implementation.** Every value here is live in
   [`app/globals.css`](app/globals.css); this file explains the *why* that CSS
   cannot.

---

## 1. The idea

Ridox is named after **redox reactions** — **red**uction and **ox**idation. Two
opposing forces that cannot exist without each other. Neither half is the whole
reaction; the energy is in the exchange.

Everything downstream is that idea made literal:

| Idea | Expression |
|---|---|
| Two opposing forces | Two colours, amber and indigo — never one alone |
| The reaction point | The diagonal slash where they meet |
| Exchange, not balance | Motion that passes *through* the slash, never around it |

When a design decision is unclear, ask which half of the duality it belongs to.
If the answer is "neither", it probably does not belong.

---

## 2. Colour

### 2.1 The two sources

Every colour on every surface derives from these two values. Nothing is picked
by eye.

| | Value | Name | Role |
|---|---|---|---|
| 🟠 | `hsl(33, 95%, 52%)` | **Oxidation Amber** | Action, warmth, energy, CTAs, client work |
| 🟣 | `hsl(258, 89%, 62%)` | **Reduction Indigo** | Structure, depth, stability, links, studio products |

Both are taken straight from the logo SVG. If the logo changes, the palette
changes with it — not the other way round.

### 2.2 Scales

Derived by moving lightness only. Hue and saturation never change.

```
--amber-50   hsl(33, 95%, 95%)     --indigo-50   hsl(258, 89%, 95%)
--amber-100  hsl(33, 95%, 88%)     --indigo-100  hsl(258, 89%, 85%)
--amber-200  hsl(33, 95%, 76%)     --indigo-200  hsl(258, 89%, 74%)
--amber-300  hsl(33, 95%, 64%)     --indigo-300  hsl(258, 89%, 62%)  ← PRIMARY
--amber-400  hsl(33, 95%, 52%)  ←  --indigo-400  hsl(258, 89%, 52%)
--amber-500  hsl(33, 95%, 44%)     --indigo-500  hsl(258, 89%, 42%)
--amber-600  hsl(33, 95%, 36%)     --indigo-600  hsl(258, 89%, 30%)
```

Note the primaries sit at different steps — `amber-400` and `indigo-300`. That
is deliberate: matching the *numbers* would mismatch the *weights*.

**Glows and ghosts** for shadows and tinted backgrounds:
`--amber-glow` / `--indigo-glow` at 25% alpha, `--amber-ghost` / `--indigo-ghost`
at 8%.

### 2.3 Surfaces and text

Dark by default. Every neutral carries an indigo undertone — there is no pure
grey anywhere.

```
--bg-void      hsl(258, 40%, 4%)    Deepest. Doors, image grounds, app icon.
--bg-deep      hsl(258, 35%, 7%)    Page background.
--bg-card      hsl(258, 30%, 10%)   Cards.
--bg-elevated  hsl(258, 25%, 14%)   Hover states, modals.
--bg-surface   hsl(258, 20%, 18%)   Highest elevation.

--text-primary    hsl(258, 60%, 96%)   Headings, body.
--text-secondary  hsl(258, 30%, 68%)   Descriptions, meta.
--text-tertiary   hsl(258, 20%, 45%)   Labels, timestamps, disabled.
```

### 2.4 Rules

1. **Never pure black or pure white.** `#000` and `#fff` do not appear. Use the
   `--bg-*` and `--text-*` scales, which carry the brand undertone.
2. **Never invent a colour.** If you need one that is not here, derive it by
   lightness from amber or indigo.
3. **Amber is for action.** CTAs, active states, the energy half of any pairing.
4. **Indigo is for structure.** Links, selected states, the depth half.
5. **Gradients flow amber → indigo**, warm to cool, matching the logo's own
   left-to-right energy.
6. **Green and red are semantic only** — success and error. They are not brand
   colours and never decorate.

---

## 3. Typography

| Role | Font | Weights | Used for |
|---|---|---|---|
| Display | **Archivo** (variable `wght` + `wdth`) | 700–900 at `wdth` 110–125 | Headings, wordmark, stat numbers |
| Body | **Inter** (variable) | 400–600 | Paragraphs, descriptions, UI |
| Accent | **Bitcount Prop Single** | 400–500 | Overlines, tech pills, status labels, timestamps |

All three are Google Fonts, loaded through `next/font`.

### 3.1 Archivo is set wide

The character of our headings comes from the **width axis**, not just weight.
Headings run at `font-variation-settings: "wdth" 125` with short leading. Set at
default width, Archivo is an ordinary grotesque and the brand disappears.

```css
.type-hero    { clamp(3.5rem, 8vw, 7rem);   900; wdth 125; lh 0.82; ls -0.02em }
.type-mega    { clamp(3.25rem, 15vw, 14rem); 900; wdth 125; lh 0.78; ls -0.045em }
.type-section { clamp(2rem, 4vw, 3.5rem);   800; wdth 118; lh 0.90; ls -0.02em }
.type-card    { 1.25rem → 1.5rem;           700; wdth 110; lh 1.10 }
```

### 3.2 Bitcount is a seasoning, not a meal

It is a pixel/dot-matrix face. It carries small, uppercase, widely-tracked text
and nothing else. **It never sets a heading, a paragraph, or anything longer than
a few words.** At length it becomes unreadable and turns the brand into a costume.

### 3.3 Rules

- Headings are `text-wrap: balance`.
- Overlines are uppercase with `0.15em` tracking, never below `10px`.
- Body copy never goes below `0.9375rem` (15px).
- One display face. Do not introduce a second for "variety".

---

## 4. The mark

Two polygon blocks — amber left, indigo right — split by a diagonal
negative-space cut. Drawn in a `100 × 100` viewBox with the blocks spanning
`22 → 78` on both axes.

> **Historical note.** The mark originally carried a *seed dot* of the opposing
> colour inside each block. They were removed. Anything still showing them is out
> of date. Animations that used them as stationary anchors now animate the blocks.

### 4.1 Files

| Path | Use |
|---|---|
| `public/logos/ridox-studio-logo.svg` | **Source of truth.** Transparent. |
| `public/logos/ridox-studio-logo-{light,dark}.svg` | On white / on `--bg-void` |
| `public/logos/png/ridox-studio-logo-{variant}-{32…1024}.png` | Raster, all sizes |
| `public/logos/social/ridox-studio-profile-{light,dark}-{400,512,1024}.png` | Avatars |
| `public/logos/social/banners/` | Platform banners |
| `app/icon.svg`, `app/apple-icon.png` | Favicon and iOS icon |

**Never hand-export.** Edit the source SVG and run `npm run logos` — every
variant regenerates. A hand-made PNG once shipped as the iOS icon carrying seed
dots the SVG no longer had, and nobody noticed for weeks.

### 4.2 Usage

- **Clear space:** at least 25% of the mark's width on every side. The blocks
  already carry internal padding; do not crop into it.
- **Minimum size:** 24px. Below that the slash closes up and it reads as a blob.
- **Avatars:** always on a solid ground. Platforms flatten transparency to white
  or black unpredictably. Use the `social/` files — their frame is tightened and
  capped so the corners survive a circular crop.
- **Dark ground is the default.** Use the light variant only on genuinely white
  surfaces such as print or an invoice.

### 4.3 Never

- Recolour it. The two colours *are* the logo.
- Rotate, skew, or stretch it. The slash angle is fixed.
- Add effects — no shadow, glow, outline or gradient overlay.
- Put it on a busy photo, or on a mid-tone that fights both halves.
- Reconstruct it by hand. Reference the file.

---

## 5. The slash

The diagonal is the brand's second signature and it appears far more often than
the mark. It is the *reaction point* — where the two forces meet.

- **Angle:** matches the logo's cut. In viewport terms, `62%` at the top to `38%`
  at the bottom (`SLASH` in [`app/lib/motion.ts`](app/lib/motion.ts)).
- **The two halves meet exactly**, with a hair of overlap so no seam shows.
  Closed means *sealed* — the slash channel only opens as they move apart.
- **Motion along the slash, never across it.** When the closed halves animate,
  they slide *along* their shared edge (`SLASH_AXIS`). Moving across it cracks
  the door open and breaks the illusion.

Where it appears: page transitions, the preloader, the menu overlay tint,
project covers, social banners, OG cards.

---

## 6. Recurring patterns

The details nobody writes down and everybody then reinvents slightly differently.
These are the recipes, exact.

### 6.1 The brand ground

Every generated image — project covers, social banners, OG cards, blank
templates — is built from the same four layers, in this order:

```
1. Base        hsl(258, 40%, 4%)                          the void
2. Grid        64px squares, 1px lines
               hsl(258, 40%, 25%) at 0.45 opacity          faint technical texture
3. Wash        linear-gradient 135°, lead colour 0.22
               to counter colour 0.10                      the duality, quietly
4. Slash bars  two diagonal bars bleeding off both edges,
               lead at 0.16, counter at 0.12               the reaction point
```

The lead colour is the section's accent — indigo for studio products, amber for
client and consulting work — and the counter colour is the other one. Never two
bars of the same colour.

The grid is the detail people notice without noticing. It reads as engineering
graph paper and it is what stops the ground looking like a generic dark gradient.

### 6.2 Framing a screenshot

When a screenshot is placed on the ground:

- **Corner radius** `18px`, **border** `1.5px` of `hsl(258, 40%, 45%)` at 0.5
  opacity — a hairline, so the shot reads as a held object rather than a hole.
- **Safe box** 62% of width by 74% of height, centred. Nothing important goes
  outside it.
- **Multiple shots** sit side by side with a `28px` gap, sharing the box width
  equally. Phone screenshots at 2–3 across compose better than one alone.
- **Never mix orientations** in one image. Either one landscape shot or two to
  three portrait ones.

### 6.3 Cards

- Border in the accent at **30% opacity** — present, not loud.
- A gradient overlay on the image half: `from-surface-void/80` to the accent
  **ghost** (8%), running to the top-right. It sinks the screenshot into the card
  instead of letting it sit on top like a sticker.
- On hover, a **600px radial spotlight** in the accent ghost follows the cursor.
  Touch devices get a fixed 135° sheen instead — the effect is decorative, so it
  degrades rather than disappearing.
- Overflowing lists truncate with a **`+n` pill** in the same shape as the
  others, one tone quieter.

### 6.4 Edges and fades

- **Long strips fade at both ends** rather than cutting: a linear-gradient mask,
  transparent → black at 18% → black at 82% → transparent. Used on the vertical
  word strip. A hard cut looks like a bug; a fade looks intentional.
- **Section rails** are `3.25rem` tall (`--rail-h`), with `bg-surface-deep/85` and
  a backdrop blur, bordered top and bottom. Pinned content offsets by that
  variable so nothing slides underneath.
- **Fixed controls** — the menu trigger and the back control — share one
  treatment: `border-2`, `bg-surface-card/80`, `backdrop-blur-md`, rounded
  `0.75rem`, inset by `max(1.5rem, safe-area-inset)`. They mirror each other
  across the viewport and both fade out when the doors close.

### 6.5 OG cards

1200 × 630, generated per route rather than drawn by hand.

- Brand row **top-left**: two small colour blocks, then the studio name in wide
  tracking.
- Content **bottom-left**: accent overline, then the title at 84px, then a muted
  subtitle.
- A **CTA chip** below, outlined in the accent, uppercase and tracked — sized to
  stay legible at feed thumbnail scale but kept subordinate to the title.
- The **slash sits at the right**, rotated 20°, bleeding off the top and bottom.

---

## 7. Motion

| Curve | Value | Use |
|---|---|---|
| `redox` | `cubic-bezier(0.76, 0, 0.24, 1)` | Primary. Doors, reveals, everything structural. |
| `snap` | `cubic-bezier(0.22, 1, 0.36, 1)` | Micro-interactions, button states. |
| `reveal` | `cubic-bezier(0.16, 1, 0.3, 1)` | Gentle entrances. |

**Durations:** doors close in 0.6s and open in 0.8s (0.5s / 0.6s on mobile);
section reveals 0.8s; stagger children by 0.08s.

**Rules:**

1. **Animate `transform` and `opacity` only.** Never `width`, `height`, `top` or
   `left` — they force layout on every frame.
2. **Everything gates on `useReducedMotion()`** and falls back to a plain fade.
3. **Motion is always reversible.** No control may leave a reader in a degraded
   state with no way back. There is a three-state preference — `auto` / `full` /
   `minimal` — with a visible toggle in the footer.
4. Decorative motion is `aria-hidden`.

---

## 8. Layout

- **No margins.** Spacing is the parent's job: `gap` between siblings,
  symmetrical padding for distance from an edge. A negative margin needs an
  inline comment justifying it.
- **Max content width 1400px**, centred with flex rather than auto margins.
- **Gutters:** `1.5rem` mobile, `3rem` desktop.
- **Radii:** `0.75rem` controls, `1rem` cards, `999px` pills.
- **Touch targets:** 44px minimum, always.

---

## 9. Voice

How we write matters as much as how we look, and it is the part most likely to
drift.

**Be specific rather than impressive.** "AI-powered rescheduling" is a claim
anyone can type. "It buzzes you before the task, and if you say no it offers
slots based on your calendar, your patterns and the weather where you are" is
something only the person who built it can write. Specificity is the proof.

**Never invent a number.** No metric appears anywhere unless it can be pointed
at. Where we have no numbers we describe behaviour instead. An invented statistic
that gets checked costs more than the empty space it filled.

**Credit other people.** If a designer, a client or a collaborator did part of
the work, say so. It costs nothing and taking it costs a relationship.

**Plain words.** "We build" over "we architect solutions". "Money" over "capital
flows". If a sentence would embarrass you read aloud to a client, rewrite it.

**Say the hard part.** "Still in development" beats implying otherwise. Naming a
limitation is more persuasive than hiding it, because it makes the rest credible.

**British-leaning spelling**, sentence case in prose, no exclamation marks.

---

## 10. Generating assets

Never make these by hand. Each script derives everything from one source.

```bash
npm run logos     # every logo variant + favicons, from the source SVG
npm run banners   # social banners, text as real Archivo outlines
npm run covers    # project covers, from assets/screenshots/
```

Blank cover templates for composing by hand live in `assets/cover-template/`.

**Screenshots:** keep anything that must stay legible in the middle third.
Covers render with `object-cover` into panes whose aspect ratio varies with the
viewport, so the edges are cropped by an unpredictable amount.

**Image caching:** editing an image in place keeps serving the old one — Next's
optimizer keys on the path. Rename it, or `rm -rf .next/cache/images`.

---

## 11. Social

| | Handle |
|---|---|
| X | [@ridoxstudio_](https://x.com/ridoxstudio_) — note the trailing underscore |
| Instagram | [@ridoxstudio](https://instagram.com/ridoxstudio) |
| GitHub | [Ridox-Studio](https://github.com/Ridox-Studio) |

**Avatar:** `ridox-studio-profile-dark-512.png` everywhere. Dark suits GitHub and
X, and a single consistent avatar is worth more than a per-platform optimum.

**Banners:** in `public/logos/social/banners/`, sized per platform with content
kept inside the safe band each one crops to.

**Organisation description:**

> Software engineering agency. Web, mobile, cloud and AI systems built where
> design energy meets engineering depth.

---

## 12. Quick reference

```
Amber      hsl(33, 95%, 52%)      Indigo     hsl(258, 89%, 62%)
Background hsl(258, 35%, 7%)      Text       hsl(258, 60%, 96%)

Display    Archivo, 700–900, wdth 110–125
Body       Inter, 400–600
Accent     Bitcount Prop Single, 400–500

Easing     cubic-bezier(0.76, 0, 0.24, 1)
Max width  1400px          Gutters 1.5rem / 3rem
Radii      0.75 / 1rem / 999px     Tap target 44px
```

---

<div align="center">
<sub>Change something here? Change it in <a href="app/globals.css">globals.css</a> too — and say so in the commit.</sub>
</div>
