import { test, expect } from "@playwright/test";
import { routes } from "./routes";
import { assertNoViolations, BEST_PRACTICE_TAGS } from "./axe-report";
import { expectProjectTheme } from "./theme";

// heading-order, landmark-unique and friends belong to no wcag* tag, so
// routes.spec.ts never ran them. Kept separate because they are not conformance
// failures — a report calling them WCAG violations would be wrong.
for (const route of routes) {
  test(`[structure] ${route.label} — ${route.path}`, async ({ page }, testInfo) => {
    const response = await page.goto(route.path);
    expect(response?.ok(), `${route.path} did not return a successful response`).toBeTruthy();
    await expectProjectTheme(page, testInfo);
    await assertNoViolations(page, `${route.label} (${route.path})`, {
      tags: BEST_PRACTICE_TAGS,
      standard: "axe best-practice",
    });
  });
}
