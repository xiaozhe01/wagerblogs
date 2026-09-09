// Proves a change is visually a no-op: --out before, --diff after.
import { chromium } from "playwright";
import { createHash } from "node:crypto";
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ROUTES = [
  "/",
  "/blog/how-odds-boosts-actually-work",
  "/reviews",
  "/reviews/sportsbooks/peakwager",
  "/categories",
  "/categories/esports-betting",
  "/authors/jane-placeholder",
  "/legal/privacy-policy",
  "/legal/terms-of-service",
  "/legal/affiliate-disclosure",
  "/legal/cookie-policy",
  "/responsible-gambling",
  "/responsible-gambling/help-directory",
  "/this-route-does-not-exist",
];
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

const arg = (flag) => {
  const i = process.argv.indexOf(flag);
  return i === -1 ? null : process.argv[i + 1];
};

async function capture() {
  const browser = await chromium.launch();
  const out = {};
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    // No animation/transition, or the hash is nondeterministic.
    await page
      .addStyleTag({
        content: `*,*::before,*::after{animation:none !important;transition:none !important;}`,
      })
      .catch(() => {});
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await page.addStyleTag({
        content: `*,*::before,*::after{animation:none !important;transition:none !important;}`,
      });
      await page.waitForTimeout(150);
      const buf = await page.screenshot({ fullPage: true });
      out[`${vp.name} ${route}`] = createHash("sha256").update(buf).digest("hex").slice(0, 16);
    }
    await ctx.close();
  }
  await browser.close();
  return out;
}

const outPath = arg("--out");
const diffAgainst = arg("--diff");

const hashes = await capture();

if (outPath) {
  writeFileSync(resolve(HERE, outPath), JSON.stringify(hashes, null, 2) + "\n");
  console.log(`wrote ${Object.keys(hashes).length} hashes -> ${outPath}`);
}

if (diffAgainst) {
  const before = JSON.parse(readFileSync(resolve(HERE, diffAgainst), "utf8"));
  const keys = [...new Set([...Object.keys(before), ...Object.keys(hashes)])];
  const changed = keys.filter((k) => before[k] !== hashes[k]);
  if (!changed.length) {
    console.log(`IDENTICAL — all ${keys.length} renders byte-for-byte unchanged`);
  } else {
    console.log(`CHANGED (${changed.length}/${keys.length}):`);
    for (const k of changed)
      console.log(
        `  ${k}\n    before ${before[k] ?? "(absent)"}\n    after  ${hashes[k] ?? "(absent)"}`,
      );
    process.exitCode = 1;
  }
}

if (!outPath && !diffAgainst) console.log(hashes);
