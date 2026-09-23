import { writeFile } from "node:fs/promises";
import sharp from "sharp";

// The sitewide OpenGraph fallback, for pages whose record has no seo.ogImage.
// Committed as public/og-default.png rather than generated at build time —
// social scrapers fetch it over HTTP, so it has to exist as a static file.
// This script is the reproducible source for that artifact; re-run it after
// editing the SVG below.
//
//   npx tsx scripts/generate-og-default.ts
//
// Labelled on purpose. A plain grey rectangle reads as a failed load; this
// reads as unfinished work, which is what it is. 1200x630 is the IAB/OpenGraph
// standard size. Replace with a designed asset before launch.

const WIDTH = 1200;
const HEIGHT = 630;
const OUT = "public/og-default.png";

const svg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#d4d0c8"/>
  <rect x="24" y="24" width="${WIDTH - 48}" height="${HEIGHT - 48}" fill="none" stroke="#8a857c" stroke-width="6" stroke-dasharray="28 20"/>
  <text x="50%" y="45%" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="96" font-weight="700" fill="#5c574e" letter-spacing="4">WagerBlogs</text>
  <text x="50%" y="58%" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="42" fill="#6f6a60">[OG image placeholder]</text>
</svg>`;

const data = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(OUT, data);
console.log(`wrote ${OUT} (${WIDTH}x${HEIGHT}, ${data.byteLength} bytes)`);
