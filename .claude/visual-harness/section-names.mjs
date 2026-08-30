import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const routes = [["home","/"],["responsible-gambling","/responsible-gambling"],["help-directory","/responsible-gambling/help-directory"],
  ["review","/reviews/peakwager"],["reviews","/reviews"],["blog","/blog/how-odds-boosts-actually-work"],
  ["categories/[slug]","/categories/esports-betting"],["categories","/categories"],
  ["legal","/legal/privacy-policy"],["authors","/authors/jane-placeholder"]];
let named = 0, unnamed = 0;
for (const [name, url] of routes) {
  await p.goto("http://localhost:3000" + url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const out = [];
    for (const s of document.querySelectorAll("main section, main nav, main aside")) {
      const hasName = s.hasAttribute("aria-label") || s.hasAttribute("aria-labelledby");
      out.push({ tag: s.tagName.toLowerCase(), hasName,
        hint: (s.querySelector("h2,h3")?.textContent ?? s.textContent ?? "").trim().slice(0, 30) });
    }
    return out;
  });
  const bad = r.filter(x => !x.hasName);
  named += r.length - bad.length; unnamed += bad.length;
  console.log(`  ${name.padEnd(20)} ${String(r.length).padStart(2)} landmarks   ${String(bad.length).padStart(2)} unnamed`);
  bad.slice(0, 4).forEach(x => console.log(`        <${x.tag}>  "${x.hint}"`));
}
console.log(`\n  TOTAL  ${named} named, ${unnamed} unnamed`);
await b.close();
