# Project screenshots

Drop raw screenshots here, named after the project slug, then run:

```bash
npm run covers
```

They are composited onto the branded background and written to
`public/projects/<slug>.png`.

## Naming

| File | Result |
|---|---|
| `cilbup.png` | One screenshot, centred |
| `netcart-1.png`, `netcart-2.png`, `netcart-3.png` | Laid out side by side |

Any slug without a screenshot keeps its generated placeholder, so it is safe to
run with a partial set.

## What to capture

Landscape browser shots at 1440x900 or wider. Phone screenshots are fine — they
are portrait, so give a project two or three and they will sit side by side.

Everything lands inside the centred safe box. Covers render with `object-cover`
into panes whose aspect ratio changes with the viewport, so the edges are
cropped by an unpredictable amount — never rely on anything near an edge.

## Afterwards

1. Point `coverImage` at the `.png` in `app/data/projects.ts`.
2. Clear `.next/cache/images` — the image optimizer keys on the path, so
   editing an image in place keeps serving the old one.
