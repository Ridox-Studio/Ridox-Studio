/**
 * Generates every logo variant from the single source SVG.
 *
 * The mark has changed once already, and hand-exported rasters silently went
 * stale when it did — the old PNG kept shipping as the iOS icon with seed dots
 * the SVG no longer had. Run this instead of exporting by hand:
 *
 *   npm run logos
 *
 * Source of truth: public/logos/ridox-studio-logo.svg
 */
import sharp from "sharp";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const SOURCE = "public/logos/ridox-studio-logo.svg";
const SVG_OUT = "public/logos";
const PNG_OUT = "public/logos/png";

/** Backgrounds, named for where they are used rather than for their colour. */
const VARIANTS = {
  // Transparent — the default. Use over any brand surface.
  transparent: null,
  // Light — for white/printed contexts, invoices, light-theme third parties.
  light: { r: 255, g: 255, b: 255 },
  // Dark — --bg-void. Matches the site and the iOS home screen.
  dark: { r: 8, g: 6, b: 18 },
};

/** Covers favicons, app icons and print. */
const SIZES = [32, 64, 128, 180, 192, 256, 512, 1024];

/**
 * Social profile photos are a different problem from icons:
 *
 * - Almost every platform crops them to a CIRCLE (X, Instagram, Facebook) or a
 *   heavily rounded square (LinkedIn, GitHub), so the corners are lost.
 * - Transparency is unreliable — platforms flatten it onto white or black with
 *   no way to predict which, so these always ship on a solid ground.
 * - The mark is drawn with generous padding for use as an inline logo. At
 *   avatar scale, inside a circular crop, that padding makes it look tiny, so
 *   the frame is tightened around the mark.
 *
 * Sizes: 400 is X's recommendation, 512 suits LinkedIn and GitHub, 1024 is the
 * safe upload master everywhere.
 */
const PROFILE_SIZES = [400, 512, 1024];

/**
 * Share of the frame the mark occupies.
 *
 * The mark's extreme corners sit on the diagonal — amber's top-left, indigo's
 * bottom-right — so a circular crop cuts them unless the whole bounding box
 * fits inside the inscribed circle. That needs fill <= 1/sqrt(2) = 0.707.
 * 0.66 clears it with breathing room, which an avatar wants anyway.
 */
const PROFILE_FILL = 0.66;

/** The mark sits inside a 100x100 viewBox with its own padding built in. */
async function makeSvgVariant(source, background) {
  if (!background) return null;
  const { r, g, b } = background;
  const fill = `rgb(${r}, ${g}, ${b})`;
  // Inject a full-bleed rect as the first child so it paints behind the mark.
  return source.replace(
    /(<svg[^>]*>)/,
    `$1\n  <rect width="100" height="100" fill="${fill}" />`,
  );
}

async function main() {
  const source = await readFile(SOURCE, "utf8");
  await mkdir(PNG_OUT, { recursive: true });

  let written = 0;

  for (const [name, background] of Object.entries(VARIANTS)) {
    // A vector variant per background, for anywhere that can take an SVG.
    const svg = await makeSvgVariant(source, background);
    if (svg) {
      const file = path.join(SVG_OUT, `ridox-studio-logo-${name}.svg`);
      await writeFile(file, svg, "utf8");
      written += 1;
    }

    const input = svg ?? source;

    for (const size of SIZES) {
      const pipeline = sharp(Buffer.from(input), { density: 600 }).resize(size, size, {
        fit: "contain",
        background: background
          ? { ...background, alpha: 1 }
          : { r: 0, g: 0, b: 0, alpha: 0 },
      });

      if (background) pipeline.flatten({ background });

      await pipeline
        .png({ compressionLevel: 9 })
        .toFile(path.join(PNG_OUT, `ridox-studio-logo-${name}-${size}.png`));
      written += 1;
    }
  }

  // --- Social profile photos -------------------------------------------
  //
  // The mark's own bounding box inside the 100x100 viewBox. Tightening the
  // viewBox around it scales the mark up without touching the artwork.
  const MARK = { min: 22, max: 78 };
  const markSize = MARK.max - MARK.min;
  const frame = markSize / PROFILE_FILL;
  const origin = 50 - frame / 2;
  const viewBox = `${origin} ${origin} ${frame} ${frame}`;

  const socialDir = path.join(SVG_OUT, "social");
  await mkdir(socialDir, { recursive: true });

  for (const [name, background] of Object.entries(VARIANTS)) {
    // Transparent is deliberately skipped: platforms flatten it unpredictably.
    if (!background) continue;

    const { r, g, b } = background;
    const cropped = source
      .replace(/viewBox="[^"]*"/, `viewBox="${viewBox}"`)
      .replace(
        /(<svg[^>]*>)/,
        `$1\n  <rect x="${origin}" y="${origin}" width="${frame}" height="${frame}" fill="rgb(${r}, ${g}, ${b})" />`,
      );

    await writeFile(
      path.join(socialDir, `ridox-studio-profile-${name}.svg`),
      cropped,
      "utf8",
    );
    written += 1;

    for (const size of PROFILE_SIZES) {
      await sharp(Buffer.from(cropped), { density: 600 })
        .resize(size, size, { fit: "contain", background: { r, g, b, alpha: 1 } })
        .flatten({ background })
        .png({ compressionLevel: 9 })
        .toFile(path.join(socialDir, `ridox-studio-profile-${name}-${size}.png`));
      written += 1;
    }
  }

  // Keep the two consumed by the app in step with the source.
  await sharp(Buffer.from(source), { density: 600 })
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile("public/logos/ridox-studio-logo.png");

  // iOS renders transparency as black, so the app icon is flattened onto --bg-void.
  await sharp(Buffer.from(source), { density: 600 })
    .resize(180, 180, { fit: "contain", background: { r: 8, g: 6, b: 18, alpha: 1 } })
    .flatten({ background: { r: 8, g: 6, b: 18 } })
    .png({ compressionLevel: 9 })
    .toFile("app/apple-icon.png");

  console.log(`Generated ${written + 2} logo assets from ${SOURCE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
