import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
for (const w of [1600, 1440, 1370, 1100, 900, 430]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto("http://localhost:3000/blog/sample-post", { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const main = document.querySelector("main");
    const art = main.querySelector("article");
    const prose = [...art.children].filter((e) => e.tagName === "DIV")
      .sort((a, c) => c.children.length - a.children.length)[0];
    const para = [...prose.children].find((e) => e.tagName === "P");
    const cs = getComputedStyle(para);
    // real chars-per-line: measure one line box of the paragraph
    const rects = [...(() => { const rg = document.createRange(); rg.selectNodeContents(para); return rg.getClientRects(); })()];
    const line = rects.find((r) => r.width > 50);
    // average advance width of the rendered text
    const chars = para.textContent.trim().length;
    const rg2 = document.createRange(); rg2.selectNodeContents(para);
    const totalW = [...rg2.getClientRects()].reduce((s, r) => s + r.width, 0);
    const avg = totalW / chars;
    return {
      col: Math.round(main.getBoundingClientRect().width),
      article: Math.round(art.getBoundingClientRect().width),
      para: Math.round(para.getBoundingClientRect().width),
      fontSize: cs.fontSize, lineHeight: cs.lineHeight,
      cpl: line ? Math.round(line.width / avg) : null,
      cplIfFull: Math.round(main.getBoundingClientRect().width / avg),
    };
  });
  console.log(`${String(w).padStart(5)}px  col ${String(r.col).padStart(4)}  article ${String(r.article).padStart(4)}  para ${String(r.para).padStart(4)}  font ${r.fontSize}/${r.lineHeight}  CPL ${String(r.cpl).padStart(3)}   (full-col would be ${r.cplIfFull})`);
  await p.close();
}
await b.close();
