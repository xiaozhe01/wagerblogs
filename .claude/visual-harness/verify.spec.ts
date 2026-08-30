import { test } from "@playwright/test";

const say = (s: string) => process.stdout.write(s + "\n");

/* Values cross the page.evaluate boundary untyped; this is the shape we read them at. */
type Probe = Record<string, string | number | boolean | null | undefined | Probe | Probe[]>;

const INK = `
  const lineRects = (el) => {
    const rects = [];
    for (const node of el.childNodes) {
      if (node.nodeType !== 3 || !(node.textContent||'').trim()) continue;
      const rg = document.createRange(); rg.selectNodeContents(node);
      for (const r of rg.getClientRects()) if (r.width > 0.5 && r.height > 0.5) rects.push(r);
    }
    return rects;
  };
  const vis = (el) => {
    if (!el.getClientRects().length) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) !== 0;
  };
  const leaves = (root) => {
    const out = []; const walk = (el) => {
      if (!vis(el)) return;
      if (Array.from(el.childNodes).some(n => n.nodeType===3 && (n.textContent||'').trim())) out.push(el);
      for (const c of el.children) walk(c);
    }; walk(root); return out;
  };
  const trim = (el) => {
    const rects = lineRects(el); if (!rects.length) return null;
    const size = parseFloat(getComputedStyle(el).fontSize);
    const first = rects.reduce((a,b)=> b.top<a.top?b:a);
    const last  = rects.reduce((a,b)=> b.bottom>a.bottom?b:a);
    return { top: first.top + Math.max(0,(first.height-size)/2),
             bottom: last.bottom - Math.max(0,(last.height-size)/2) };
  };
  const inkTop = (root) => { let v=null; for (const l of leaves(root)) { const t=trim(l); if(t&&(v===null||t.top<v)) v=t.top; } return v; };
  const inkBot = (root) => { let v=null; for (const l of leaves(root)) { const t=trim(l); if(t&&(v===null||t.bottom>v)) v=t.bottom; } return v; };
  const r2 = (n) => n===null?null:Math.round(n*100)/100;
`;

const VPS: Array<[string, number, number]> = [
  ["d1440", 1440, 900],
  ["m390", 390, 844],
];

for (const [vp, width, height] of VPS) {
  test.describe(vp, () => {
    test.use({ viewport: { width, height } });

    test("ranked-row CTA pair heights", async ({ page }) => {
      await page.goto("/", { waitUntil: "load" });
      await page.evaluate(async () => await document.fonts.ready);
      const rows = await page.evaluate(`(() => {
        const out = [];
        for (const li of document.querySelectorAll('ol > li')) {
          const p = li.querySelector('.btn-primary');
          const s = li.querySelector('.btn-secondary');
          if (!p || !s) continue;
          const rp = p.getBoundingClientRect(), rs = s.getBoundingClientRect();
          const cp = getComputedStyle(p), cs2 = getComputedStyle(s);
          out.push({
            primary: { h: Math.round(rp.height*100)/100, size: parseFloat(cp.fontSize), lh: cp.lineHeight,
                       border: cp.borderTopWidth, minH: cp.minHeight, pad: cp.paddingTop, top: Math.round(rp.top) },
            secondary:{ h: Math.round(rs.height*100)/100, size: parseFloat(cs2.fontSize), lh: cs2.lineHeight,
                       border: cs2.borderTopWidth, minH: cs2.minHeight, pad: cs2.paddingTop, top: Math.round(rs.top) },
          });
        }
        return out;
      })()`);
      say(`\n[${vp}] RANKED ROW CTA PAIR (home)`);
      for (const r of rows as unknown as Probe[]) {
        say(
          `  primary h=${r.primary.h} (size ${r.primary.size} lh ${r.primary.lh} border ${r.primary.border} minH ${r.primary.minH}) | ` +
            `secondary h=${r.secondary.h} (border ${r.secondary.border}) | delta ${(r.secondary.h - r.primary.h).toFixed(2)}px | topDelta ${r.secondary.top - r.primary.top}`,
        );
      }
    });

    test("market stat card ink", async ({ page }) => {
      await page.goto("/", { waitUntil: "load" });
      await page.evaluate(async () => await document.fonts.ready);
      const out = await page.evaluate(`(() => { ${INK}
        const res = [];
        for (const card of document.querySelectorAll('.card.text-center')) {
          const kids = Array.from(card.children).filter(vis)
            .sort((a,b)=> a.getBoundingClientRect().top - b.getBoundingClientRect().top);
          const rect = card.getBoundingClientRect();
          const gaps = [];
          for (let i=0;i<kids.length-1;i++) {
            const a = inkBot(kids[i]), b = inkTop(kids[i+1]);
            gaps.push({ a: kids[i].textContent.trim().slice(0,16), b: kids[i+1].textContent.trim().slice(0,16),
                        ink: r2(b-a), box: r2(kids[i+1].getBoundingClientRect().top - kids[i].getBoundingClientRect().bottom) });
          }
          res.push({ h: r2(rect.height), inkT: r2(inkTop(card)-rect.top), inkB: r2(rect.bottom-inkBot(card)),
                     pad: getComputedStyle(card).paddingTop, gaps });
          break;
        }
        return res;
      })()`);
      say(`\n[${vp}] MARKET STAT CARD (MarketCard.tsx)`);
      for (const c of out as unknown as Probe[]) {
        say(`  h=${c.h} pad=${c.pad} inkTop=${c.inkT} inkBottom=${c.inkB}`);
        for (const g of c.gaps) say(`    "${g.a}" -> "${g.b}"  ink ${g.ink}  box ${g.box}`);
      }
    });

    test("page header h1 -> next ink gap across routes", async ({ page }) => {
      const routes = [
        ["home", "/"],
        ["blog-post", "/blog/how-odds-boosts-actually-work"],
        ["review", "/reviews/peakwager"],
        ["category", "/categories/esports-betting"],
        ["author", "/authors/jane-placeholder"],
        ["legal-privacy", "/legal/privacy-policy"],
        ["responsible-gambling", "/responsible-gambling"],
      ];
      say(`\n[${vp}] PAGE HEADER: h1 ink -> next sibling ink`);
      for (const [name, path] of routes) {
        await page.goto(path, { waitUntil: "load" });
        await page.evaluate(async () => await document.fonts.ready);
        const r = await page.evaluate(`(() => { ${INK}
          const h1 = document.querySelector('h1'); if (!h1) return null;
          const parent = h1.parentElement;
          const kids = Array.from(parent.children).filter(vis);
          const i = kids.indexOf(h1);
          const next = kids[i+1]; if (!next) return null;
          const cs = getComputedStyle(parent);
          const c1 = getComputedStyle(h1);
          return { gapCss: cs.rowGap, cls: (parent.className||'').slice(0,64),
                   h1size: parseFloat(c1.fontSize), h1lh: c1.lineHeight,
                   box: r2(next.getBoundingClientRect().top - h1.getBoundingClientRect().bottom),
                   ink: r2(inkTop(next) - inkBot(h1)),
                   nextTag: next.tagName.toLowerCase(),
                   nextSize: parseFloat(getComputedStyle(next).fontSize) };
        })()`);
        if (r) {
          const x = r as unknown as Probe;
          say(
            `  ${name.padEnd(21)} h1 ${x.h1size}px/${x.h1lh} -> <${x.nextTag}> ${x.nextSize}px | rowGap ${x.gapCss} | box ${x.box} | INK ${x.ink} | ${x.cls}`,
          );
        } else say(`  ${name.padEnd(21)} (no h1/sibling)`);
      }
    });

    test("bonus offer card grid: h-full dead space", async ({ page }) => {
      await page.goto("/", { waitUntil: "load" });
      await page.evaluate(async () => await document.fonts.ready);
      const out = await page.evaluate(`(() => { ${INK}
        const res = [];
        for (const card of document.querySelectorAll('article.card.h-full')) {
          const rect = card.getBoundingClientRect();
          res.push({ h: r2(rect.height), inkT: r2(inkTop(card)-rect.top), inkB: r2(rect.bottom-inkBot(card)),
                     pad: getComputedStyle(card).paddingBottom,
                     name: (card.querySelector('span')||{}).textContent });
        }
        return res;
      })()`);
      say(`\n[${vp}] BONUS OFFER CARDS (h-full, same grid row)`);
      for (const c of out as unknown as Probe[])
        say(`  h=${c.h} padB=${c.pad} inkTop=${c.inkT} inkBottom=${c.inkB}  "${(c.name||'').slice(0,24)}"`);
    });
  });
}
