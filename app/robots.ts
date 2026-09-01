import type { MetadataRoute } from "next";
import { SITE } from "@/app/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
