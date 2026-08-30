import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:4400/responsible-gambling", { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);

const probe = async (label) => {
  const rows = await p.evaluate(() => {
    const lum = (c) => {
      const q = c.match(/[\d.]+/g).map(Number);
      const [r, g, bl] = q.slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); });
      return 0.2126*r + 0.7152*g + 0.0722*bl;
    };
    const alpha = (c) => { const q = c.match(/[\d.]+/g).map(Number); return q.length > 3 ? q[3] : 1; };
    const flatten = (fg, bg) => {
      const a = alpha(fg); if (a >= 1) return fg;
      const f = fg.match(/[\d.]+/g).map(Number), k = bg.match(/[\d.]+/g).map(Number);
      return 'rgb(' + [0,1,2].map(i => Math.round(f[i]*a + k[i]*(1-a))).join(',') + ')';
    };
    const bgOf = (el) => { let n = el; while (n) { const c = getComputedStyle(n).backgroundColor; if (c && alpha(c) > 0) return c; n = n.parentElement; } return 'rgb(255,255,255)'; };
    const ratio = (x, y) => { const a = lum(x), c = lum(y); return Math.round(((Math.max(a,c)+0.05)/(Math.min(a,c)+0.05))*100)/100; };

    const scope = document.querySelector("#self-check");
    const out = [];
    const add = (name, el, prop) => {
      if (!el) return;
      const cs = getComputedStyle(el);
      const col = cs[prop];
      if (!col || alpha(col) === 0) return;
      const bg = bgOf(el.parentElement || el);
      const eff = flatten(col, bg);
      const r = el.getBoundingClientRect();
      out.push({ name, raw: col, eff, bg, ratio: ratio(eff, bg),
                 w: cs.borderTopWidth, box: `${Math.round(r.width)}x${Math.round(r.height)}` });
    };
    const label0 = scope.querySelector("label");
    add("label border (control boundary)", label0, "borderTopColor");
    add("radio circle border", label0?.querySelector("span"), "borderTopColor");
    add("hint badge border", label0?.querySelectorAll("span")[2], "borderTopColor");
    add("card border", scope.querySelector(".border"), "borderTopColor");
    return out;
  });
  console.log(`\n  --- ${label} ---`);
  console.log(`  ${"element".padEnd(34)} ${"border".padEnd(7)} ${"effective".padEnd(20)} ratio  need  verdict`);
  for (const r of rows)
    console.log(`  ${r.name.padEnd(34)} ${r.w.padEnd(7)} ${r.eff.padEnd(20)} ${String(r.ratio).padStart(5)}     3  ${r.ratio >= 3 ? "pass" : "**FAIL**"}   ${r.box}`);
};

await probe("unchecked");
await p.locator("#self-check label").first().click();
await p.waitForTimeout(250);
await probe("checked");
await b.close();
