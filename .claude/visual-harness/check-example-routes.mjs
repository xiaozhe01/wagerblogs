// Read-only drift check over the example URLs our tools already reference.
//
// Nothing here fixes or repoints anything — it reports HTTP status per route,
// grouped by the file that names it. It exists because the same failure has now
// happened three times: a record is renamed or unpublished, and a hardcoded
// slug in a test fixture or an audit script goes on reporting "ok" against a
// 404 page, which lays out perfectly well.
//
// Run against a running dev server:  npm run check:routes
//
// Two ways of reading a list, for one reason:
//
//   IMPORTED — the file exports its routes and importing it does nothing else.
//   Only tests/a11y/routes.ts and overflow-check.mjs qualify.
//
//   SCANNED  — the literal is parsed out of the source. Playwright specs
//   register tests when imported and the scratch .mjs audits launch a browser,
//   so importing them is not read-only. Scanning covers them without the churn
//   of refactoring a dozen abandoned scripts into modules.

import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL("../..", import.meta.url)));
const BASE = process.env.CHECK_ROUTES_BASE ?? "http://localhost:3000";

// The five segment families the drift has actually shown up in, plus /blog,
// which was renamed to /articles and still appears in older scripts.
const ROUTE = /["'`](\/(?:reviews|articles|news|authors|categories|blog)\/[A-Za-z0-9\-/]+)["'`]/g;

const sources = [];

// --- imported -------------------------------------------------------------
const { routes: a11yRoutes } = await import("../../tests/a11y/routes.ts");
sources.push({
  file: "tests/a11y/routes.ts",
  how: "imported",
  routes: a11yRoutes.map((route) => route.path),
});

const { routes: overflowRoutes } = await import("./overflow-check.mjs");
sources.push({
  file: ".claude/visual-harness/overflow-check.mjs",
  how: "imported",
  routes: overflowRoutes,
});

// --- scanned --------------------------------------------------------------
const scanned = [
  ...readdirSync(join(ROOT, "tests/a11y"))
    .filter((name) => name.endsWith(".spec.ts"))
    .map((name) => join(ROOT, "tests/a11y", name)),
  ...readdirSync(join(ROOT, ".claude/visual-harness"))
    .filter((name) => /\.(mjs|spec\.ts)$/.test(name))
    .map((name) => join(ROOT, ".claude/visual-harness", name)),
  // overflow-check is read by import above; this file's own regex is not a route.
].filter((path) => !/(overflow-check|check-example-routes)\.mjs$/.test(path));

for (const path of scanned) {
  const found = [...readFileSync(path, "utf8").matchAll(ROUTE)].map((m) => m[1]);
  if (found.length) {
    sources.push({ file: relative(ROOT, path), how: "scanned", routes: [...new Set(found)] });
  }
}

// --- probe ----------------------------------------------------------------
const seen = new Map();
const status = async (url) => {
  if (!seen.has(url)) {
    seen.set(
      url,
      fetch(BASE + url, { redirect: "manual" }).then(
        (res) => res.status,
        (error) => `ERR ${error.cause?.code ?? error.message}`,
      ),
    );
  }
  return seen.get(url);
};

let dead = 0;
for (const source of sources) {
  console.log(`\n  ${source.file}  (${source.how}, ${source.routes.length})`);
  for (const url of source.routes) {
    const code = await status(url);
    const ok = code === 200;
    if (!ok) dead++;
    console.log(`    ${ok ? "  " : "!!"} ${String(code).padEnd(5)} ${url}`);
  }
}

console.log(
  dead
    ? `\n  ${dead} reference(s) do not resolve — see !! above. Nothing was changed.`
    : "\n  every referenced route resolves",
);
