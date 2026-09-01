import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/app/lib/og";

export const alt = "Studio products — Ridox Studio";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    overline: "Studio products",
    title: "Our own reactions",
    subtitle: "Tools we built for ourselves first.",
    cta: "Explore the tools",
  });
}
