import { test } from "@playwright/test";
import { appendFileSync, mkdirSync } from "node:fs";

mkdirSync(new URL("_out/", import.meta.url).pathname, { recursive: true });
const OUT =
  new URL("_out/type-audit.jsonl", import.meta.url).pathname;

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

for (const [vpName, width, height] of VIEWPORTS) {
  test.describe(vpName, () => {
    test.use({ viewport: { width, height } });

    for (const [name, path] of ROUTES) {
      test(name, async ({ page }) => {
        await page.goto(path, { waitUntil: "load" });
        await page.evaluate(async () => {
          await document.fonts.ready;
        });
        await page.waitForTimeout(200);

        const rows = await page.evaluate(() => {
          const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TITLE", "HEAD", "META", "LINK"]);
          const out: Record<string, unknown>[] = [];

          const chain = (el: Element) => {
            const parts: string[] = [];
            let cur: Element | null = el;
            for (let i = 0; i < 4 && cur; i++) {
              const cls = typeof cur.className === "string" ? cur.className.trim() : "";
              const first = cls ? "." + cls.split(/\s+/)[0] : "";
              parts.unshift(cur.tagName.toLowerCase() + first);
              cur = cur.parentElement;
            }
            return parts.join(" > ");
          };

          for (const el of Array.from(document.querySelectorAll("*"))) {
            if (SKIP.has(el.tagName)) continue;

            const ownText = Array.from(el.childNodes)
              .filter((n) => n.nodeType === 3)
              .map((n) => n.textContent ?? "")
              .join("")
              .trim();
            if (!ownText) continue;

            if (!el.getClientRects().length) continue;
            const cs = getComputedStyle(el);
            if (cs.visibility === "hidden" || cs.display === "none") continue;
            if (parseFloat(cs.opacity) === 0) continue;

            const rect = el.getBoundingClientRect();
            if (rect.width < 1 || rect.height < 1) continue;

            out.push({
              tag: el.tagName.toLowerCase(),
              size: parseFloat(cs.fontSize),
              weight: parseInt(cs.fontWeight, 10),
              lineHeight: cs.lineHeight,
              letterSpacing: cs.letterSpacing,
              color: cs.color,
              transform: cs.textTransform,
              family: cs.fontFamily.split(",")[0].replace(/["']/g, ""),
              cls: typeof el.className === "string" ? el.className : "",
              chain: chain(el),
              text: ownText.slice(0, 60).replace(/\s+/g, " "),
            });
          }
          return out;
        });

        for (const r of rows) {
          appendFileSync(OUT, JSON.stringify({ route: name, vp: vpName, ...r }) + "\n");
        }
      });
    }
  });
}
