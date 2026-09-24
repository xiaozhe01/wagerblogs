import { getPayload } from "payload";
import config from "../payload.config";
import { applyRls } from "./rls";
import { categories, newsCategories } from "../lib/site-data";
import { reviewGroups } from "./fixtures/reviews";
import { chipSlug } from "../lib/utils";

// Bootstrap the two taxonomy collections that existing routes depend on:
// 6 Verticals (/categories/[slug], /reviews/[slug]) and 5 NewsSections
// (/news/[slug]). Values come from lib/ — this script moves that data into
// Payload without transforming it. Run once on a fresh database.
//
// Creates missing records only. It is not a migration tool: an existing
// record is skipped, never updated.

/** Grep-able and visibly wrong, so it cannot ship as if it were real copy.
 * Used only where lib/ has no source at all — never derived from a name or
 * description, which is the pattern that quietly ships as if it were real. */
const toWrite = (what: string, who: string) => `[TO WRITE] ${what} for ${who}`;
const toWriteSeo = (name: string) => `[TO WRITE] ${name}`;

// Vertical slug -> reviewGroup slug. Not derivable: chipSlug("Online Casinos")
// is "online-casinos" but reviewGroups calls the same concept "casinos".
// Seed treats "online-casinos" as canonical; see MIGRATION.md "Vertical slug
// conflict deferred to frontend-wiring handoff".
const REVIEW_GROUP_BY_VERTICAL: Record<string, string> = {
  sportsbooks: "sportsbooks",
  "online-casinos": "casinos",
};

type SeedRecord = { slug: string; data: Record<string, unknown> };

function requireSourced(record: string, fields: Record<string, unknown>) {
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === "") {
      throw new Error(
        `Seed aborted: required field "${key}" has no source in lib/ for record "${record}". ` +
          `Add it to the source file or extend the mapping in scripts/seed.ts — do not substitute a default.`,
      );
    }
  }
}

function buildVerticals(): SeedRecord[] {
  return categories.map((category, index) => {
    const slug = chipSlug(category.name);
    const groupSlug = REVIEW_GROUP_BY_VERTICAL[slug];
    const group = groupSlug ? reviewGroups.find((g) => g.slug === groupSlug) : undefined;

    if (groupSlug && !group) {
      throw new Error(
        `Seed aborted: REVIEW_GROUP_BY_VERTICAL maps "${slug}" to reviewGroup "${groupSlug}", ` +
          `which does not exist in scripts/fixtures/reviews.ts. The mapping is stale.`,
      );
    }

    // noun/crumb exist only for verticals that are also review groups; the
    // other four carry placeholders rather than invented copy.
    const data = {
      name: category.name,
      slug,
      noun: group?.noun ?? toWrite("noun", slug),
      crumb: group?.crumb ?? toWrite("crumb", slug),
      description: category.desc,
      hasReviews: Boolean(group),
      // No explicit order field in site-data.ts — array position, 1-indexed.
      order: index + 1,
      seo: {
        metaTitle: toWriteSeo(category.name),
        metaDescription: toWriteSeo(category.name),
      },
    };

    requireSourced(category.name, {
      name: data.name,
      slug: data.slug,
      description: data.description,
      order: data.order,
    });
    return { slug, data };
  });
}

function buildNewsSections(): SeedRecord[] {
  // newsCategories[0] is the "All" filter chip, not a section.
  const sections = newsCategories.slice(1);
  return sections.map((name, index) => {
    const slug = chipSlug(name);
    const data = {
      name,
      slug,
      // No per-section copy in lib/: news/[slug]/page.tsx:71 renders a literal
      // "[Placeholder standfirst …]" string, which is itself a placeholder.
      description: toWrite("description", slug),
      // No explicit order field — array position after dropping "All".
      order: index + 1,
      seo: { metaTitle: toWriteSeo(name), metaDescription: toWriteSeo(name) },
    };

    requireSourced(name, { name: data.name, slug: data.slug, order: data.order });
    return { slug, data };
  });
}

async function seedCollection(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: "verticals" | "news-sections",
  records: SeedRecord[],
  created: string[],
  skipped: string[],
) {
  for (const record of records) {
    const existing = await payload.find({
      collection,
      where: { slug: { equals: record.slug } },
      limit: 1,
      depth: 0,
    });

    if (existing.totalDocs > 0) {
      console.log(`  skipped: ${record.slug} (already exists)`);
      skipped.push(`${collection}/${record.slug}`);
      continue;
    }

    await payload.create({ collection, data: record.data as never });
    console.log(`  created: ${record.slug}`);
    created.push(`${collection}/${record.slug}`);
  }
}

const payload = await getPayload({ config });
const created: string[] = [];
const skipped: string[] = [];

const verticals = buildVerticals();
const newsSections = buildNewsSections();

console.log(`\nverticals (${verticals.length})`);
await seedCollection(payload, "verticals", verticals, created, skipped);

console.log(`\nnews-sections (${newsSections.length})`);
await seedCollection(payload, "news-sections", newsSections, created, skipped);

const placeholders = [...verticals, ...newsSections].filter((r) =>
  JSON.stringify(r.data).includes("[TO WRITE]"),
);

// getPayload() above ran Drizzle's push, which recreates tables and drops
// per-table RLS. Restore it here so seeding can never leave the database open,
// even if the developer forgets. See STRUCTURE.md.
let rls;
try {
  rls = await applyRls();
} catch (error) {
  throw new Error(
    `Seed data was written, but RLS could not be re-applied — the database is left OPEN. ` +
      `Run \`npm run rls:apply\` immediately. Cause: ${(error as Error).message}`,
  );
}
if (rls.missing.length > 0) {
  throw new Error(
    `Seed data was written, but RLS is still missing on ${rls.missing.length} table(s): ` +
      `${rls.missing.join(", ")}. The database is left OPEN — run \`npm run rls:apply\`.`,
  );
}

console.log(`\nsummary`);
console.log(`  created: ${created.length}`);
console.log(`  skipped: ${skipped.length}`);
console.log(`  RLS:     ${rls.enabled}/${rls.total} public tables (re-applied after push)`);
console.log(
  `  warning: ${placeholders.length} of ${verticals.length + newsSections.length} records`,
);
console.log(`           carry [TO WRITE] placeholders — grep "\\[TO WRITE\\]" to find them.`);

process.exit(0);
