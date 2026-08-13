import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/app/lib/og";

export const alt = "Contact — Ridox Studio";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    overline: "Contact",
    title: "Start a Reaction",
    subtitle: "Tell us what you are building and what is in the way.",
  });
}
