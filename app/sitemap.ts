import type { MetadataRoute } from "next";
import { getAllProjects } from "@/app/data/projects";
import { SITE } from "@/app/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectUrls = getAllProjects().map((project) => ({
    url: `${SITE.url}/${project.category === "client" ? "work" : "studio"}/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: SITE.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE.url}/work`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/studio`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/process`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    ...projectUrls,
  ];
}
