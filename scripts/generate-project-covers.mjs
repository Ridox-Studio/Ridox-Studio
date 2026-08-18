/**
 * Composites raw screenshots onto the branded cover background.
 *
 *   npm run covers
 *
 * Drop screenshots in assets/screenshots/ named after the project slug:
 *
 *   assets/screenshots/cilbup.png          one shot
 *   assets/screenshots/netcart-1.png       several, laid out side by side
 *   assets/screenshots/netcart-2.png
 *
 * Any slug with no screenshot keeps the generated placeholder, so this is safe
 * to run at any time with a partial set.
 *
 * Everything lands inside a centred safe box: covers are rendered with
 * `object-cover` into panes whose aspect ratio varies with the viewport, so the
 * edges get cropped by an unpredictable amount.
 */
import sharp from "sharp";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SRC = "assets/screenshots";
const OUT = "public/projects";
const TEMPLATE_OUT = "assets/cover-template";

const W = 1600;
const H = 900;

/** Fraction of the canvas the screenshots may occupy — the crop-safe middle. */
const SAFE_W = 0.62;
const SAFE_H = 0.74;

const AMBER = "hsl(33, 95%, 52%)";
const INDIGO = "hsl(258, 89%, 62%)";

/** Which accent leads, per project. Studio products lead indigo. */
const ACCENTS = {
  cilbup: "indigo",
  risms: "indigo",
  resurgee: "indigo",
  netcart: "amber",
  "cy-academy": "amber",
  "cy-udida-portfolio": "amber",
};

/** The branded ground, with no text — also written out as a Canva template. */
function background(accent = "indigo") {
  const a = accent === "indigo" ? INDIGO : AMBER;
  const b = accent === "indigo" ? AMBER : INDIGO;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${b}" stop-opacity="0.10"/>
    </linearGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0H0v64" fill="none" stroke="hsl(258,40%,25%)" stroke-opacity="0.45" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="hsl(258, 40%, 4%)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <path d="M 980,-100 L 1120,-100 L 700,1000 L 560,1000 Z" fill="${a}" fill-opacity="0.16"/>
  <path d="M 1160,-100 L 1300,-100 L 880,1000 L 740,1000 Z" fill="${b}" fill-opacity="0.12"/>
</svg>`;
}

/** Rounds a screenshot's corners and gives it a hairline edge. */
async function frame(buffer, width, height, radius = 18) {
  const resized = await sharp(buffer)
    .resize(width, height, { fit: "inside", withoutEnlargement: false })
    .toBuffer();

  const meta = await sharp(resized).metadata();
  const w = meta.width ?? width;
  const h = meta.height ?? height;

  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`,
  );

  const rounded = await sharp(resized)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  // Hairline border, drawn over the rounded image.
  const border = Buffer.from(
    `<svg width="${w}" height="${h}"><rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${radius}" ry="${radius}" fill="none" stroke="hsl(258,40%,45%)" stroke-opacity="0.5" stroke-width="1.5"/></svg>`,
  );

  return {
    buffer: await sharp(rounded).composite([{ input: border }]).png().toBuffer(),
    width: w,
    height: h,
  };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir(SRC, { recursive: true });
  await mkdir(TEMPLATE_OUT, { recursive: true });

  // Blank templates, for dropping screenshots in by hand if you prefer.
  for (const accent of ["indigo", "amber"]) {
    const svg = background(accent);
    await writeFile(path.join(TEMPLATE_OUT, `cover-template-${accent}.svg`), svg, "utf8");
    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(TEMPLATE_OUT, `cover-template-${accent}.png`));
  }

  let files = [];
  try {
    files = await readdir(SRC);
  } catch {
    files = [];
  }

  const shots = files.filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  if (shots.length === 0) {
    console.log(
      `No screenshots in ${SRC}/ yet — wrote blank templates to ${TEMPLATE_OUT}/ only.`,
    );
    return;
  }

  // Group by slug: "netcart-1.png" and "netcart-2.png" both belong to netcart.
  const groups = new Map();
  for (const file of shots) {
    const slug = path.parse(file).name.replace(/-\d+$/, "");
    if (!groups.has(slug)) groups.set(slug, []);
    groups.get(slug).push(path.join(SRC, file));
  }

  for (const [slug, paths] of groups) {
    paths.sort();
    const accent = ACCENTS[slug] ?? "indigo";
    const boxW = W * SAFE_W;
    const boxH = H * SAFE_H;
    const gap = 28;

    // Portrait shots sit side by side happily. Landscape ones do not — two
    // 16:9 screens sharing the box width shrink until nothing is readable, so
    // they cascade instead, offset along the logo's diagonal.
    const meta = await Promise.all(paths.map((file) => sharp(file).metadata()));
    const allLandscape = meta.every((m) => (m.width ?? 0) > (m.height ?? 0));
    const cascade = allLandscape && paths.length > 1;

    let layers;

    if (cascade) {
      // Each shot is nearly box-width; the stack is offset down-left as it
      // comes forward, so the last one drawn reads as the front of a deck.
      const step = Math.round(boxW * 0.09);
      const shotW = Math.round(boxW - step * (paths.length - 1));
      const framed = [];
      for (const file of paths) {
        framed.push(
          await frame(await sharp(file).png().toBuffer(), shotW, Math.floor(boxH)),
        );
      }

      const spanW = framed[0].width + step * (paths.length - 1);
      const spanH = framed[0].height + step * (paths.length - 1);
      const originX = Math.round((W - spanW) / 2);
      const originY = Math.round((H - spanH) / 2);

      layers = framed.map((f, index) => ({
        input: f.buffer,
        left: originX + step * (paths.length - 1 - index),
        top: originY + step * index,
      }));
    } else {
      // Each shot gets an equal share of the safe box's width.
      const slotW = Math.floor((boxW - gap * (paths.length - 1)) / paths.length);

      const framed = [];
      for (const file of paths) {
        framed.push(await frame(await sharp(file).png().toBuffer(), slotW, Math.floor(boxH)));
      }

      const totalW = framed.reduce((sum, f) => sum + f.width, 0) + gap * (framed.length - 1);
      let x = Math.round((W - totalW) / 2);

      layers = framed.map((f) => {
        const layer = {
          input: f.buffer,
          left: x,
          top: Math.round((H - f.height) / 2),
        };
        x += f.width + gap;
        return layer;
      });
    }

    await sharp(Buffer.from(background(accent)))
      .composite(layers)
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT, `${slug}.png`));

    console.log(
      `${slug.padEnd(22)} ${paths.length} shot${paths.length > 1 ? "s" : ""} ${cascade ? "(cascade)" : ""} -> ${OUT}/${slug}.png`,
    );
  }

  console.log(
    "\nRemember to point coverImage at the .png in app/data/projects.ts,\n" +
      "and clear .next/cache/images so the optimizer picks up the change.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
