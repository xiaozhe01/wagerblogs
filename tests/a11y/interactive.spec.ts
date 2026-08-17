import { test, expect } from "@playwright/test";
import { assertNoViolations } from "./axe-report";

// Static-load axe scans can't catch runtime-only ARIA state changes. SideNav's
// desktop nav (components/layout/SideNav.tsx, lg+ only) uses base-ui's
// NavigationMenu, which toggles aria-expanded on open — this drives the menu
// open and scans that expanded state specifically, instead of only the
// closed/initial DOM.
test("Home — SideNav nav-menu expand is accessible in its open state", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "SideNav's dropdown nav only renders at the lg+ breakpoint — see components/layout/SideNav.tsx",
  );

  await page.goto("/");

  const trigger = page.getByRole("button", { name: "News" });
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();

  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  // Scoped to the popup content — "Football" also appears as part of an unrelated
  // news-feed card's accessible name elsewhere on the page (strict-mode ambiguous
  // otherwise).
  const menuContent = page.locator('[data-slot="navigation-menu-content"]');
  await expect(menuContent.getByRole("link", { name: "Football", exact: true })).toBeVisible();

  await assertNoViolations(page, "Home — 'News' nav menu expanded (dynamic ARIA state)");
});
