import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const heights = [700, 720, 800, 900, 1080];
const routes = ["/", "/reviews/peakwager", "/responsible-gambling",
  "/legal/privacy-policy", "/responsible-gambling/help-directory"];
for (const h of heights) {
  const p = await b.newPage({ viewport: { width: 1440, height: h } });
  console.log(`\n--- viewport 1440x${h} ---`);
  for (const r of routes) {
    await p.goto("http://localhost:3000" + r, { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    await p.evaluate(() => window.scrollTo(0, 2500));
    await p.waitForTimeout(200);
    const m = await p.evaluate(() => {
      const a = document.querySelector("aside.wide\\:sticky");
      if (!a) return null;
      const rect = a.getBoundingClientRect();
      // can the tail be reached? scroll the rail to its end and re-measure
      a.scrollTop = a.scrollHeight;
      const lastCard = a.lastElementChild.getBoundingClientRect();
      const reachable = lastCard.bottom <= window.innerHeight + 1;
      return {
        h: Math.round(rect.height), bottom: Math.round(rect.bottom),
        vh: window.innerHeight,
        scrollH: a.scrollHeight, clientH: a.clientHeight,
        scrolls: a.scrollHeight > a.clientHeight + 1,
        hOver: a.scrollWidth - a.clientWidth,
        reachable,
      };
    });
    if (!m) { console.log(`  ${r.padEnd(40)} (no rail)`); continue; }
    const cut = m.bottom - m.vh;
    console.log(
      `  ${r.padEnd(40)} railH ${String(m.h).padStart(4)}  bottom ${String(m.bottom).padStart(4)}/${m.vh}` +
      `  ${cut > 0 ? `CLIPPED ${cut}` : "fits    "}` +
      `  ${m.scrolls ? `scrolls ${m.scrollH}>${m.clientH}` : "no-scroll        "}` +
      `  hOver ${m.hOver}  tail ${m.reachable ? "reachable" : "UNREACHABLE"}`
    );
  }
  await p.close();
}
await b.close();
