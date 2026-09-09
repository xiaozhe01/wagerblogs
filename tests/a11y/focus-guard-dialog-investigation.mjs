// Companion to focus-guard-investigation.mjs, for the Dialog case: base-ui's
// dialog focus guards carry role="button" as well as aria-hidden, so stripping
// aria-hidden alone leaves an unnamed ARIA command (axe: aria-command-name).
import { chromium, devices } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const BASE = process.env.BASE ?? "http://localhost:3000";
const browser = await chromium.launch();
const context = await browser.newContext({ ...devices["iPhone 13"] });
const page = await context.newPage();
await page.goto(`${BASE}/news`);
await page.getByRole("button", { name: "Menu" }).click();
await page.getByRole("dialog").waitFor({ state: "visible" });

const scan = async (label) => {
  const r = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  console.log(
    `${label}: ${r.violations.length} violation(s)` +
      r.violations.map((v) => `\n    - [${v.impact}] ${v.id} (${v.nodes.length})`).join(""),
  );
  return r.violations;
};
await scan("BEFORE patch");

console.log("\nguard attributes as shipped:");
console.log(
  " ",
  JSON.stringify(
    await page.evaluate(() =>
      [...document.querySelectorAll("[data-base-ui-focus-guard]")].map((g) => ({
        role: g.getAttribute("role"),
        ariaHidden: g.getAttribute("aria-hidden"),
        tabindex: g.getAttribute("tabindex"),
      })),
    ),
  ),
);

const tabOrder = async () => {
  await page.getByRole("dialog").getByRole("link").first().focus();
  const seen = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    seen.push(
      await page.evaluate(() => {
        const a = document.activeElement;
        return `${a?.tagName}:${(a?.textContent || "").trim().slice(0, 14)}${a?.closest("[role=dialog]") ? "" : " (OUTSIDE)"}`;
      }),
    );
  }
  return seen;
};
const before = await tabOrder();

console.log("\napplying candidate patch: also remove role from the guards");
await page.evaluate(() =>
  document.querySelectorAll("[data-base-ui-focus-guard]").forEach((g) => g.removeAttribute("role")),
);
await scan("AFTER patch");
const after = await tabOrder();

console.log("\ntab order identical:", JSON.stringify(before) === JSON.stringify(after));
console.log("  before:", before.join(" → "));
console.log("  after :", after.join(" → "));
console.log(
  "focus stayed inside the drawer:",
  after.every((s) => !s.includes("OUTSIDE")),
);
await browser.close();
