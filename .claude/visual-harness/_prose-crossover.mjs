import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3000/blog/sample-post", { waitUntil: "load" });
for (const w of [375, 430, 640, 700, 768, 800, 860, 900, 1024, 1100, 1280, 1370, 1440, 1600]) {
  await p.setViewportSize({ width: w, height: 900 });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const main = document.querySelector("main");
    const art = main.querySelector("article");
    const col = main.getBoundingClientRect().width;
    const artW = art.getBoundingClientRect().width;
    return { col: Math.round(col), art: Math.round(artW) };
  });
  const bites = r.art < r.col - 1;
  console.log(`${String(w).padStart(5)}px   col ${String(r.col).padStart(4)}   article ${String(r.art).padStart(4)}   ${bites ? `CLAMPED (-${r.col - r.art}px)` : "inert"}`);
}
await b.close();
