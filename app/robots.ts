import type { MetadataRoute } from "next";
import { SITE } from "@/app/lib/site";

// AI assistant / training crawlers, allowed explicitly so the choice is on the
// record and easy to reverse. We want the studio to be citable in ChatGPT,
// Claude, Perplexity and Google's AI surfaces — see also /llms.txt.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
