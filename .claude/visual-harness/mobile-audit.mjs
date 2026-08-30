import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const routes = ["/", "/reviews/peakwager", "/blog/how-odds-boosts-actually-work",
  "/legal/privacy-policy", "/categories/esports-betting", "/responsible-gambling",
  "/responsible-gambling/help-directory", "/authors/jane-placeholder"];

// 1. touch targets below 44px on a touch viewport
const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
const small = new Map();
for (const r of routes) {
  await p.goto("http://localhost:3000" + r, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const hits = await p.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll("a, button, input, [role=button]")) {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      if (rect.height >= 44) continue;
      out.push({ h: Math.round(rect.height * 10) / 10,
                 cls: (typeof el.className === "string" ? el.className : "").slice(0, 52),
                 tag: el.tagName.toLowerCase(),
                 text: (el.textContent || "").trim().slice(0, 18) });
    }
    return out;
  });
  for (const h of hits) {
    const k = `${h.h}px  ${h.tag}.${h.cls}`;
    if (!small.has(k)) small.set(k, { n: 0, routes: new Set(), ex: h.text });
    const e = small.get(k); e.n++; e.routes.add(r.split("/")[1] || "home");
  }
}
console.log("=== TOUCH TARGETS UNDER 44px @390 ===");
for (const [k, e] of [...small].sort((a, b) => b[1].n - a[1].n).slice(0, 12))
  console.log(`  ${String(e.n).padStart(3)}x  ${k}  "${e.ex}"  [${[...e.routes].slice(0,4).join(",")}]`);

// 2. rail content parity — what does a phone never see?
console.log("\n=== RAIL CONTENT HIDDEN ON MOBILE ===");
for (const r of routes) {
  await p.goto("http://localhost:3000" + r, { waitUntil: "load" });
  const m = await p.evaluate(() => {
    const aside = document.querySelector("aside.wide\\:sticky");
    if (!aside) return null;
    const hidden = getComputedStyle(aside).display === "none";
    const titles = [...aside.querySelectorAll("h2")].map(h => h.textContent.trim().slice(0, 26));
    return { hidden, titles };
  });
  if (m) console.log(`  ${r.padEnd(42)} railHidden=${m.hidden}  cards: ${m.titles.join(" | ") || "(none)"}`);
}
await b.close();
