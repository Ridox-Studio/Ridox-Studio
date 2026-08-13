import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/app/lib/og";

export const alt = "Client work — Ridox Studio";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    overline: "Client work",
    title: "Case studies",
    subtitle: "Systems built under real constraints.",
    cta: "Read the case studies",
    accent: "indigo",
  });
}
