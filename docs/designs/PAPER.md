# Paper — design draft

**Status:** proposal, on branch `redesign/new-design-draft`. Nothing here is
live. [`BRAND.md`](../../BRAND.md) remains the source of truth until a draft is
adopted. For how drafts are organised, promoted and removed, see
[README.md](README.md). The other draft is [Noir](NOIR.md).

Paper is the editorial direction: light ground, two typefaces, one amber action
per view. Every page of the site exists in it.

| | |
|---|---|
| Live draft | `/paper` and every route beneath it |
| Living reference (swatches, specimens, components) | `/paper/system` |
| Tokens and component styles | [`app/(paper)/paper.css`](<../../app/(paper)/paper.css>) |
| Shared pieces | [`app/(paper)/_components/`](<../../app/(paper)/_components>) |
| Fonts, wrapper, nav | [`app/(paper)/layout.tsx`](<../../app/(paper)/layout.tsx>) |
| Base path | [`app/(paper)/_lib/paths.ts`](<../../app/(paper)/_lib/paths.ts>) |

---

## 1. The brief

Make the studio read as one that takes on large engagements. The v1 site is
well built but reads as a developer showing range: a preloader, a floating
menu, page-transition doors, marquees, a cursor spotlight, horizontal scroll,
heavy wide type and gradients, all on a dark ground. Each one is competent.
Together they put the site's own behaviour ahead of the work.

Buyers at the top of the market read confidence as restraint. So v2 is mostly
v1 with things removed.

## 2. What stays, what goes

The idea does not change: redox, two opposing forces, and the point where they
meet. What changes is where each force sits.

| | v1 | v2 |
|---|---|---|
| Ground | Dark everywhere | Light paper, one night band per page |
| Indigo | One of two alternating zone colours | **Structure.** Tints every neutral, the ink, the rules, the night band |
| Amber | One of two alternating zone colours | **Action.** One filled element per view |
| Gradients, glows | Throughout | None |
| Display type | Archivo 900, `wdth` 125, leading 0.82 | Archivo 600, `wdth` 100, leading 0.96 |
| Second voice | None | Fraunces italic, one phrase per heading |
| Label face | Bitcount Prop Single | JetBrains Mono |
| Navigation | Preloader, floating trigger, full-screen menu, doors | A plain sticky bar |
| Scroll | Lenis smooth scroll, horizontal sections, marquees | Native |
| The slash | A wipe between routes | A still mark: leads every label, cuts the hero image |

Unchanged from `BRAND.md`: both source colours, the "no pure grey, black or
white" rule, the redox easing curve, 1.5rem / 3rem gutters, 44px touch targets,
the layout rule that spacing belongs to the parent, and the whole of the voice
section. The landing page copy is drawn from existing site content. No metric,
client or quote was invented for it.

## 3. Tokens

All tokens are CSS custom properties on `.nd`, prefixed `--nd-`. There are two
layers, and the split is the most important structural decision in the system.

### 3.1 Primitive layer

Raw values. Do not use these in components.

```
Sources (from the logo, unchanged>)
--nd-amber         hsl(33 95% 52%)     the action fill
--nd-amber-deep    hsl(33 95% 44%)     action, hover
--nd-amber-wash    hsl(33 95% 92%)     highlight ground
--nd-indigo        hsl(258 89% 62%)    marks, status dots
--nd-indigo-ink    hsl(258 89% 48%)    links and focus ring on paper
--nd-indigo-wash   hsl(258 89% 96%)    selected ground

Paper (light neutrals, all hue 258)
--nd-paper         hsl(258 40% 98.5%)  page
--nd-paper-2       hsl(258 32% 96%)    raised band, hover
--nd-paper-3       hsl(258 26% 92%)    wells, placeholders
--nd-line          hsl(258 22% 87%)    hairlines
--nd-line-strong   hsl(258 16% 70%)    table heads, outlines

Ink
--nd-ink           hsl(258 40% 8%)     headings, body
--nd-ink-2         hsl(258 14% 32%)    descriptions
--nd-ink-3         hsl(258 10% 43%)    labels, meta (clears AA on paper)

Night (the inverted band)
--nd-night         hsl(258 40% 7%)
--nd-night-2       hsl(258 30% 11%)
--nd-night-line    hsl(258 24% 21%)
--nd-on-night      hsl(258 60% 96%)
--nd-on-night-2    hsl(258 22% 72%)
--nd-on-night-3    hsl(258 16% 60%)
```

### 3.2 Semantic layer

What components read. `.nd-invert` remaps these seven and nothing else, which
is why every component works on paper and on night without a second style.

| Token | On paper | Inside `.nd-invert` |
|---|---|---|
| `--nd-bg` | paper | night |
| `--nd-bg-raised` | paper-2 | night-2 |
| `--nd-fg` | ink | on-night |
| `--nd-fg-muted` | ink-2 | on-night-2 |
| `--nd-fg-subtle` | ink-3 | on-night-3 |
| `--nd-rule` | line | night-line |
| `--nd-rule-strong` | line-strong | `hsl(258 20% 34%)` |
| `--nd-link` | indigo-ink | `hsl(258 89% 80%)` |

A future theme (a true dark mode, a print sheet) is a third mapping of the same
names.

### 3.3 Colour rules

1. **One amber fill per view.** If two things are amber, neither is the action.
   The nav button is solid ink for this reason.
2. **Amber is never text on paper.** At 52% lightness it is about 2:1 on paper.
   Amber on night is allowed for small marks (step numbers).
3. **No gradients, glows or tinted shadows.**
4. **One night band per page**, plus the closing band.
5. **Components read semantic tokens only.**
6. Green and red stay semantic only, as in v1. Neither is defined yet.

### 3.4 Type

| Token | Value |
|---|---|
| `--nd-font-display` | Archivo (variable, `wght` + `wdth`) |
| `--nd-font-serif` | Fraunces, italic only (variable, `opsz`) |
| `--nd-font-body` | Inter |
| `--nd-font-mono` | JetBrains Mono |

| Style | Class | Size | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Display | `.nd-display` | `clamp(2.75rem, 1.1rem + 7vw, 7.25rem)` | 600 | -0.045em | 0.96 |
| Heading 2 | `.nd-h2` | `clamp(2rem, 1.2rem + 3.2vw, 3.75rem)` | 600 | -0.038em | 1.02 |
| Heading 3 | `.nd-h3` | `clamp(1.375rem, 1.2rem + 0.7vw, 1.75rem)` | 600 | -0.025em | 1.15 |
| Lede | `.nd-lede` | `clamp(1.125rem, 1rem + 0.5vw, 1.375rem)` | 400 | -0.012em | 1.45 |
| Body | `.nd-body` | 1.0625rem | 400 | 0 | 1.6 |
| Small | `.nd-small` | 0.9375rem | 400 | 0 | 1.55 |
| Label | `.nd-label` | 0.75rem, caps | 500 | +0.06em | 1.4 |

**The second voice.** An `<em>` inside `.nd-display`, `.nd-h2` or `.nd-h3`
switches to Fraunces italic at weight 400. Rules:

- One phrase per heading, at the end, carrying the point of the sentence.
- Never a whole heading, never in body text, never upright.
- No colour change. The change of typeface is the emphasis.

This is the redox idea moved from colour into type: a grotesque for the
statement, a serif for the judgement.

### 3.5 Space, shape, motion

```
Space     --nd-space-1  0.25rem      --nd-space-8   2rem
          --nd-space-2  0.5rem       --nd-space-12  3rem
          --nd-space-3  0.75rem      --nd-space-16  4rem
          --nd-space-4  1rem         --nd-space-24  6rem
          --nd-space-6  1.5rem
          --nd-section  clamp(4.5rem, 2rem + 9vw, 10rem)   section padding
          --nd-gutter   1.5rem, 3rem from 768px
          --nd-max      1320px

Shape     --nd-radius-s     4px    controls
          --nd-radius-m     8px    images, panels
          --nd-radius-pill  999px  tags only

Motion    --nd-ease      cubic-bezier(0.76, 0, 0.24, 1)   redox, image scale
          --nd-ease-out  cubic-bezier(0.16, 1, 0.3, 1)    everything else
          --nd-fast      180ms    colour, small position shifts
          --nd-slow      600ms    image scale on hover
```

Separation is a 1px rule, never a shadow. The only shadow in the system is on
the mobile menu panel, because it floats.

Motion is transform and opacity only. There is one entrance (`.nd-rise`,
staggered with `--nd-i`) used on the hero and nowhere else. Everything stands
down under `prefers-reduced-motion`.

## 4. Layout

- `.nd-section` is a full-width band that centres its child. `.nd-wrap` is the
  1320px column with gutters. Every section is `section > wrap > content`.
- Sections open with `SectionHead`: a 3/9 grid with the label in the margin
  column and the statement beside it. Below 900px it stacks.
- Lists of things are hairline rows (`.nd-rows` / `.nd-row`), not cards. Cards
  are reserved for work, where there is an image to frame.
- No margins. Spacing is `gap` on the parent or padding, as in v1.

## 5. Components

Each is currently a set of classes in `paper.css`. The "Library API"
column is a proposal for the React component it should become.

| Component | Classes | Variants | Library API (proposed) |
|---|---|---|---|
| Button | `.nd-btn` | `--action`, `--solid`, `--ghost`; `--small` | `<Button variant size href? icon?>` |
| Text link | `.nd-link` | with or without trailing icon | `<TextLink href external?>` |
| Label | `.nd-label` | `--fg` | `<Label tone>` |
| Eyebrow | `.nd-label.nd-eyebrow` + `.nd-slash` | amber, `--indigo` | `<Eyebrow accent>` |
| Tag | `.nd-tag` + `.nd-tag__dot` | `--live`, `--building`, neutral | `<Tag status?>` |
| Section head | `.nd-head` | with lede, with action | `<SectionHead label accent title lede action>` (exists) |
| Work card | `.nd-card` | — | `<WorkCard project>` (exists, local to the page) |
| Row list | `.nd-rows` / `.nd-row` | `--capability`, `--post`, `--advisory` | `<Rows>` + `<Row columns>` |
| Step | `.nd-steps` / `.nd-step` | — | `<Steps items>` |
| Facts | `.nd-facts` / `.nd-fact` | — | `<Facts items>` |
| Split frame | `.nd-split` | — | `<SplitFrame a b>` |
| Nav | `.nd-nav`, `.nd-menu` | — | `<Nav>` (exists) |
| Closing band | `.nd-cta`, `.nd-footer` | — | `<Closing>` (exists) |
| Mark | inline SVG | size | `<Mark size>` (exists) |
| Page head | `.nd-pagehead` | with lede, with extras | `<PageHead label accent title lede>` (exists) |
| Back link | `.nd-back` | — | `<BackLink href>` |
| Project detail | `.nd-detail__*`, `.nd-features`, `.nd-next` | client, studio | `<ProjectDetail project>` (exists) |
| Form | `.nd-form`, `.nd-field`, `.nd-input` | text, `--select`, `--area` | `<Field>`, `<Input>`, `<Select>`, `<Textarea>` |
| Inquiry form | — | idle, error, success | `<InquiryForm>` (exists) |
| Article | `.nd-article`, `.nd-prose` | — | `<Article post>`, `<Prose html>` |
| Legal | `.nd-legal` | — | `<LegalSection title>` |

Notes on the ones with rules attached:

**Button.** `--action` is the amber one and is limited by colour rule 1.
`--solid` is ink on paper and inverts automatically on night. Minimum height
52px, 44px for `--small`.

**Slash.** `.nd-slash` is a 0.5rem × 1rem parallelogram with the same lean as
the channel cut through the logo. It leads eyebrows and is the only decorative
shape in the system. Amber for client-facing sections, indigo for studio and
structural ones, matching v1's accent meaning.

**Tag.** Status only. Amber dot for live or beta, indigo for in development.
Tech stack lists are not tags in v2; they belong on the project page as text.

**Form.** Fields are a label over a single underline, not boxes: the form reads
as a document being filled in. Focus turns the underline indigo. The inquiry
form posts to the same `submitInquiry` Server Action as the live site and
carries the same honeypot, `startedAt` timing field and analytics event, so the
spam screen and lead tracking behave identically.

**Prose.** `.nd-prose` styles compiled markdown: headings, lists, code, tables,
images, blockquotes (set in the serif voice with an amber rule) and the
`.callout` blocks the markdown pipeline emits.

**Split frame.** The signature element. Two images cut by the logo's slash:
client work on the amber side, studio products on the indigo side. The clip
points assume a 2.2:1 frame (the lean is 16/70 of the height, as in the logo,
which is a 10.4% run at that ratio). If the aspect ratio changes, recompute the
polygon. Below 760px it becomes two stacked 16:10 frames with no cut.

## 6. Accessibility

- Text colours were chosen for AA on their own ground: ink-3 on paper and
  on-night-3 on night are the lightest text allowed.
- Focus is a 2px `--nd-link` outline with 3px offset, on both grounds.
- Every interactive element is at least 44px tall.
- The mobile menu is a native `<details>`, so it works without JavaScript.
- Decorative images use `alt=""`; the split frame links carry an `aria-label`.

Contrast was reasoned from the HSL values, not measured with a tool. Run a
proper audit before adoption.

## 7. Pages

Every live route has a Paper counterpart at the same path under `/paper`.

| Route | Notes |
|---|---|
| `/paper` | Landing page |
| `/paper/work`, `/paper/studio` | Work cards in a two-column grid |
| `/paper/work/[slug]`, `/paper/studio/[slug]` | Shared `ProjectDetail`: cover, highlights as a facts row, description with stack, numbered feature list, next project |
| `/paper/process` | Four phases as large rows, then capabilities |
| `/paper/contact` | Details column and the inquiry form. Footer only, since the page is already the ask |
| `/paper/blog`, `/paper/blog/[slug]` | Row index; a 44rem reading column for posts |
| `/paper/privacy` | Same copy as live, re-marked-up |
| `/paper/system` | The living reference |

Not carried over from the live pages: per-page SEO metadata and OG images (the
drafts are `noindex`, so each page sets a title only), breadcrumb and
`BlogPosting` JSON-LD, and the blog image lightbox. All three need restoring at
promotion; the live pages are the reference for each.

## 8. Building the library from here

Suggested order. Each step is shippable on its own.

1. **Move tokens into Tailwind's theme.** The project is on Tailwind 4, so the
   primitives become `@theme` entries in `globals.css` (`--color-paper`,
   `--color-ink`, `--font-serif`, and so on) and the semantic layer becomes a
   small set of variables remapped by a `data-ground="night"` attribute. The
   `nd-` prefix exists only to keep the draft from colliding with v1 and
   should be dropped.
2. **Extract primitives.** `Button`, `TextLink`, `Label`, `Eyebrow`, `Tag`,
   `Mark` into `app/components/ui/`. These have no layout opinions and are the
   ones every page needs.
3. **Extract patterns.** `SectionHead`, `Rows`/`Row`, `WorkCard`, `Steps`,
   `Facts`, `SplitFrame`, `Nav`, `Closing` into `app/components/patterns/`.
4. **Keep `/paper/system` as the permanent reference** (for example `/system`,
   kept `noindex`). It renders every token and component from the real CSS, so
   it cannot drift from the code.
5. **Promote the pages.** They are already built; see
   [README.md](README.md#promoting-a-draft) for the move. Restore the SEO
   metadata, JSON-LD and lightbox listed in section 7 as part of it.
6. **Delete v1 chrome** once no route uses it: preloader, doors, floating
   trigger, full-screen menu, marquee, cursor spotlight, horizontal scroll,
   Lenis, and Framer Motion if nothing else needs it.
7. **Rewrite `BRAND.md`** sections 2, 3, 7 and 8 from this file, and regenerate
   the assets that encode the old look (project covers, social banners, OG
   images).

## 9. Adopting it

Open decisions that are not design questions and should be settled first:

- **Project covers.** The current covers are dark, with the v1 amber and indigo
  bars baked in. They work inside dark frames on paper, but a v2 cover template
  (plain night ground, larger screenshot) would look more deliberate. This is a
  change to `scripts/generate-project-covers.mjs`.
- **Bitcount.** v2 drops it entirely. If it is considered part of the identity
  rather than the website, it could survive in the wordmark only.
- **Dark mode.** The semantic layer makes a full night theme cheap. Whether to
  offer it is a product choice.
- **Proof.** The largest gap between this page and a top-tier agency site is
  not visual. It is a named client quote, an outcome that can be pointed at,
  and a stated engagement shape (minimum size, typical length). The layout has
  room for all three; none were invented for the draft.
