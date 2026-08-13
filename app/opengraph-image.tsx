import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/app/lib/og";

export const alt = "Ridox Studio — Software systems engineered at the reaction point";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    overline: "Software engineering agency",
    title: "Engineered at the reaction point",
    subtitle: "Balancing design energy with engineering depth.",
    cta: "See the work",
  });
}
