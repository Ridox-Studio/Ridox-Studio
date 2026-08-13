import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const AMBER = "hsl(33, 95%, 52%)";
const INDIGO = "hsl(258, 89%, 62%)";
const VOID = "#080612";
const TEXT = "#f0eeff";
const MUTED = "#9b90c2";

/**
 * Section 14.4 — every route renders its own 1200x630 card at request time
 * instead of shipping hand-made PNGs that drift out of date.
 */
export function renderOgImage({
  overline,
  title,
  subtitle,
  cta,
  accent = "amber",
}: {
  overline: string;
  title: string;
  subtitle?: string;
  /**
   * The next step this card invites. Keep it matched to the page — a stranger
   * seeing the homepage in a feed is not ready for "book a call", but they
   * will click "see the work".
   */
  cta?: string;
  accent?: "amber" | "indigo";
}) {
  const accentColor = accent === "amber" ? AMBER : INDIGO;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: VOID,
          padding: 72,
          position: "relative",
        }}
      >
        {/* Diagonal slash — the logo's cut, scaled to the card */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -120,
            width: 700,
            height: 1100,
            transform: "rotate(20deg)",
            background: `linear-gradient(180deg, ${AMBER}22, ${INDIGO}22)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -200,
            right: 220,
            width: 26,
            height: 1100,
            transform: "rotate(20deg)",
            background: accentColor,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 28, height: 28, background: AMBER }} />
          <div style={{ display: "flex", width: 28, height: 28, background: INDIGO }} />
          <span
            style={{
              color: TEXT,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Ridox Studio
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 820 }}>
          <span
            style={{
              color: accentColor,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {overline}
          </span>
          <span
            style={{
              color: TEXT,
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </span>
          {subtitle ? (
            <span style={{ color: MUTED, fontSize: 30, lineHeight: 1.35 }}>{subtitle}</span>
          ) : null}

          {cta ? (
            // Sized to stay readable at the thumbnail scale feeds render at,
            // but kept subordinate to the title so the card does not read as
            // an advert.
            <div
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "flex-start",
                gap: 12,
                marginTop: 12,
                padding: "14px 28px",
                borderRadius: 999,
                border: `2px solid ${accentColor}`,
                color: accentColor,
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {cta}
              <span>→</span>
            </div>
          ) : null}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
