import { test, expect } from "@playwright/test";
import { measure, ratio, settle } from "./contrast";
import { expectProjectTheme } from "./theme";

// axe only evaluates the resting DOM, so these states have no other coverage.
// Runs in all four projects, so each case is exercised in both themes.
type Kind = "text" | "outline" | "border";
type Case = {
  route: string;
  name: string;
  selector: string;
  trigger: "hover" | "focus" | "none";
  kind: Kind;
  desktopOnly?: boolean;
};

const CASES: Case[] = [
  {
    route: "/",
    name: "SideNav active (aria-current)",
    selector: '[aria-current="page"]',
    trigger: "none",
    kind: "text",
    desktopOnly: true,
  },
  {
    route: "/",
    name: "SideNav Log In hover",
    selector: 'a[href="/login"]',
    trigger: "hover",
    kind: "text",
    desktopOnly: true,
  },
  {
    route: "/",
    name: "SideNav Log In focus ring",
    selector: 'a[href="/login"]',
    trigger: "focus",
    kind: "outline",
    desktopOnly: true,
  },
  {
    route: "/",
    name: "BackToTop hover",
    selector: "button:has-text('Back to Top')",
    trigger: "hover",
    kind: "text",
    desktopOnly: true,
  },
  {
    route: "/",
    name: "ThemeToggle radio focus ring",
    selector: 'input[name="theme"][value="dark"]',
    trigger: "focus",
    kind: "outline",
  },
  {
    route: "/reviews/peakwager",
    name: "btn-primary hover",
    selector: ".btn-primary",
    trigger: "hover",
    kind: "text",
  },
  {
    route: "/reviews/peakwager",
    name: "btn-primary focus ring",
    selector: ".btn-primary",
    trigger: "focus",
    kind: "outline",
  },
  {
    route: "/reviews/peakwager",
    name: "btn-secondary hover",
    selector: ".btn-secondary",
    trigger: "hover",
    kind: "text",
  },
  {
    route: "/responsible-gambling",
    name: "btn-safety focus ring",
    selector: ".btn-safety",
    trigger: "focus",
    kind: "outline",
  },
  {
    route: "/responsible-gambling",
    name: "SelfAssessment radio focus ring",
    selector: "label:has(input[type=radio]) input",
    trigger: "focus",
    kind: "outline",
  },
  {
    route: "/responsible-gambling/help-directory",
    name: "chip-active",
    selector: ".chip-active",
    trigger: "none",
    kind: "text",
  },
  {
    route: "/this-route-does-not-exist",
    name: "marker link",
    selector: ".link-on-marker",
    trigger: "none",
    kind: "text",
  },
  {
    route: "/this-route-does-not-exist",
    name: "marker link hover",
    selector: ".link-on-marker",
    trigger: "hover",
    kind: "text",
  },
  {
    route: "/responsible-gambling/help-directory",
    name: "AnchorList item hover",
    selector: "nav.card a",
    trigger: "hover",
    kind: "text",
    // The rail is "hidden wide:flex", so this is in the DOM but never painted
    // below the wide: breakpoint — see mobile-touch-audit M-2.
    desktopOnly: true,
  },
];

const floor = (k: Kind) => (k === "text" ? 4.5 : 3.0);

for (const c of CASES) {
  test(`${c.name} — ${c.route}`, async ({ page }, testInfo) => {
    test.skip(
      !!c.desktopOnly && !testInfo.project.name.startsWith("desktop"),
      "SideNav and the rail only render at the wide: breakpoint",
    );

    await page.goto(c.route);
    await expectProjectTheme(page, testInfo);

    const el = page.locator(c.selector).first();
    await expect(el, `${c.selector} not found on ${c.route}`).toHaveCount(1);
    await el.scrollIntoViewIfNeeded();
    if (c.trigger === "hover") await el.hover({ force: true });
    if (c.trigger === "focus") await el.focus();
    await settle(page);

    const m = await measure(el, c.kind);
    const r = ratio(m.fg, m.bg);
    expect(
      r,
      `${c.name}: ${m.label} on rgb(${m.bg.slice(0, 3)}) = ${r.toFixed(2)}:1, below ${floor(c.kind)}`,
    ).toBeGreaterThanOrEqual(floor(c.kind));
  });
}
