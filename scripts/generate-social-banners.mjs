/**
 * Generates social banner images in the site's own brand system.
 *
 *   npm run banners
 *
 * Text is converted to vector PATHS from the real Archivo variable font rather
 * than set as SVG <text>. SVG rasterisers resolve font-family against system
 * fonts, so <text> would silently render in whatever sans-serif the machine
 * happens to have — the banner would not be in our typeface, and would differ
 * per machine. Paths are exact and self-contained.
 *
 * The variable font is instanced to wdth 125 / wght 900 — the same expanded,
 * heavy cut the site sets its headings in.
 *
 * The font is fetched once and cached in .cache/fonts (gitignored).
 */
import sharp from "sharp";
import * as fontkit from "fontkit";
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const OUT = "public/logos/social/banners";
const FONT_CACHE = ".cache/fonts/Archivo-variable.ttf";
const FONT_URL =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/Archivo%5Bwdth,wght%5D.ttf";

const AMBER = "hsl(33, 95%, 52%)";
const INDIGO = "hsl(258, 89%, 62%)";
const VOID = "#080612";
const TEXT = "#f0eeff";
const MUTED = "#9b90c2";

/**
 * Platform banner specs.
 *
 * `safe` is the fraction of the height reliably visible after the platform's
 * own cropping — LinkedIn and Facebook re-crop covers per device, and X hides
 * part of the lower band behind profile chrome. Content stays inside it.
 *
 * `avatarCorner` shifts content clear of the overlapping profile photo.
 */
const BANNERS = [
  {
    name: "x-header",
    label: "X / Twitter header",
    width: 1500,
    height: 500,
    avatarCorner: "bottom-left",
    safe: 0.72,
    tagline: "ENGINEERED AT THE REACTION POINT",
  },
  {
    name: "linkedin-company-cover",
    label: "LinkedIn company page cover",
    width: 1128,
    height: 191,
    safe: 0.85,
    tagline: "ENGINEERED AT THE REACTION POINT",
  },
  {
    name: "linkedin-personal-cover",
    label: "LinkedIn personal background",
    width: 1584,
    height: 396,
    safe: 0.7,
    tagline: "SOFTWARE SYSTEMS ENGINEERED AT THE REACTION POINT",
  },
  {
    name: "facebook-cover",
    label: "Facebook page cover",
    width: 1640,
    height: 664,
    safe: 0.62,
    tagline: "SOFTWARE SYSTEMS ENGINEERED AT THE REACTION POINT",
  },
  {
    name: "github-social-preview",
    label: "GitHub social preview",
    width: 1280,
    height: 640,
    safe: 0.8,
    tagline: "SOFTWARE SYSTEMS ENGINEERED AT THE REACTION POINT",
  },
];

async function loadFont() {
  try {
    await access(FONT_CACHE);
  } catch {
    const response = await fetch(FONT_URL);
    if (!response.ok) throw new Error(`Font download failed: ${response.status}`);
    await mkdir(path.dirname(FONT_CACHE), { recursive: true });
    await writeFile(FONT_CACHE, Buffer.from(await response.arrayBuffer()));
  }
  // wdth 125 / wght 900 — the site's heading cut.
  return fontkit.openSync(FONT_CACHE).getVariation({ wght: 900, wdth: 125 });
}

/**
 * Lays out text as a single path in FONT UNITS, y-up. The caller applies
 * `scale(s, -s)` to flip it into SVG's y-down space at the size it wants.
 */
function layoutText(font, text, tracking = 0) {
  const run = font.layout(text);
  const parts = [];
  let x = 0;

  run.glyphs.forEach((glyph, index) => {
    const position = run.positions[index];
    parts.push(glyph.path.translate(x + (position.xOffset ?? 0), position.yOffset ?? 0).toSVG());
    x += position.xAdvance + tracking;
  });

  return { d: parts.join(" "), advance: x };
}

/**
 * Horizontal placement of the text block within the box.
 *
 *   npm run banners            → right (flush against the slash channel)
 *   npm run banners -- left     → left  (flush against the left margin)
 *   npm run banners -- center   → centred in the box
 *
 * A per-banner `align` in the spec wins over the CLI default, so individual
 * platforms can pin their own alignment while the rest follow the flag.
 */
const ALIGNMENTS = new Set(["left", "center", "right"]);

function resolveAlign(argv) {
  const flag = argv.find((arg) => ALIGNMENTS.has(arg));
  return flag ?? "right";
}

function buildBanner(font, { width, height, safe, avatarCorner, tagline: tagText, align }) {
  const em = font.unitsPerEm;
  const cy = height / 2;

  // The slash, bled off both edges and leaning at the logo's angle. Declared
  // first because it defines the right-hand boundary of the text box.
  const slashW = height * 0.15;
  const lean = height * 0.5;
  const slashX = width * 0.82;
  const slash = (offset, w) =>
    `M ${slashX + offset},${-height * 0.2} L ${slashX + offset + w},${-height * 0.2} ` +
    `L ${slashX + offset + w - lean},${height * 1.2} L ${slashX + offset - lean},${height * 1.2} Z`;

  // Text box: from the left margin to the slash's leftmost point (its bottom
  // edge, since it leans left as it descends), minus a gap. The avatar in the
  // lower-left corner (X header) only constrains the left margin when the text
  // is actually set left — right/centre clear it anyway.
  const boxLeft =
    align === "left" && avatarCorner === "bottom-left" ? width * 0.16 : width * 0.07;
  const boxRight = slashX - lean - width * 0.03;
  const boxWidth = boxRight - boxLeft;

  const wordmark = layoutText(font, "RIDOX STUDIO", -em * 0.02);
  const tagline = layoutText(font, tagText, em * 0.16);

  // Fit to the box rather than assuming the chosen size fits — the aspect
  // ratios here range from 2.5:1 to nearly 6:1, so one fixed size cannot work.
  const markSize = Math.min(
    height * safe * 0.4,
    width * 0.072,
    (boxWidth * em) / wordmark.advance,
  );
  const tagSize = Math.min(
    Math.max(markSize * 0.26, 11),
    (boxWidth * em) / tagline.advance,
  );

  const wordScale = markSize / em;
  const tagScale = tagSize / em;
  const wordWidth = wordmark.advance * wordScale;
  const tagWidth = tagline.advance * tagScale;

  // Place each line by the requested alignment. Right sits both lines hard
  // against the slash channel; left against the margin; centre in the box.
  const place = (lineWidth) => {
    if (align === "left") return boxLeft;
    if (align === "center") return boxLeft + (boxWidth - lineWidth) / 2;
    return boxRight - lineWidth;
  };
  const wordX = place(wordWidth);
  const tagX = place(tagWidth);

  // Lift the block clear of the avatar that overlaps the lower-left corner.
  const block = markSize + markSize * 0.62;
  const centreY = avatarCorner === "bottom-left" ? cy - height * 0.08 : cy;
  const wordBaseline = centreY - block / 2 + markSize;
  const tagBaseline = wordBaseline + markSize * 0.62;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${AMBER}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${INDIGO}" stop-opacity="0.16"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0v48" fill="none" stroke="hsl(258,40%,25%)" stroke-opacity="0.4" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${width}" height="${height}" fill="${VOID}"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  <rect width="${width}" height="${height}" fill="url(#wash)"/>

  <path d="${slash(0, slashW)}" fill="${AMBER}" fill-opacity="0.9"/>
  <path d="${slash(slashW * 1.6, slashW * 1.4)}" fill="${INDIGO}" fill-opacity="0.85"/>

  <g transform="translate(${wordX}, ${wordBaseline}) scale(${wordScale}, ${-wordScale})">
    <path d="${wordmark.d}" fill="${TEXT}"/>
  </g>
  <g transform="translate(${tagX}, ${tagBaseline}) scale(${tagScale}, ${-tagScale})">
    <path d="${tagline.d}" fill="${MUTED}"/>
  </g>
</svg>`;
}

async function main() {
  const cliAlign = resolveAlign(process.argv.slice(2));
  const font = await loadFont();
  await mkdir(OUT, { recursive: true });

  for (const spec of BANNERS) {
    const align = spec.align ?? cliAlign;
    const svg = buildBanner(font, { ...spec, align });
    await writeFile(path.join(OUT, `${spec.name}.svg`), svg, "utf8");
    await sharp(Buffer.from(svg))
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT, `${spec.name}.png`));
    console.log(`${spec.label.padEnd(32)} ${spec.width}x${spec.height}  (${align})`);
  }

  console.log(`\n${BANNERS.length} banners written to ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
