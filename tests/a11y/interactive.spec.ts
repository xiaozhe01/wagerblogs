import { test, expect } from "@playwright/test";
import { assertNoViolations } from "./axe-report";

// Static-load axe scans can't catch runtime-only ARIA state changes. SideNav's
// desktop nav (components/layout/SideNav.tsx, lg+ only) uses base-ui's
// NavigationMenu, which toggles aria-expanded on open — this drives the menu
// open and scans that expanded state specifically, instead of only the
// closed/initial DOM.
test("Home — SideNav nav-menu expand is accessible in its open state", async ({
  page,
}, testInfo) => {
  test.skip(
    !testInfo.project.name.startsWith("desktop"),
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

// The mobile/tablet counterpart: SideNav is hidden below wide:, so navigation
// lives in a drawer (components/layout/MobileNav.tsx). Its open state is
// runtime-only, so a static scan never sees it.
test("News — mobile nav drawer is accessible in its open state", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name.startsWith("desktop"),
    "The drawer replaces SideNav only below the wide: breakpoint — see components/layout/TopHeader.tsx",
  );

  await page.goto("/news");

  const trigger = page.getByRole("button", { name: "Menu" });
  await expect(trigger).toBeVisible();

  await trigger.click();

  const drawer = page.getByRole("dialog");
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("link", { name: "Football", exact: true })).toBeVisible();

  await assertNoViolations(page, "News — mobile nav drawer open (dynamic ARIA state)");

  // Escape closes it and returns focus to the trigger it came from.
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
});

// The FAQ accordion (components/ui/accordion.tsx) toggles aria-expanded and
// mounts its answer only when open, so a static scan sees seven collapsed
// headers and never reads an answer.
test("FAQ — accordion is accessible with answers expanded", async ({ page }) => {
  await page.goto("/faq");

  // Scoped by data-slot: SideNav's nav triggers are also buttons carrying
  // aria-expanded, and an unscoped role query reaches them first.
  const triggers = page.locator('[data-slot="accordion-trigger"]');
  const first = triggers.nth(0);
  const second = triggers.nth(1);
  await expect(first).toBeVisible();

  await first.click();
  await expect(first).toHaveAttribute("aria-expanded", "true");

  // multiple: opening a second answer must not collapse the first.
  await second.click();
  await expect(second).toHaveAttribute("aria-expanded", "true");
  await expect(first).toHaveAttribute("aria-expanded", "true");

  await assertNoViolations(page, "FAQ — accordion expanded (dynamic ARIA state)");
});

// The search dialog's combobox is runtime-only: the listbox, its options and
// aria-activedescendant exist only once a query has returned.
test("Search — dialog combobox is accessible with results showing", async ({ page }) => {
  await page.goto("/news");

  const trigger = page.getByRole("button", { name: /search/i }).first();
  await expect(trigger).toBeVisible();
  await trigger.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await dialog.locator('input[name="q"]').fill("review");
  await expect(page.getByRole("option").first()).toBeVisible();

  await assertNoViolations(page, "Search — dialog open with results (dynamic ARIA state)");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
