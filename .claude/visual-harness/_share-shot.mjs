import { chromium } from "playwright";

const ROUTES = [
  ["/news/football/wisconsin-penn-state-score-comeback-fickell", "news-story"],
  ["/articles/parlays-vs-straight-bets", "article"],
];

const WIDTHS = [
  [390, 1200, "mobile"],
  [1440, 1100, "desktop"],
];

const variant = process.argv[2] || "a";

const browser = await chromium.launch({ ignoreDefaultArgs: ["--hide-scrollbars"] });
for (const [path, name] of ROUTES) {
  for (const [w, h, label] of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const res = await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
    if (!res.ok()) {
      console.log(`${name} ${label}: HTTP ${res.status()}`);
      await page.close();
      continue;
    }
    const header = page.locator("main header").first();
    const byline = page.locator("address").first();
    const hb = await header.boundingBox();
    const bb = await byline.boundingBox();
    console.log(
      `${name} ${label}: header ${Math.round(hb.y)}..${Math.round(hb.y + hb.height)} | byline y=${Math.round(bb.y)}`,
    );
    await page.screenshot({
      path: `.claude/visual-harness/_shots/meta-${variant}-${name}-${label}.png`,
      clip: { x: 0, y: Math.max(0, hb.y - 24), width: w, height: Math.min(bb.y + 90 - hb.y + 24, h) },
    });
    await page.close();
  }
}
await browser.close();
