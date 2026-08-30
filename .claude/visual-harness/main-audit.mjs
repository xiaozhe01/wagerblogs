import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const base = process.argv[2] || "http://localhost:3000";
const routes = process.argv.slice(3);
for (const url of routes) {
  await p.goto(base + url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const main = document.querySelector("main");
    const kids = [...main.children].filter((e) => e.tagName !== "SCRIPT");
    const bad = kids.filter((el) => {
      const cs = getComputedStyle(el);
      const outer = (parseFloat(cs.marginTop)||0)+(parseFloat(cs.marginBottom)||0)
                  + (parseFloat(cs.paddingTop)||0)+(parseFloat(cs.paddingBottom)||0);
      const semantic = /^(SECTION|HEADER|ARTICLE|ASIDE|NAV|FOOTER|OL|UL|FORM)$/.test(el.tagName);
      return outer > 0 || !semantic;
    }).map((el) => `<${el.tagName.toLowerCase()}>` +
      (getComputedStyle(el).paddingTop !== "0px" ? ` pt${parseFloat(getComputedStyle(el).paddingTop)}` : "") +
      (getComputedStyle(el).paddingBottom !== "0px" ? ` pb${parseFloat(getComputedStyle(el).paddingBottom)}` : ""));
    return { gap: getComputedStyle(main).rowGap, total: kids.length, bad };
  });
  console.log(`  ${url.padEnd(38)} main gap ${r.gap.padEnd(6)} children ${r.total}  violations ${r.bad.length}${r.bad.length ? "  " + r.bad.join(", ") : ""}`);
}
await b.close();
