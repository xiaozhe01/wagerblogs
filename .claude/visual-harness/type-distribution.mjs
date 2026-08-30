import { chromium } from "@playwright/test";
const routes = [["home","/"],["blog-post","/blog/sample-post"],["review","/reviews/peakwager"],
  ["category","/categories/esports-betting"],["author","/authors/jane-placeholder"],
  ["legal-privacy","/legal/privacy-policy"],["responsible-gambling","/responsible-gambling"]];
const b = await chromium.launch({ channel: "chrome" });
let tot = 0, small = 0, w400 = 0;
console.log("route                 nodes    <=12px   of which w400");
for (const [name, url] of routes) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto("http://localhost:3000" + url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const out = [];
    const walk = (n) => { for (const c of n.childNodes) {
      if (c.nodeType === 3 && c.textContent.trim()) {
        const cs = getComputedStyle(c.parentElement);
        if (cs.display !== "none" && cs.visibility !== "hidden")
          out.push({ s: Math.round(parseFloat(cs.fontSize)), w: +cs.fontWeight });
      } else if (c.nodeType === 1) walk(c); } };
    walk(document.body);
    return out;
  });
  const sm = r.filter(x => x.s <= 12);
  console.log(`  ${name.padEnd(20)} ${String(r.length).padStart(4)}  ${String(sm.length).padStart(4)} (${Math.round(sm.length/r.length*100)}%)  ${String(sm.filter(x=>x.w===400).length).padStart(6)}`);
  tot += r.length; small += sm.length; w400 += r.filter(x=>x.w===400).length;
  await p.close();
}
console.log(`\n  TOTAL ${tot} nodes — ${Math.round(small/tot*100)}% at <=12px, ${Math.round(w400/tot*100)}% at weight 400`);
await b.close();
