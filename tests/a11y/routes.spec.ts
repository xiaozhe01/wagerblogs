import { test, expect } from "@playwright/test";
import { routes } from "./routes";
import { assertNoViolations } from "./axe-report";

for (const route of routes) {
  test(`[${route.register}] ${route.label} — ${route.path}`, async ({ page }) => {
    const response = await page.goto(route.path);
    expect(response?.ok(), `${route.path} did not return a successful response`).toBeTruthy();
    await assertNoViolations(page, `${route.label} (${route.path})`);
  });
}
