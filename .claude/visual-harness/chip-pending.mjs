import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3000/categories/esports-betting", { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);
const c = await p.context().newCDPSession(p);
await c.send("Network.enable");
await c.send("Network.emulateNetworkConditions", {
  offline: false, latency: 800, downloadThroughput: 25000, uploadThroughput: 25000,
});
const chip = p.locator('nav[aria-label="Filter by article type"] a').nth(1);
await chip.click();
const seen = [];
for (let i = 0; i < 10; i++) {
  seen.push(await p.evaluate(() => {
    const el = document.querySelector("[data-pending]");
    return el ? +(+getComputedStyle(el).opacity).toFixed(2) : null;
  }));
  await p.waitForTimeout(70);
}
console.log("data-pending opacity samples:", seen.map(v => v === null ? "-" : v).join(" "));
console.log(seen.some(v => v !== null) ? "pending state IS observable" : "pending never rendered");
await b.close();
