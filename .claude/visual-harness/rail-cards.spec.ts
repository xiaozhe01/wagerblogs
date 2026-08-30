import { test } from "@playwright/test";

// Rail card geometry: for every card in the aside, report the card box, its
// padding, and each list row's OWN box — the row <a> is full-bleed via
// `-mx-3 px-3`, so its rect IS the hover background rect. Anything where that
// rect reaches the card's border is a hover that touches the outer edge.

const ROUTES: Array<[string, string]> = [
  ["home", "/"],
  ["review", "/reviews/peakwager"],
  ["blog-post", "/blog/how-odds-boosts-actually-work"],
  ["legal", "/legal/privacy-policy"],
  ["responsible-gambling", "/responsible-gambling"],
  ["help-directory", "/responsible-gambling/help-directory"],
  ["category", "/categories/esports-betting"],
  ["not-found", "/this-route-does-not-exist"],
];

test.use({ viewport: { width: 1440, height: 900 } });

for (const [name, path] of ROUTES) {
  test(name, async ({ page }) => {
    await page.goto(path, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);

    const out = await page.evaluate(() => {
      const r2 = (n: number) => Math.round(n * 100) / 100;
      // Not `querySelector("aside")` — routes like /responsible-gambling put an
      // inline note <aside> earlier in the document. The rail is the sticky one.
      const aside = document.querySelector<HTMLElement>("aside.wide\\:sticky");
      if (!aside) return [];
      const cards = Array.from(
        aside.querySelectorAll<HTMLElement>(".card, .card-dark, .card-compact")
      );
      return cards.map((card) => {
        const cs = getComputedStyle(card);
        const cr = card.getBoundingClientRect();
        const bT = parseFloat(cs.borderTopWidth);
        const bB = parseFloat(cs.borderBottomWidth);
        const bL = parseFloat(cs.borderLeftWidth);
        const title = card.querySelector("h2")?.textContent?.trim().slice(0, 28) ?? "(no h2)";

        // rows = the anchors/li that carry hover backgrounds
        const rows = Array.from(card.querySelectorAll<HTMLElement>("li > a, li > *"))
          .filter((el) => el.getClientRects().length)
          .map((el) => {
            const r = el.getBoundingClientRect();
            const s = getComputedStyle(el);
            return {
              h: r2(r.height),
              // distance from row edge to the card's INNER border edge
              leftInset: r2(r.left - (cr.left + bL)),
              rightInset: r2(cr.right - parseFloat(String(bL)) - r.right),
              bottomToBorder: r2(cr.bottom - bB - r.bottom),
              padY: `${s.paddingTop}/${s.paddingBottom}`,
              minH: s.minHeight,
              borderB: parseFloat(s.borderBottomWidth),
              radius: s.borderBottomLeftRadius,
              text: (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 22),
            };
          });

        // gaps between consecutive rows (box-to-box)
        const gaps: number[] = [];
        const lis = Array.from(card.querySelectorAll<HTMLElement>("li")).filter(
          (el) => el.getClientRects().length
        );
        for (let i = 0; i < lis.length - 1; i++) {
          gaps.push(
            r2(lis[i + 1].getBoundingClientRect().top - lis[i].getBoundingClientRect().bottom)
          );
        }

        return {
          title,
          cls: card.className.slice(0, 60),
          padding: `${cs.paddingTop}/${cs.paddingRight}/${cs.paddingBottom}/${cs.paddingLeft}`,
          radius: cs.borderTopLeftRadius,
          border: `${bT}/${bB}`,
          rowCount: rows.length,
          rowHeights: [...new Set(rows.map((r) => r.h))],
          rowPadY: [...new Set(rows.map((r) => r.padY))],
          rowMinH: [...new Set(rows.map((r) => r.minH))],
          rowInsets: [...new Set(rows.map((r) => `L${r.leftInset}/R${r.rightInset}`))],
          lastRowToBorder: rows.length ? rows[rows.length - 1].bottomToBorder : null,
          rowGaps: [...new Set(gaps)],
        };
      });
    });

    console.log(`\n===== ${name} =====`);
    for (const c of out) {
      console.log(`  "${c.title}"  [${c.cls}]`);
      console.log(
        `      pad ${c.padding}  radius ${c.radius}  border ${c.border}  rows ${c.rowCount}`
      );
      if (c.rowCount) {
        console.log(
          `      rowH ${JSON.stringify(c.rowHeights)}  padY ${JSON.stringify(c.rowPadY)}  minH ${JSON.stringify(c.rowMinH)}`
        );
        console.log(
          `      insets ${JSON.stringify(c.rowInsets)}  gaps ${JSON.stringify(c.rowGaps)}  lastRow->border ${c.lastRowToBorder}px`
        );
      }
    }
  });
}
