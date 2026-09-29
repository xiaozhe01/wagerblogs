import { chromium } from "@playwright/test";
import { pathToFileURL } from "node:url";

// Exported so check-example-routes.mjs can read the list without running the
// check. Everything below is guarded for the same reason: importing this file
// used to launch a browser.
export const routes = [
  "/",
  "/reviews",
  "/reviews/sportsbooks/examplebet",
  "/categories/esports-betting",
  // Was /articles/how-odds-boosts-actually-work until 2026-09-29, when all
  // three articles were reverted to draft and it began 404ing. The news story
  // renders the same reading template, so the sample holds.
  "/news/football/wisconsin-penn-state-score-comeback-fickell",
  "/legal/privacy-policy",
  "/authors/jane",
  "/responsible-gambling",
  "/responsible-gambling/help-directory",
  "/categories",
];
if (import.meta.url !== pathToFileURL(process.argv[1] ?? "").href) {
  // Imported for the route list alone — nothing to run.
} else {
  const b = await chromium.launch({ channel: "chrome" });
  let bad = 0;
  // 320 is here because the width set above it never caught the help-directory
  // card overflowing by 78px — the narrowest phone is where min-w-0 omissions show.
  for (const w of [1370, 390, 320]) {
    console.log(`\n  ${w}px`);
    for (const url of routes) {
      const p = await b.newPage({ viewport: { width: w, height: 900 } });
      const res = await p.goto("http://localhost:3000" + url, { waitUntil: "load" });
      // A 404 page lays out fine and reports "ok", which is how three dead routes
      // sat in this list unnoticed. Fail on the status, not just the geometry.
      if (!res.ok()) {
        bad++;
        console.log(`    ${url.padEnd(40)} DEAD ROUTE — HTTP ${res.status()}`);
        await p.close();
        continue;
      }
      await p.evaluate(() => document.fonts.ready);
      const r = await p.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        win: window.innerWidth,
        wide: [...document.querySelectorAll("main *")]
          .filter((e) => {
            const b = e.getBoundingClientRect();
            if (b.width === 0 || b.right <= document.documentElement.clientWidth + 1) return false;
            // An element wider than the viewport is only a defect if something
            // renders past the edge. Inside a clipping ancestor — `truncate`, a
            // scroller — it is clipped by design, and flagging it means every
            // ellipsised string reads as an overflow forever.
            for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
              if (getComputedStyle(n).overflow !== "visible") return false;
            }
            return true;
          })
          .slice(0, 3)
          .map((e) => e.tagName.toLowerCase() + "." + String(e.className).split(" ")[0]),
      }));
      // scrollWidth is measured against clientWidth, which excludes the scrollbar,
      // so this goes negative on a page that does not scroll. Only positive means
      // overflow.
      const over = r.doc - r.win;
      if (over > 1 || r.wide.length) {
        bad++;
        const px = over > 1 ? `+${over}px` : "element";
        console.log(`    ${url.padEnd(40)} OVERFLOW ${px}  ${r.wide.join(", ")}`);
      } else console.log(`    ${url.padEnd(40)} ok`);
      await p.close();
    }
  }
  console.log(bad ? `\n  ${bad} overflow(s)` : "\n  no horizontal overflow at any width");
  await b.close();
}
