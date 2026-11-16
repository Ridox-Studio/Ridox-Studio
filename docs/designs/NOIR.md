# Noir — design draft

**Status:** proposal, on branch `redesign/new-design-draft`. Every page of the
site is built. For how drafts are organised, promoted and removed, see
[README.md](README.md). The other draft is [Paper](PAPER.md).

| | |
|---|---|
| Live draft | `/noir` |
| Pages | Same route tree as the live site, under `/noir` (see section 5) |
| Living reference | `/noir/system` |
| Tokens and component styles | [`app/(noir)/noir.css`](<../../app/(noir)/noir.css>) |
| Shared pieces | [`app/(noir)/_components/chrome.tsx`](<../../app/(noir)/_components/chrome.tsx>) |
| Base path | [`app/(noir)/_lib/paths.ts`](<../../app/(noir)/_lib/paths.ts>) |

---

## 1. The brief

Paper answered "look like a studio that takes six-figure projects". Noir
answers the next tier up: a firm on retainer with a few large clients, which
does not need to explain itself.

The difference between the two tiers is posture, not polish. Paper persuades:
it has ledes, captions, a filled amber button, a section of commitments. Noir
assumes the visitor already knows why they came. It says less, sets it larger,
and puts the work on screen before any claim about it.

| | Paper | Noir |
|---|---|---|
| Posture | A studio you would enjoy hiring | A firm you apply to work with |
| Ground | Light paper, one night band | Black throughout, one lifted band |
| Voices | Two typefaces | One typeface, two widths |
| Scale | Display to about 7rem, body 17px | Display to 12.5rem, body 15px |
| Colour | One amber action per view | One amber glyph per page |
| Work | Framed cards with captions | Full-bleed reel, then a typographic index |
| Shape | 4px and 8px radii | None |
| Action | Amber button | White button |

## 2. The idea, in one typeface

Paper moved the redox duality from colour into two typefaces. Noir moves it
into the width axis of one.

- **Expanded Archivo** (`wdth` 125) is oxidation: the statement, at
  architectural scale.
- **Condensed Archivo** (`wdth` 70) is reduction: every label, in caps, at the
  smallest legible size.
- **The slash** between "We build it" and "You run it" is the reaction point,
  and it is the only amber on the page.

This is closer to the v1 brand than Paper is. `BRAND.md` already says the
character of the headings "comes from the width axis"; Noir keeps the width
and drops the weight from 900 to 500. It also adds no fonts: Archivo and Inter
are already loaded by the root layout.

## 3. Tokens

CSS custom properties on `.nx`, prefixed `--nx-`. Noir has a single ground, so
there is no separate semantic layer yet. If a light variant is ever wanted,
introduce one the way Paper does.

```
Ground (all hue 258)
--nx-void         hsl(258 40% 3.5%)   page
--nx-raise        hsl(258 32% 6.5%)   one band per page, cell hover
--nx-raise-2      hsl(258 26% 10%)    reserved for overlays
--nx-line         hsl(258 22% 14%)    hairlines
--nx-line-strong  hsl(258 16% 26%)    list heads, phase numerals
--nx-ghost        hsl(258 24% 11%)    footer wordmark

Light
--nx-fg           hsl(258 50% 97%)    headings, the button
--nx-fg-2         hsl(258 14% 68%)    body copy
--nx-fg-3         hsl(258 10% 50%)    labels, the second clause of a statement

Sources
--nx-amber        hsl(33 95% 52%)     the slash
--nx-indigo       hsl(258 89% 62%)    in-development status dot
--nx-indigo-soft  hsl(258 89% 78%)    journal title hover
```

### Colour rules

1. **Amber is the slash and nothing else.** Not a button, not a hover, not a
   status. The reference page uses it once more as a list marker; a production
   page should not.
2. Every neutral stays on the indigo hue. No pure black or white.
3. Hierarchy is three greys and size. Never a tint.
4. Images in lists sit desaturated at 70% and take colour on hover. On touch
   devices they are always in colour.

### Type

| Style | Class | Size | Weight | Width | Tracking | Leading |
|---|---|---|---|---|---|---|
| Mega | `.nx-mega` | `clamp(2.5rem, 0.2rem + 9.4vw, 12.5rem)` | 500 | 125 | -0.045em | 0.92 |
| Title | `.nx-title` | `clamp(2.25rem, 0.8rem + 5.6vw, 6.5rem)` | 500 | 125 | -0.04em | 0.95 |
| Statement | `.nx-statement` | `clamp(1.625rem, 0.9rem + 2.9vw, 3.5rem)` | 400 | 100 | -0.032em | 1.12 |
| Heading 3 | `.nx-h3` | `clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem)` | 500 | 112 | -0.025em | 1.15 |
| Body | `.nx-body` | 0.9375rem | 400 | Inter | 0 | 1.6 |
| Label | `.nx-label` | 0.75rem, caps | 500 | 70 | +0.11em | 1.3 |

**The statement pattern.** A `.nx-statement` is one sentence in white followed
by a `<span>` in `--nx-fg-3`. The first clause is the claim; the grey clause
is the qualification. It replaces Paper's heading-plus-lede pair with a single
element.

`.nx-mega` does not wrap. Its clamp is tuned so "/ You run it." fits a 320px
viewport; a longer headline needs the clamp retuned.

### Space, shape, motion

Same 4px scale as Paper (`--nx-1` to `--nx-24`). Differences:

- Section padding is larger: `clamp(5rem, 2rem + 11vw, 13rem)`.
- Content runs to 1760px, with 1.25rem / 2.5rem gutters. The reel ignores both.
- **No radii and no shadows anywhere.** Buttons are rectangles.
- Twelve columns from 900px. Labels sit in columns 1 to 3, content in 4 to 12.
- Motion: one staggered rise on the hero, 200ms colour changes, 700ms image
  changes on the redox curve. All of it stands down under reduced motion.

## 4. Components

| Component | Classes | Notes | Library API (proposed) |
|---|---|---|---|
| Button | `.nx-btn`, `--ghost` | White fill, inverts on hover | `<Button variant href?>` |
| Link | `.nx-link` | Label with a rule that lengthens on hover | `<RuleLink href>` |
| Label | `.nx-label`, `--fg`, `--num` | Condensed caps | `<Label tone numeric?>` |
| Status | `.nx-status`, `--live`, `--building` | Dot plus label | `<Status value>` |
| Band head | `.nx-grid.nx-bandhead` | Index, label, statement, action | `<BandHead index label action>` (exists) |
| Reel | `.nx-reel` | Full-bleed image with a caption bar | `<Reel project>` |
| Index | `.nx-index` | Project names at title size; siblings dim on hover | `<Index projects>` |
| Cells | `.nx-cells`, `.nx-cell` | Shared 1px rules via gap over a line ground | `<Cells>`, `<Cell>` |
| Phases | `.nx-phases`, `.nx-phase` | Outsized light numerals | `<Phases steps>` |
| Tenets | `.nx-tenets` | Three ruled columns | `<Tenets items>` |
| Posts | `.nx-posts`, `.nx-post` | Date, title, length on the grid | `<Posts posts>` |
| End | `.nx-end` | The ask, links, and the wordmark | `<End>` (exists) |

**Index.** The signature element. Each project is a row whose title is set at
`.nx-title` size. Hovering one row drops the others to 32% opacity and brings
that row's thumbnail into colour.

**End wordmark.** "RIDOX" at 21.4vw in `--nx-ghost`, sunk a tenth of an em below
the bottom edge. The size is tuned to the five letters at `wdth` 125; changing
the word or the width means retuning it.

## 5. Pages

Every live route has a Noir counterpart at the same path under `/noir`.

| Route | Notes |
|---|---|
| `/noir` | Landing page |
| `/noir/work`, `/noir/studio` | The project index, set at title size |
| `/noir/work/[slug]`, `/noir/studio/[slug]` | Shared `ProjectDetail`: wide title, full-bleed cover, highlights as cells, description as a statement, numbered features on the 12-column grid, next project at title size |
| `/noir/process` | Phases with outsized numerals, then capabilities as cells |
| `/noir/contact` | Details in the label column, underlined fields in the main column, square white submit button. Footer without the closing ask, since the page is the ask |
| `/noir/blog`, `/noir/blog/[slug]` | Row index with descriptions; 44rem reading column for posts |
| `/noir/privacy` | Same copy as live, re-marked-up |
| `/noir/system` | The living reference |

The inquiry form posts to the same `submitInquiry` Server Action as the live
site and carries the same honeypot, `startedAt` field and analytics event.

**Mobile.** Below 900px the nav is the brand, the word "Menu" and nothing else.
Opening it shows a full-screen black panel of four links at display size. It is
a native `<details>`, so it works without JavaScript. The panel hangs off the
nav (`position: absolute`) because the nav's backdrop blur makes it the
containing block for positioned children.

Not carried over from the live pages, as in Paper: per-page SEO metadata and OG
images, breadcrumb and `BlogPosting` JSON-LD, and the blog image lightbox.

## 6. Open questions

- **Covers.** The reel shows a project cover at full bleed. The current covers
  were made for cards and carry the v1 diagonal bars. Noir needs covers
  composed for a 2.1:1 frame, ideally plain screenshots on the void ground.
- **Posture versus proof.** Noir's restraint only reads as confidence if the
  work behind it holds up at this scale. With six projects, three of them
  in development, the index is honest but short. Paper is the lower-risk
  choice today; Noir fits better once there are more shipped, named
  engagements to list.
