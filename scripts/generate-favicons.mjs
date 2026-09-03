/**
 * Generates the raster favicons from the single source SVG.
 *
 * Google will only render a favicon in search results once it has crawled a
 * real icon file. An SVG alone is legal but under-supported by crawlers, and
 * there was no /favicon.ico at all — so this emits both:
 *
 *   app/icon.png     — 192px PNG, the raster `<link rel="icon">`
 *   app/favicon.ico  — 16/32/48 multi-resolution .ico at the domain root
 *
 * Run after editing app/icon.svg:
 *
 *   npm run favicons
 *
 * Source of truth: app/icon.svg
 */
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

const SOURCE = "app/icon.svg";
const ICO_SIZES = [16, 32, 48];
const PNG_SIZE = 192;

/** Wrap raw PNG buffers into a single .ico container (PNG-in-ICO, Vista+). */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(16 * images.length);
  let offset = header.length + directory.length;
  const bodies = [];

  images.forEach(({ size, data }, index) => {
    const entry = directory.subarray(index * 16, index * 16 + 16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 => 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    bodies.push(data);
  });

  return Buffer.concat([header, directory, ...bodies]);
}

async function main() {
  const svg = await readFile(SOURCE);

  const render = (size) =>
    sharp(svg, { density: 600 })
      .resize(size, size, { fit: "contain" })
      .png({ compressionLevel: 9 })
      .toBuffer();

  await writeFile("app/icon.png", await render(PNG_SIZE));

  const icoImages = await Promise.all(
    ICO_SIZES.map(async (size) => ({ size, data: await render(size) })),
  );
  await writeFile("app/favicon.ico", buildIco(icoImages));

  console.log(
    `Generated app/icon.png (${PNG_SIZE}px) and app/favicon.ico (${ICO_SIZES.join("/")}px) from ${SOURCE}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
