import { test, expect } from "@playwright/test";

const ROUTES: Array<[string, string]> = [
  ["home", "/"],
  ["blog-post", "/blog/how-odds-boosts-actually-work"],
  ["review", "/reviews/peakwager"],
  ["reviews-hub", "/reviews"],
  ["category", "/categories/esports-betting"],
  ["categories-hub", "/categories"],
  ["author", "/authors/jane-placeholder"],
  ["legal-privacy", "/legal/privacy-policy"],
  ["legal-terms", "/legal/terms-of-service"],
  ["legal-affiliate", "/legal/affiliate-disclosure"],
  ["legal-cookie", "/legal/cookie-policy"],
  ["responsible-gambling", "/responsible-gambling"],
  ["help-directory", "/responsible-gambling/help-directory"],
  ["not-found", "/this-route-does-not-exist"],
];

const VIEWPORTS: Array<[string, number, number]> = [
  ["desktop", 1440, 900],
  ["narrow-desktop", 1100, 900],
  ["mobile", 390, 844],
];

test("sidenav-dropdown", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  const trigger = page.getByRole("button", { name: "News" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.waitForTimeout(600);
  await expect(page.locator('[data-slot="navigation-menu-content"]')).toHaveScreenshot(
    "sidenav-dropdown.png",
  );
});

for (const [vpName, width, height] of VIEWPORTS) {
  test.describe(vpName, () => {
    test.use({ viewport: { width, height } });

    for (const [name, path] of ROUTES) {
      test(name, async ({ page }) => {
        await page.goto(path, { waitUntil: "load" });
        await page.evaluate(async () => {
          await document.fonts.ready;
        });
        await page.waitForTimeout(300);
        await expect(page).toHaveScreenshot(`${vpName}-${name}.png`, {
          fullPage: true,
        });
      });
    }
  });
}
