import { chromium } from "@playwright/test";
const routes = ["/","/reviews","/reviews/peakwager","/categories/esports-betting",
  "/blog/sample-post","/legal/privacy-policy","/authors/jane-placeholder",
  "/responsible-gambling","/responsible-gambling/help-directory","/categories"];
const b = await chromium.launch({ channel: "chrome" });
let bad = 0;
for (const w of [1370, 390]) {
  console.log(`\n  ${w}px`);
  for (const url of routes) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto("http://localhost:3000" + url, { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    const r = await p.evaluate(() => ({
      doc: document.documentElement.scrollWidth, win: window.innerWidth,
      wide: [...document.querySelectorAll("main *")].filter(e => {
        const b = e.getBoundingClientRect();
        return b.width > 0 && b.right > document.documentElement.clientWidth + 1;
      }).slice(0,3).map(e => e.tagName.toLowerCase() + "." + String(e.className).split(" ")[0]),
    }));
    const over = r.doc - r.win;
    if (over > 1 || r.wide.length) { bad++;
      console.log(`    ${url.padEnd(40)} OVERFLOW +${over}px  ${r.wide.join(", ")}`); }
    else console.log(`    ${url.padEnd(40)} ok`);
    await p.close();
  }
}
console.log(bad ? `\n  ${bad} overflow(s)` : "\n  no horizontal overflow at either width");
await b.close();
