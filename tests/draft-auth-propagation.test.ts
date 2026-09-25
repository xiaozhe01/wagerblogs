import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

// publishedFilter returns { where, draft, user }. Destructuring only where and
// draft drops the editor identity, and the access rules then filter drafts out
// at the data layer — the route 404s in Live Preview while index routes, which
// spread, keep working. That asymmetry shipped once: it passed typecheck, lint,
// the build and the whole a11y suite, because nothing in CI enters draft mode.
//
// Spreading is the only call shape that cannot silently lose a field.

const ROOT = join(import.meta.dirname, "..", "app", "(frontend)");

function routeFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return routeFiles(path);
    return entry.name.endsWith(".tsx") || entry.name.endsWith(".ts") ? [path] : [];
  });
}

const sources = routeFiles(ROOT).map((path) => ({
  path: path.slice(ROOT.length + 1),
  text: readFileSync(path, "utf8"),
}));

test("every draft-mode publishedFilter call is spread, never destructured", () => {
  for (const { path, text } of sources) {
    for (const match of text.matchAll(/publishedFilter\(\s*isDraft/g)) {
      const prefix = text.slice(Math.max(0, match.index - 3), match.index);
      assert.equal(
        prefix,
        "...",
        `${path}: publishedFilter(isDraft…) must be spread into payload.find, ` +
          "otherwise the user it returns is dropped and drafts stay invisible",
      );
    }
  }
});

test("every file filtering on isDraft resolves an editor to pass through", () => {
  for (const { path, text } of sources) {
    if (!/publishedFilter\(\s*isDraft/.test(text)) continue;
    assert.match(
      text,
      /const previewUser = isDraft \? await resolvePreviewUser\(\) : null/,
      `${path}: filters on isDraft but never resolves previewUser`,
    );
  }
});

test("draft-mode call sites pass previewUser as the third argument", () => {
  for (const { path, text } of sources) {
    for (const match of text.matchAll(/publishedFilter\(\s*isDraft([\s\S]*?)\n\s*\)/g)) {
      assert.ok(
        match[1].includes("previewUser"),
        `${path}: a publishedFilter(isDraft…) call omits previewUser`,
      );
    }
  }
});
