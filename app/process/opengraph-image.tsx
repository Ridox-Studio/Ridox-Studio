import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/app/lib/og";

export const alt = "Process — Ridox Studio";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    overline: "The process",
    title: "Four phases",
    subtitle: "Discovery, architecture, engineering, equilibrium.",
  });
}
