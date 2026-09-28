import { getPayload } from "payload";
import config from "@payload-config";

// One-off backfill. Payload builds imageSizes at upload time only, so the "og"
// derivative added to collections/Media.ts after these records were uploaded
// was never generated for any of them — lib/og.ts asked for sizes.og, found
// nothing, and every share card fell back to the uncropped original.
// Re-uploading each original re-runs the upload pipeline, which regenerates
// every size.
// Idempotent: a record whose og derivative already matches is skipped.
//
//   npx tsx --env-file=.env.local scripts/regenerate-media-sizes.ts [--id N] [--as name]
//
// --as restores a filename: without overwriteExistingFiles an update collides
// with the record's own file and Payload appends "-1".

const TARGET = { width: 1200, height: 630 };

const arg = (flag: string) =>
  process.argv.includes(flag) ? process.argv[process.argv.indexOf(flag) + 1] : undefined;

const onlyId = arg("--id") ? Number(arg("--id")) : undefined;
const renameTo = arg("--as");

const payload = await getPayload({ config });

const { docs } = await payload.find({
  collection: "media",
  limit: 500,
  depth: 0,
  overrideAccess: true,
  ...(onlyId ? { where: { id: { equals: onlyId } } } : {}),
});

let regenerated = 0;
let skipped = 0;

for (const doc of docs) {
  const og = doc.sizes?.og;
  const shaped = og?.width === TARGET.width && og?.height === TARGET.height;
  // A source narrower than the target still crops now, just smaller; the only
  // safe "already done" test is that a derivative exists at all.
  if (og?.url && shaped) {
    console.log(`skip    ${doc.id} ${doc.filename} — og already ${og.width}x${og.height}`);
    skipped += 1;
    continue;
  }

  if (!doc.url || !doc.filename || !doc.mimeType) {
    console.log(`SKIP    ${doc.id} — record carries no file`);
    skipped += 1;
    continue;
  }

  const origin = process.env.REGEN_ORIGIN || "http://localhost:3000";
  const href = doc.url.startsWith("http") ? doc.url : `${origin}${doc.url}`;
  const res = await fetch(href);
  if (!res.ok) {
    console.log(`FAIL    ${doc.id} ${doc.filename} — GET ${href} returned ${res.status}`);
    continue;
  }
  const data = Buffer.from(await res.arrayBuffer());

  const before = `${doc.width}x${doc.height}`;
  const name = renameTo ?? doc.filename;
  const updated = await payload.update({
    collection: "media",
    id: doc.id,
    data: {},
    file: { data, mimetype: doc.mimeType, name, size: data.byteLength },
    overwriteExistingFiles: true,
    overrideAccess: true,
  });

  const after = updated.sizes?.og;
  const renamed = updated.filename !== doc.filename ? ` RENAMED -> ${updated.filename}` : "";
  console.log(
    `regen   ${doc.id} ${doc.filename} — source ${before}, og ${after?.width}x${after?.height}${renamed}`,
  );
  regenerated += 1;
}

console.log(`\n${regenerated} regenerated, ${skipped} skipped`);

process.exit(0);
