import { test, expect } from "@playwright/test";
import { assertNoViolations } from "./axe-report";

// CLAUDE.md rule: the 404 route must return a genuine HTTP 404, not a soft-404
// (200 with "not found" text), and stays editorial register — no ranked lists,
// comparisons, or primary-domain links regardless of what page was requested.
test("404 — Not Found returns a real HTTP 404 and is accessible", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist-a11y-probe");
  expect(response?.status(), "not-found.tsx must return a real HTTP 404, not a soft-404").toBe(404);
  await assertNoViolations(page, "404 — Not Found (/this-route-does-not-exist-a11y-probe)");
});
