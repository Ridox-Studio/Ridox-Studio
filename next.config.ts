import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";

// next.config.ts runs BEFORE Next loads .env.local into process.env (this is
// documented Next.js behaviour, not a bug) — without this, NEXT_PUBLIC_WP_SERVER
// reads as undefined here even though every other file in the app sees it fine,
// silently leaving remotePatterns empty and WordPress cover images 404ing
// through next/image. loadEnvConfig is Next's own supported workaround for
// needing an env var inside next.config.ts itself.
loadEnvConfig(process.cwd());

/**
 * Under BLOG_SOURCE=wordpress, cover images (post._embedded featured media)
 * are next/image'd straight from the WordPress media library, which is a
 * different origin than this app — next/image refuses any remote host that
 * isn't explicitly allow-listed. Derived from NEXT_PUBLIC_WP_SERVER itself
 * rather than a second env var, so there's only one place to configure the
 * WordPress origin. Returns [] (no remote images allowed) when unset, which
 * is also the correct behaviour in markdown mode.
 */
function wpImagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const raw = process.env.NEXT_PUBLIC_WP_SERVER;
  if (!raw) return [];

  try {
    const { protocol, hostname } = new URL(raw);
    return [{ protocol: protocol.replace(":", "") as "http" | "https", hostname }];
  } catch {
    console.warn(`[next.config] NEXT_PUBLIC_WP_SERVER is not a valid URL: "${raw}"`);
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Project covers are first-party SVGs in /public/projects. The CSP below
    // keeps them inert (no scripts, no external fetches) when served.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: wpImagePatterns(),
    // Next.js's image optimizer refuses to fetch from a hostname that
    // resolves to a private/loopback IP (SSRF protection) — correct, and
    // never needed against a real WordPress domain. It only bites when
    // NEXT_PUBLIC_WP_SERVER points at a hosts-file-mapped local dev domain
    // (e.g. wp.local -> 127.0.0.1), so it's opt-in via its own var and never
    // defaulted on — see docs/BLOG_WORDPRESS_SETUP.md.
    dangerouslyAllowLocalIP: process.env.WP_ALLOW_LOCAL_IMAGE_HOST === "true",
  },
};

export default nextConfig;
