import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });

async function sampleFade(p, label, act) {
  await p.evaluate(() => { const e = document.querySelector(".route-transition"); if (e) e.dataset.mark = "old"; });
  await act();
  const s = [];
  for (let i = 0; i < 6; i++) {
    s.push(await p.evaluate(() => {
      const e = document.querySelector(".route-transition");
      return e ? +(+getComputedStyle(e).opacity).toFixed(2) : -1;
    }));
    await p.waitForTimeout(35);
  }
  const reused = await p.evaluate(() => document.querySelector(".route-transition")?.dataset.mark === "old");
  const faded = s.some((v) => v < 0.99);
  console.log(`  ${label.padEnd(26)} opacity ${s.join(" ")}  nodeReused=${reused}  ${faded ? "FADES" : "no fade"}`);
}

for (const rm of ["no-preference", "reduce"]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: rm });
  const p = await ctx.newPage();
  console.log(`\n--- reducedMotion: ${rm} ---`);

  await p.goto("http://localhost:3000/reviews", { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await sampleFade(p, "route change (ArrowLink)", async () => {
    await p.locator('main a[href^="/reviews/"]').first().click();
  });

  await p.goto("http://localhost:3000/categories/esports-betting", { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const chip = p.locator('nav[aria-label="Filter by article type"] a').nth(1);
  await sampleFade(p, "chip filter (searchParams)", async () => { await chip.click(); });

  // scroll restoration must stay instant
  await p.goto("http://localhost:3000/reviews", { waitUntil: "load" });
  await p.evaluate(() => window.scrollTo(0, 2000));
  await p.waitForTimeout(300);
  await p.locator('main a[href^="/reviews/"]').first().click();
  await p.waitForTimeout(60);
  const y = await p.evaluate(() => Math.round(window.scrollY));
  console.log(`  ${"scrollY 60ms after nav".padEnd(26)} ${y}  ${y === 0 ? "instant" : "GLIDING"}`);
  await ctx.close();
}
await b.close();
