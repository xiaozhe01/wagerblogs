import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });

async function check(label, reducedMotion) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3000/legal/privacy-policy", { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const behavior = await p.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  const padding = await p.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop);

  // sample scroll position right after activating an anchor
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(150);
  await p.locator('aside.wide\\:sticky a[href="#section-3"]').first().click();
  await p.waitForTimeout(60);
  const mid = await p.evaluate(() => window.scrollY);
  await p.waitForTimeout(900);
  const end = await p.evaluate(() => window.scrollY);
  const landing = await p.evaluate(() =>
    Math.round(document.getElementById("section-3").getBoundingClientRect().top));

  console.log(`${label.padEnd(22)} scroll-behavior=${behavior.padEnd(6)} scroll-padding-top=${padding.padEnd(5)}` +
    ` midScroll=${String(mid).padStart(5)} endScroll=${String(end).padStart(5)}` +
    ` animated=${mid !== end && mid !== 0 ? "YES" : mid === end ? "no (instant)" : "?"}` +
    ` targetTop=${landing}px`);
  await ctx.close();
}

await check("default", "no-preference");
await check("reduced-motion", "reduce");
await b.close();
