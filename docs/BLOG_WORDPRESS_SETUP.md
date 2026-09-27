# Switching the blog to WordPress

The blog has two interchangeable sources behind one adapter interface
(`app/lib/blog/`): **markdown** (`content/blog/*.md`, the default — needs no
setup) and **WordPress** (a REST API). Which one is live is controlled by a
single env var. No page or component needs to know which is active.

```
app/lib/blog/
├── types.ts       shared BlogPostMeta / BlogPost contract
├── markdown.ts     adapter A — content/blog/*.md (default)
├── wordpress.ts    adapter B — WordPress REST API
└── index.ts        the switch — reads BLOG_SOURCE, picks one
```

No custom WordPress plugin is required — only WordPress core (posts,
categories, tags, media are REST-enabled by default) plus, optionally, Yoast
SEO.

## 1. Point WordPress at a real, public, HTTPS domain

WordPress needs to be reachable at a public URL — e.g.
`https://blog.ridoxstudio.com`. A `.local`/hosts-file domain only works for
local testing (see the note at the end of this doc) and should never be used
in production.

## 2. Install and enable Yoast SEO (optional, but recommended)

1. In WordPress admin: **Plugins → Add New**, search "Yoast SEO", install
   and activate.
2. That's it — no further config needed. Modern Yoast (v20+) automatically
   adds a `yoast_head_json` field to every post in the REST API
   (`/wp-json/wp/v2/posts`) once it's active. There's no "enable REST
   output" toggle to hunt for in current versions.
3. Confirm it's live:
   ```bash
   curl https://your-wp-site.com/wp-json/wp/v2/posts?per_page=1 | grep -o '"yoast_head_json"'
   ```
   If Yoast isn't installed, the blog still works fine — descriptions and
   OG data fall back to WordPress's own excerpt/title.

## 3. Set the two env vars

In Vercel (or wherever this app is deployed) and in `.env.local` for local
dev:

```
BLOG_SOURCE=wordpress
NEXT_PUBLIC_WP_SERVER=https://blog.ridoxstudio.com/wp-json
```

- `BLOG_SOURCE` — `wordpress` switches the adapter. Any other value, or
  leaving it unset, keeps the markdown source (today's behaviour).
- `NEXT_PUBLIC_WP_SERVER` — the WordPress REST API base, **including
  `/wp-json`**. Only read when `BLOG_SOURCE=wordpress`.

Redeploy (or restart `next dev`) after changing either — `next.config.ts`
reads `NEXT_PUBLIC_WP_SERVER` at startup to allow-list the WordPress media
host for `next/image`, and that only happens once, at boot.

## 4. Verify

1. Visit `/blog` — posts should load from WordPress.
2. Visit a post — check the browser's page-source for:
   - `<link rel="canonical" ...>` pointing at the post's real portal URL
   - a `WebSite`/`BlogPosting` JSON-LD block
   - the featured image, if the post has one, loading through `/_next/image`
3. If something looks off, the WordPress adapter fails soft (empty list /
   404 on a single post, never a crash) and logs the real error to the
   server console with a `[blog/wordpress]` prefix — check there first.

## Switching back to markdown

Unset `BLOG_SOURCE` (or set it to anything other than `wordpress`) and
redeploy. `content/blog/*.md` takes over immediately — nothing else to
undo.

## Notes for anyone testing against a local WordPress instance

A `.local`/hosts-file-mapped WordPress domain (e.g. `wp.local` resolving to
`127.0.0.1`) hits two things that never come up against a real WP host:

- **Application Passwords require HTTPS.** WordPress will refuse to
  generate one over plain HTTP unless `WP_ENVIRONMENT_TYPE` is set to
  `local` or `development` in `wp-config.php`. This only matters if you're
  writing to WordPress (e.g. seeding test posts via the REST API) — it has
  nothing to do with the blog reading posts, which is always unauthenticated.
- **`next/image`'s SSRF protection blocks private/loopback IPs by default**
  (correctly — this protects a real deployment). A `.local` domain that
  resolves to `127.0.0.1` trips it. There's a narrow, opt-in-only escape
  hatch for exactly this case:
  ```
  WP_ALLOW_LOCAL_IMAGE_HOST=true
  ```
  Leave this **unset** for any real deployment — it only exists so a local
  WordPress instance's images can be previewed during development.

## What's deliberately out of scope

- **Pagination.** The WordPress adapter fetches up to 50 posts per index
  read, same "no pagination" behaviour the markdown source has always had.
  Revisit if the post count grows past that.
- **Custom WordPress plugin code.** Everything here works against stock
  WordPress + Yoast. If a future need requires more (e.g. a custom field),
  extend `app/lib/blog/wordpress.ts`'s `toMeta()`/`WPPost` type rather than
  writing a WordPress plugin.
- **Write access.** The integration is read-only. Application Passwords are
  only relevant for whoever is seeding/testing content directly against the
  REST API, not for anything this app itself does.
