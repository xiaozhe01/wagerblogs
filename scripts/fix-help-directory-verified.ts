import { getPayload } from "payload";
import config from "@payload-config";

// One-off correction. The first seed run stamped every help-directory entry as
// verified, including the bracketed placeholders — a verification stamp on an
// organisation nobody checked is the fabricated trust signal CLAUDE.md rule 3
// forbids. seed-content.ts no longer does this; this fixes the rows it already
// wrote. Idempotent: re-running finds nothing to change.
//
//   npx tsx --env-file=.env.local scripts/fix-help-directory-verified.ts

const payload = await getPayload({ config });

const { docs } = await payload.find({
  collection: "help-directory-entries",
  where: { verified: { equals: true } },
  limit: 500,
  depth: 0,
  overrideAccess: false,
});

const placeholders = docs.filter((entry) => entry.name.includes("["));

for (const entry of placeholders) {
  await payload.update({
    collection: "help-directory-entries",
    id: entry.id,
    data: { verified: false, verifiedAt: null },
  });
  console.log(`unverified  ${entry.name}`);
}

console.log(`\n${placeholders.length} placeholder entries set to verified: false`);
process.exit(0);
