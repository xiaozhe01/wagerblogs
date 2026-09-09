import { expect, type Page, type TestInfo } from "@playwright/test";

/** Asserts the page rendered in the theme its project asked for. If the
 *  colorScheme -> next-themes chain breaks, every dark test would keep passing
 *  while scanning light mode. */
export async function expectProjectTheme(page: Page, testInfo: TestInfo) {
  const wantsDark = testInfo.project.name.endsWith("-dark");
  const html = page.locator("html");
  await expect(
    html,
    `project "${testInfo.project.name}" expected the ${wantsDark ? "dark" : "light"} theme`,
  ).toHaveClass(wantsDark ? /\bdark\b/ : /\blight\b/);

  // The class can be present while the tokens are not.
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const isDark = bg === "rgb(23, 21, 15)";
  expect(
    isDark,
    `body background ${bg} does not match the ${wantsDark ? "dark" : "light"} page token`,
  ).toBe(wantsDark);
}
