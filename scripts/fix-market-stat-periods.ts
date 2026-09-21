import { getPayload } from "payload";
import config from "@payload-config";

// One-off correction. The first seed run stripped a leading "Period: " from
// each market stat but not "As of: ", so two rows stored the display prefix as
// part of the value and MarketCard renders "Period: As of: [month 0000]".
// seed-content.ts now strips both; this fixes the rows it already wrote.
// Idempotent: re-running finds nothing to change.
//
//   npx tsx --env-file=.env.local scripts/fix-market-stat-periods.ts

const PREFIX = /^(Period|As of):\s*/;

const payload = await getPayload({ config });

const global = await payload.findGlobal({
  slug: "market-stats",
  depth: 0,
  overrideAccess: false,
});

const stats = global.stats ?? [];
const fixed = stats.filter((stat) => PREFIX.test(stat.period));

if (fixed.length === 0) {
  console.log("0 stats carried a display prefix");
} else {
  await payload.updateGlobal({
    slug: "market-stats",
    data: {
      stats: stats.map((stat) => ({ ...stat, period: stat.period.replace(PREFIX, "") })),
    } as never,
  });
  for (const stat of fixed) {
    console.log(`stripped    ${stat.label}: "${stat.period}"`);
  }
  console.log(`\n${fixed.length} stats corrected`);
}

process.exit(0);
