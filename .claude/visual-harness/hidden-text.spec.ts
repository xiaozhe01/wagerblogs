import { test } from "@playwright/test";
import { appendFileSync, mkdirSync } from "node:fs";

mkdirSync(new URL("_out/", import.meta.url).pathname, { recursive: true });
const OUT =
  new URL("_out/hidden-text.jsonl", import.meta.url).pathname;

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
  ["mobile", 390, 844],
];

const walk = () => {
  const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TITLE", "HEAD", "META", "LINK"]);
  const out: Record<string, unknown>[] = [];

  const record = (el: Element, source: string, text: string) => {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    let why = "";
    if (!el.getClientRects().length) why = "no-rects";
    else if (cs.visibility === "hidden") why = "visibility-hidden";
    else if (cs.display === "none") why = "display-none";
    else if (parseFloat(cs.opacity) === 0) why = "opacity-0";
    else if (rect.width < 1 || rect.height < 1) why = "zero-size";

    const cls = typeof el.className === "string" ? el.className : "";
    out.push({
      source,
      visible: !why,
      why: why || null,
      srOnly: cls.includes("sr-only"),
      tag: el.tagName.toLowerCase(),
      size: parseFloat(cs.fontSize),
      weight: parseInt(cs.fontWeight, 10),
      cls: cls.slice(0, 70),
      text: text.slice(0, 60).replace(/\s+/g, " "),
    });
  };

  for (const el of Array.from(document.querySelectorAll("*"))) {
    if (SKIP.has(el.tagName)) continue;

    const ownText = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent ?? "")
      .join("")
      .trim();
    if (ownText) record(el, "text-node", ownText);

    const ph = el.getAttribute?.("placeholder");
    if (ph?.trim()) record(el, "placeholder", ph);
  }
  return out;
};

for (const [vpName, width, height] of VIEWPORTS) {
  test.describe(vpName, () => {
    test.use({ viewport: { width, height } });

    for (const [name, path] of ROUTES) {
      test(name, async ({ page }) => {
        await page.goto(path, { waitUntil: "load" });
        await page.evaluate(async () => {
          await document.fonts.ready;
        });
        await page.waitForTimeout(150);

        const rows = await page.evaluate(walk);
        appendFileSync(
          OUT,
          rows.map((r) => JSON.stringify({ route: name, vp: vpName, state: "load", ...r })).join("\n") +
            "\n",
        );
      });
    }
  });
}

test.describe("disclosure-states", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("nav dropdowns open", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const triggers = page.locator('[data-slot="navigation-menu-trigger"]:visible');
    const n = await triggers.count();
    const collected: Record<string, unknown>[] = [];

    for (let i = 0; i < n; i++) {
      await triggers.nth(i).click({ timeout: 5000 });
      await page.waitForTimeout(350);
      const open = await page.evaluate(walk);
      for (const r of open) if (r.visible) collected.push({ state: `menu-${i}`, ...r });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(150);
    }

    appendFileSync(
      OUT,
      collected.map((r) => JSON.stringify({ route: "home", vp: "desktop", ...r })).join("\n") + "\n",
    );
  });
});
