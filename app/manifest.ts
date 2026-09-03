import type { MetadataRoute } from "next";
import { SITE } from "@/app/lib/site";

/**
 * Served at /manifest.webmanifest with the <link rel="manifest"> injected
 * automatically. Gives Google a second, machine-readable statement of the
 * site name + icons, and makes the site installable on Android/desktop.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — Software Development & Engineering Agency`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#080612",
    theme_color: "#0d0b1a",
    icons: [
      {
        src: "/logos/png/ridox-studio-logo-dark-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logos/png/ridox-studio-logo-dark-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/logos/png/ridox-studio-logo-transparent-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
