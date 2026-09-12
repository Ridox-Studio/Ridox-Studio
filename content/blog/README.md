# Blog content

Each post is one markdown file here, named `<slug>.md`. The filename becomes
the URL at `/blog/<slug>`.

## Frontmatter

```yaml
---
title: What actually breaks when a school platform holds your money
description: Why RISMS never takes custody of a school's fees, and what we found in the code that made the decision for us.
date: 2026-08-14
updated: 2026-08-20      # optional, omit if never revised
tags: [risms, payments, architecture]
draft: false             # optional, true hides it from the site (still readable in dev)
pinned: false            # optional, true always sorts this post first, ahead of date order
---
```

`description` is the search-snippet and social-card text, so keep it under
~155 characters and make it stand on its own. A reader decides whether to
click from this line alone.

## Writing

- Plain Markdown, GitHub-flavoured: tables, ~~strikethrough~~, task lists.
- GitHub-style callouts work:
  ```md
  > [!NOTE]
  > Text here.
  ```
  Supported types: `NOTE`, `TIP`, `WARNING`, `IMPORTANT`, `CAUTION`.
- Content is first-party only, written by us. The renderer trusts it enough
  to pass through raw HTML; never wire this pipeline to anything a visitor
  can submit without adding sanitisation first.
- Never invent a number or a claim that is not true of the shipped product,
  the same rule that governs `app/data/projects.ts` applies here.
- Avoid the em dash (`—`). It is a strong tell of AI-written text, and this
  content is meant to read as written by us. Use a comma, a period, or a
  parenthetical instead.

## Rebuilding

Nothing to run. `app/lib/blog.ts` reads this directory directly at request
time (build time in production, since these are static routes).
