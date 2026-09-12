import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/app/lib/og";

export const alt = "The blog — Ridox Studio";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    overline: "The blog",
    title: "Decisions, not adjectives",
    subtitle: "What we found in the code, and why we built it that way.",
    cta: "Read the posts",
    accent: "indigo",
  });
}
