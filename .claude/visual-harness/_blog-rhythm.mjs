import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
await p.goto("http://localhost:3000/blog/sample-post", { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);
const r = await p.evaluate(() => {
  const prose = document.querySelector("main > article > div:last-of-type");
  const rows = []; let prev = null;
  for (const el of prose.children) {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    if (cs.display === "none") continue;
    rows.push({
      tag: el.tagName.toLowerCase(),
      m: [cs.marginTop, cs.marginBottom].map((v) => parseFloat(v) || 0),
      gap: prev !== null ? Math.round(rect.top - prev) : null,
      size: cs.fontSize,
      txt: (el.textContent || "").trim().slice(0, 22),
    });
    prev = rect.bottom;
  }
  return { gap: getComputedStyle(prose).rowGap, rows };
});
console.log(`prose parent row-gap: ${r.gap}\n`);
for (const c of r.rows)
  console.log(`  ${c.tag.padEnd(11)} ${c.size.padStart(5)}  mt${String(c.m[0]).padStart(3)} mb${String(c.m[1]).padStart(3)}   realGap ${String(c.gap ?? "-").padStart(4)}   ${c.txt}`);
await p.screenshot({ path: ".claude/visual-harness/_shots/final-desktop.png", fullPage: false });
await b.close();
