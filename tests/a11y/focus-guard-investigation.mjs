import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const WCAG22AA_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto("http://127.0.0.1:4319/");

await page.getByRole("button", { name: "News" }).click();
await page.waitForTimeout(400);

console.log("=== BEFORE any patch ===");
const before = await new AxeBuilder({ page }).withTags(WCAG22AA_TAGS).analyze();
const beforeAHF = before.violations.filter((v) => v.id === "aria-hidden-focus");
console.log(`aria-hidden-focus violations: ${beforeAHF.length}`, beforeAHF[0]?.nodes.length, "node(s)");

console.log("\n=== applying candidate patch: remove aria-hidden only, leave tabindex untouched ===");
const patched = await page.evaluate(() => {
  const guards = Array.from(document.querySelectorAll("[data-base-ui-focus-guard]"));
  guards.forEach((g) => g.removeAttribute("aria-hidden"));
  return guards.map((g) => ({
    ariaHidden: g.getAttribute("aria-hidden"),
    tabindex: g.getAttribute("tabindex"),
  }));
});
console.log("guard state after patch:", JSON.stringify(patched));

console.log("\n=== AFTER patch — full axe re-scan ===");
const after = await new AxeBuilder({ page }).withTags(WCAG22AA_TAGS).analyze();
const afterAHF = after.violations.filter((v) => v.id === "aria-hidden-focus");
console.log(`aria-hidden-focus violations: ${afterAHF.length}`);
console.log(`ALL violations after patch: ${after.violations.length}`);
after.violations.forEach((v) => console.log(`  - [${v.impact}] ${v.id}: ${v.nodes.length} node(s)`));

console.log("\n=== confirm keyboard Tab order is byte-identical (aria-hidden shouldn't affect it) ===");
const describeActive = () =>
  document.activeElement
    ? { tag: document.activeElement.tagName, text: (document.activeElement.textContent || "").trim().slice(0, 30) }
    : null;
const firstLink = page.locator('[data-slot="navigation-menu-content"]').getByRole("link").first();
await firstLink.focus();
for (let i = 0; i < 6; i++) {
  await page.keyboard.press("Tab");
  const info = await page.evaluate(describeActive);
  console.log(`  tab ${i + 1}:`, JSON.stringify(info));
}

await browser.close();
