import { chromium } from "@playwright/test";
const routes = [["home","/"],["reviews","/reviews"],["review","/reviews/peakwager"],
  ["categories","/categories"],["category","/categories/esports-betting"],
  ["blog","/blog/sample-post"],["legal","/legal/privacy-policy"],
  ["authors","/authors/jane-placeholder"],["rg","/responsible-gambling"],
  ["help-dir","/responsible-gambling/help-directory"],["404","/nope-404"]];
const b = await chromium.launch({ channel: "chrome" });
const h1s = {}, h2s = {}, h3n = {}, leads = {};
for (const [name, url] of routes) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto("http://localhost:3000" + url, { waitUntil: "load" }).catch(()=>{});
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const m = document.querySelector("main"); if (!m) return null;
    const px = (e) => Math.round(parseFloat(getComputedStyle(e).fontSize));
    const h1 = m.querySelector("h1");
    const lead = h1 && h1.parentElement ? [...h1.parentElement.querySelectorAll("p")][0] : null;
    return { h1: h1 ? px(h1) : null,
      h2: [...m.querySelectorAll("h2")].map(px),
      h3: m.querySelectorAll("h3").length,
      h4plus: m.querySelectorAll("h4,h5,h6").length,
      lead: lead ? px(lead) : null };
  });
  if (r) { h1s[name] = r.h1; h2s[name] = r.h2; h3n[name] = [r.h3, r.h4plus]; leads[name] = r.lead; }
  await p.close();
}
console.log("h1 per route:");
const u1 = [...new Set(Object.values(h1s))].sort((a,c)=>c-a);
for (const [k,v] of Object.entries(h1s)) console.log(`   ${k.padEnd(11)} ${v}px`);
console.log(`   → ${u1.length} distinct h1 size(s): ${u1.join(", ")}\n`);
console.log("lead paragraph per route:");
for (const [k,v] of Object.entries(leads)) console.log(`   ${k.padEnd(11)} ${v ?? "-"}px`);
console.log(`   → ${[...new Set(Object.values(leads).filter(Boolean))].sort((a,c)=>c-a).join(", ")}\n`);
console.log("h3 / h4-h6 counts:");
let h3total = 0, h4total = 0;
for (const [k,v] of Object.entries(h3n)) { h3total += v[0]; h4total += v[1];
  console.log(`   ${k.padEnd(11)} h3:${String(v[0]).padStart(2)}  h4+:${v[1]}`); }
console.log(`   → ${h3total} h3 sitewide, ${h4total} h4-h6`);
const allH2 = Object.values(h2s).flat();
console.log(`\nh2 sizes sitewide: ${[...new Set(allH2)].sort((a,c)=>c-a).map(s=>`${s}px×${allH2.filter(x=>x===s).length}`).join(", ")}`);
await b.close();
