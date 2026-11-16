# Design drafts

Two redesign proposals live in this repository alongside the current site.
Neither is linked from it, indexed, or in the sitemap. The current site is
unchanged and still served from its usual URLs.

| Draft | URL | Pages built | Doc |
|---|---|---|---|
| **Paper** | `/paper` | All of them | [PAPER.md](PAPER.md) |
| **Noir** | `/noir` | All of them | [NOIR.md](NOIR.md) |

Paper is the editorial direction: light, two typefaces, persuasive. Noir is the
higher-posture direction: black, one typeface at two widths, almost no colour.
They share the brand idea, the logo colours and all of the copy.

## How a draft is organised

Each draft is one route group. The group name is the design name, and so is the
URL prefix.

```
app/
  (paper)/                  route group: adds nothing to the URL
    layout.tsx              fonts, stylesheet, wrapper, draft strip, nav
    paper.css               every token and component style, scoped to .nd
    _components/            shared pieces (underscore = not routable)
    _lib/paths.ts           BASE = "/paper", and the to() link helper
    paper/                  the URL prefix
      page.tsx              /paper
      work/page.tsx         /paper/work
      work/[slug]/page.tsx  /paper/work/netcart
      ...                   mirrors the live route tree exactly
  (noir)/                   same shape, scoped to .nx, BASE = "/noir"
```

Three rules keep a draft movable:

1. **The inner folder mirrors the live route tree.** `/paper/work/[slug]` is
   the future `/work/[slug]`. Nothing is named after the draft except the one
   prefix folder.
2. **Every internal link goes through `to()`** from the draft's
   `_lib/paths.ts`. No page hard-codes its prefix.
3. **Every style is scoped** under the draft's wrapper class (`.nd` or `.nx`),
   because Next keeps a route's stylesheet loaded after a client-side
   navigation away from it.

Pages reuse the live data layer untouched: `app/data/*`, `app/lib/blog`,
`app/lib/site`, and the contact Server Action. A content change shows up in
the live site and both drafts at once.

## What the drafts touch outside their folders

| File | Change | Why |
|---|---|---|
| `app/components/providers/SiteShell.tsx` | Returns children untouched under `/paper` and `/noir` | Keeps the live preloader, floating menu, page doors and smooth scroll out of the drafts |
| `next.config.ts` | Temporary redirect `/new-design` → `/paper` | The first draft was shared at that URL |

That is the whole footprint.

## Promoting a draft

Using Paper as the example.

1. Set `BASE = ""` in `app/(paper)/_lib/paths.ts`.
2. Move everything in `app/(paper)/paper/` up one level into `app/(paper)/`,
   and delete the now-empty `paper/` folder. The group now serves `/`,
   `/work`, and so on.
3. Delete the live pages those routes collide with (`app/page.tsx`,
   `app/work/`, `app/studio/`, `app/process/`, `app/contact/page.tsx`,
   `app/blog/`, `app/privacy/`). Keep `app/contact/actions.ts`, the OG image
   routes, `robots.ts`, `sitemap.ts` and `manifest.ts`.
4. In `app/(paper)/layout.tsx`, remove the `robots: noindex` metadata and the
   `<DraftStrip />`.
5. Restore per-page metadata with `buildPageMetadata`, the JSON-LD blocks, and
   the blog lightbox. The deleted live pages are the reference; take them from
   git history.
6. Remove the draft guard in `SiteShell.tsx`, then delete the v1 chrome nothing
   uses any more.
7. Remove the `/new-design` redirect and delete the other draft's group.
8. Fold the adopted doc into `BRAND.md` and regenerate covers, banners and OG
   images.

Steps 1 and 2 are the move itself. The rest is cleanup that can follow.

## Removing a draft

Delete its route group folder, its doc here, and its prefix from
`DRAFT_PREFIXES` in `SiteShell.tsx`. Nothing else references it.

## Adding another draft

Copy the shape: `app/(name)/layout.tsx`, a scoped stylesheet with its own
class prefix, `_lib/paths.ts` with `BASE = "/name"`, and `app/(name)/name/`.
Add `"/name"` to `DRAFT_PREFIXES`.
