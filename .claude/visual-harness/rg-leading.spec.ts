import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

mkdirSync(new URL("_out/", import.meta.url).pathname, { recursive: true });
const OUT =
  new URL("_out/rg-leading.json", import.meta.url).pathname;

const ORIGIN = "https://www.rg.org";
const PATHS = ["/", "/sportsbooks", "/sportsbooks/arizona", "/research", "/about"];

const walk = () => {
  const out: Record<string, unknown>[] = [];
  for (const el of Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,a,span,td,th"))) {
    const ownText = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent ?? "")
      .join("")
      .trim();
    if (!ownText) continue;
    if (!el.getClientRects().length) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) continue;

    const size = parseFloat(cs.fontSize);
    const lhRaw = cs.lineHeight;
    const lh = lhRaw === "normal" ? null : parseFloat(lhRaw);
    out.push({
      tag: el.tagName.toLowerCase(),
      size,
      weight: parseInt(cs.fontWeight, 10),
      lh,
      ratio: lh ? Math.round((lh / size) * 100) / 100 : null,
      chars: ownText.length,
      text: ownText.slice(0, 50).replace(/\s+/g, " "),
    });
  }
  return out;
};

test("rg.org line-height sweep", async ({ page }) => {
  const all: Record<string, unknown>[] = [];
  const visited: string[] = [];

  const visit = async (url: string, label: string) => {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page.waitForTimeout(1200);
    const rows = await page.evaluate(walk);
    for (const r of rows) all.push({ page: label, ...r });
    visited.push(`${label} (${rows.length} nodes)`);
    await page.waitForTimeout(2500);
  };

  for (const p of PATHS) {
    try {
      await visit(ORIGIN + p, p);
    } catch (e) {
      visited.push(`${p} FAILED: ${(e as Error).message.slice(0, 90)}`);
    }
  }

  try {
    await page.goto(ORIGIN + "/news", { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForTimeout(1200);
    const href = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a[href]")) as HTMLAnchorElement[];
      const art = links.find((a) => /\/news\/[a-z0-9-]{12,}/i.test(a.getAttribute("href") ?? ""));
      return art?.href ?? null;
    });
    if (href) await visit(href, "news-article");
    else visited.push("news-article: no article link found");
  } catch (e) {
    visited.push(`news FAILED: ${(e as Error).message.slice(0, 90)}`);
  }

  writeFileSync(OUT, JSON.stringify({ visited, rows: all }, null, 1));
  console.log(visited.join("\n"));
});
