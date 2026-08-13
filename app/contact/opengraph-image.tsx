import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/app/lib/og";

export const alt = "Contact — Ridox Studio";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    overline: "Contact",
    title: "Start a Reaction",
    subtitle: "Tell us what you are building and what is in the way.",
    // Not a repeat of the title — and not "book a call": the ask here is to
    // send a brief, which costs the reader nothing and gets us more signal.
    cta: "Send us the brief",
  });
}
