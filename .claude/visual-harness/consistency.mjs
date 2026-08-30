// Single-snapshot consistency analyser: unlike analyze.mjs (a before/after
// differ) this looks for one thing — the SAME role rendered DIFFERENT ways
// across routes/viewports. Usage: node consistency.mjs <sweep.jsonl>
import { readFileSync } from "node:fs";

const rows = readFileSync(process.argv[2], "utf8")
  .split("\n")
  .filter(Boolean)
  .map((l) => JSON.parse(l));

const SIZE_SCALE = new Set([12, 14, 15, 16, 19, 22, 28, 30, 38, 44]);
const LEAD_SCALE = new Set([1.12, 1.2, 1.5, 1.6, 1.65, 1.7]);
const WEIGHTS = new Set([400, 500, 600, 700, 800]);
// named scale + the --spacing-legacy-* escape hatches (2/6/10/12/14/20/28)
const SPACE_SCALE = new Set([0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 60]);

const by = (t) => rows.filter((r) => r.type === t);
const uniq = (a) => [...new Set(a)];
const sec = (t) => console.log(`\n\n${"=".repeat(72)}\n${t}\n${"=".repeat(72)}`);
const near = (v, set) => [...set].some((s) => Math.abs(s - v) < 0.6);

// ---------- A. page-level defects -------------------------------------------
sec("A. PAGE DEFECTS — horizontal scroll");
const pages = by("page").filter((p) => p.scrollW > p.innerW + 0.5);
if (!pages.length) console.log("  none");
for (const p of pages)
  console.log(`  ${p.route}/${p.vp}  scrollW ${p.scrollW} > innerW ${p.innerW}  (+${p.scrollW - p.innerW}px)`);

// ---------- B. off-scale font sizes ------------------------------------------
sec("B. OFF-SCALE FONT SIZES (not a --text-* token)");
const offSize = new Map();
for (const r of by("text")) {
  if (near(r.size, SIZE_SCALE)) continue;
  const k = `${r.size}px|${r.tag}|${(r.cls || "").split(/\s+/).slice(0, 4).join(" ")}`;
  if (!offSize.has(k)) offSize.set(k, { n: 0, routes: new Set(), vps: new Set(), ex: r.text });
  const e = offSize.get(k);
  e.n++; e.routes.add(r.route); e.vps.add(r.vp);
}
if (!offSize.size) console.log("  none");
for (const [k, e] of [...offSize].sort((a, b) => b[1].n - a[1].n).slice(0, 25))
  console.log(`  ${String(e.n).padStart(4)}x  ${k}  [${[...e.vps].join(",")}]  ${[...e.routes].slice(0, 5).join(",")}  "${e.ex.slice(0, 30)}"`);

// ---------- C. off-scale leading ---------------------------------------------
sec("C. OFF-SCALE LINE-HEIGHT RATIOS (not a --leading-* token)");
const offLead = new Map();
for (const r of by("text")) {
  if (r.lines < 2) continue; // ratio only observable on wrapped text
  if (near(r.ratio, LEAD_SCALE)) continue;
  const k = `${r.ratio}|${r.size}px|${r.tag}|${(r.cls || "").split(/\s+/).slice(0, 4).join(" ")}`;
  if (!offLead.has(k)) offLead.set(k, { n: 0, routes: new Set(), vps: new Set(), ex: r.text });
  const e = offLead.get(k);
  e.n++; e.routes.add(r.route); e.vps.add(r.vp);
}
if (!offLead.size) console.log("  none");
for (const [k, e] of [...offLead].sort((a, b) => b[1].n - a[1].n).slice(0, 20))
  console.log(`  ${String(e.n).padStart(4)}x  ratio ${k}  [${[...e.vps].join(",")}]  ${[...e.routes].slice(0, 4).join(",")}  "${e.ex.slice(0, 30)}"`);

// ---------- D. heading scale variance across routes ---------------------------
sec("D. HEADING SIZE VARIANCE — same tag, same viewport, different routes");
for (const tag of ["h1", "h2", "h3", "h4"]) {
  for (const vp of uniq(rows.map((r) => r.vp))) {
    const hits = by("text").filter((r) => r.tag === tag && r.vp === vp);
    if (!hits.length) continue;
    const sizes = new Map();
    for (const h of hits) {
      if (!sizes.has(h.size)) sizes.set(h.size, new Set());
      sizes.get(h.size).add(h.route);
    }
    if (sizes.size < 2) continue;
    const parts = [...sizes].sort((a, b) => b[0] - a[0])
      .map(([s, rs]) => `${s}px[${[...rs].slice(0, 6).join(",")}]`);
    console.log(`  ${tag} @${vp}: ${parts.join("  ")}`);
  }
}

// ---------- E. same class, different rendering --------------------------------
sec("E. SAME CLASS STRING -> DIFFERENT SIZE/WEIGHT (specificity or override drift)");
const cls = new Map();
for (const r of by("text")) {
  const c = (r.cls || "").trim();
  if (!c || c.length > 110) continue;
  const k = `${r.vp}|${r.tag}|${c}`;
  if (!cls.has(k)) cls.set(k, []);
  cls.get(k).push(r);
}
let eN = 0;
for (const [k, arr] of cls) {
  const sizes = uniq(arr.map((a) => a.size));
  const weights = uniq(arr.map((a) => a.weight));
  if (sizes.length < 2 && weights.length < 2) continue;
  if (eN++ > 18) break;
  const [vp, tag, c] = k.split("|");
  console.log(`  @${vp} ${tag}.${c.slice(0, 70)}`);
  console.log(`      sizes ${sizes.join("/")}  weights ${weights.join("/")}  routes ${uniq(arr.map((a) => a.route)).slice(0, 6).join(",")}`);
}
if (!eN) console.log("  none");

// ---------- F. card padding variance ------------------------------------------
sec("F. .card PADDING VARIANCE (same component, different insets)");
for (const vp of uniq(rows.map((r) => r.vp))) {
  const cards = by("box").filter((b) => b.vp === vp && /(^|\s)card(\s|$)/.test(b.cls || ""));
  if (!cards.length) continue;
  const shapes = new Map();
  for (const c of cards) {
    const k = `${c.padT}/${c.padR}/${c.padB}/${c.padL}`;
    if (!shapes.has(k)) shapes.set(k, { n: 0, routes: new Set(), ex: c.label });
    const e = shapes.get(k);
    e.n++; e.routes.add(c.route);
  }
  if (shapes.size < 2) continue;
  console.log(`  @${vp}  ${shapes.size} distinct padding shapes across ${cards.length} cards:`);
  for (const [k, e] of [...shapes].sort((a, b) => b[1].n - a[1].n))
    console.log(`      ${String(e.n).padStart(3)}x  pad ${k.padEnd(22)} ${[...e.routes].slice(0, 5).join(",")}  "${(e.ex || "").slice(0, 26)}"`);
}

// ---------- G. control height variance ----------------------------------------
sec("G. CONTROL HEIGHT VARIANCE — same class family, different heights");
const ctl = new Map();
for (const r of by("control")) {
  const fam = (r.cls || "").match(/\b(btn-primary|btn-secondary|chip|badge|pill|tag)\b/);
  if (!fam) continue;
  const k = `${r.vp}|${fam[1]}`;
  if (!ctl.has(k)) ctl.set(k, []);
  ctl.get(k).push(r);
}
for (const [k, arr] of [...ctl].sort()) {
  const hs = uniq(arr.map((a) => a.h)).sort((a, b) => a - b);
  if (hs.length < 2) continue;
  const spread = hs[hs.length - 1] - hs[0];
  if (spread < 0.5) continue;
  const [vp, fam] = k.split("|");
  console.log(`  @${vp} .${fam}  heights ${hs.join("/")}  spread ${spread.toFixed(1)}px  routes ${uniq(arr.map((a) => a.route)).slice(0, 5).join(",")}`);
}

// ---------- H. clipping --------------------------------------------------------
sec("H. CLIPPED / TRUNCATED CONTENT");
const clips = new Map();
for (const r of by("clip")) {
  if (r.clamp && !r.vClip && !r.hClip) continue; // intentional line-clamp, not overflowing
  const k = `${r.tag}.${(r.cls || "").split(/\s+/).slice(0, 3).join(" ")}|${r.hClip ? "H" : ""}${r.vClip ? "V" : ""}`;
  if (!clips.has(k)) clips.set(k, { n: 0, routes: new Set(), vps: new Set(), ex: r.label, over: 0 });
  const e = clips.get(k);
  e.n++; e.routes.add(r.route); e.vps.add(r.vp);
  e.over = Math.max(e.over, r.scrollW - r.clientW, r.scrollH - r.clientH);
}
if (!clips.size) console.log("  none");
for (const [k, e] of [...clips].sort((a, b) => b[1].n - a[1].n).slice(0, 20))
  console.log(`  ${String(e.n).padStart(4)}x  ${k}  over ${e.over}px  [${[...e.vps].join(",")}]  ${[...e.routes].slice(0, 4).join(",")}  "${(e.ex || "").slice(0, 28)}"`);

// ---------- I. unequal sibling heights ------------------------------------------
sec("I. UNEQUAL SIBLING HEIGHTS IN A ROW (grid/flex cards)");
const grids = new Map();
for (const r of by("grid")) {
  if (r.spread < 1) continue;
  const k = `${(r.cls || "").split(/\s+/).slice(0, 5).join(" ")}`;
  if (!grids.has(k)) grids.set(k, { n: 0, max: 0, routes: new Set(), vps: new Set() });
  const e = grids.get(k);
  e.n++; e.max = Math.max(e.max, r.spread); e.routes.add(r.route); e.vps.add(r.vp);
}
if (!grids.size) console.log("  none");
for (const [k, e] of [...grids].sort((a, b) => b[1].max - a[1].max).slice(0, 15))
  console.log(`  ${String(e.n).padStart(4)}x  max spread ${e.max.toFixed(1)}px  .${k.slice(0, 62)}  [${[...e.vps].join(",")}]  ${[...e.routes].slice(0, 4).join(",")}`);

// ---------- J. off-scale flex/grid gaps -------------------------------------------
sec("J. OFF-SCALE CONTAINER GAPS (rowGap not on the spacing scale)");
const gaps = new Map();
for (const r of by("pair")) {
  if (!r.rowGap || near(r.rowGap, SPACE_SCALE)) continue;
  const k = `${r.rowGap}px|${(r.containerCls || "").split(/\s+/).slice(0, 4).join(" ")}`;
  if (!gaps.has(k)) gaps.set(k, { n: 0, routes: new Set(), vps: new Set() });
  const e = gaps.get(k);
  e.n++; e.routes.add(r.route); e.vps.add(r.vp);
}
if (!gaps.size) console.log("  none");
for (const [k, e] of [...gaps].sort((a, b) => b[1].n - a[1].n).slice(0, 15))
  console.log(`  ${String(e.n).padStart(4)}x  gap ${k.slice(0, 70)}  [${[...e.vps].join(",")}]  ${[...e.routes].slice(0, 4).join(",")}`);

// ---------- K. off-scale weights ---------------------------------------------------
sec("K. OFF-SCALE FONT WEIGHTS");
const offW = uniq(by("text").filter((r) => !WEIGHTS.has(r.weight)).map((r) => r.weight));
console.log(offW.length ? `  ${offW.join(", ")}` : "  none");

// ---------- L. h2 -> next element ink gap variance -----------------------------------
sec("L. HEADING -> NEXT ELEMENT INK GAP — variance for the same heading tag");
for (const vp of ["d1440", "m390"]) {
  for (const tag of ["h2", "h3"]) {
    const hits = by("pair").filter((p) => p.vp === vp && p.aTag === tag && p.inkGap !== null);
    if (hits.length < 3) continue;
    const buckets = new Map();
    for (const h of hits) {
      const k = Math.round(h.inkGap);
      if (!buckets.has(k)) buckets.set(k, { n: 0, routes: new Set() });
      buckets.get(k).n++;
      buckets.get(k).routes.add(h.route);
    }
    const sorted = [...buckets].sort((a, b) => a[0] - b[0]);
    if (sorted.length < 2) continue;
    console.log(`  ${tag} @${vp}: ${sorted.map(([g, e]) => `${g}px(${e.n})`).join("  ")}`);
  }
}
