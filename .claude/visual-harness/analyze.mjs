import { readFileSync } from "node:fs";

const SP = process.env.SP;
const load = (f) =>
  readFileSync(`${SP}/${f}`, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));

const before = load("before.jsonl");
const after = load("after.jsonl");

const key = (r) => {
  switch (r.type) {
    case "text":
      return `${r.route}|${r.vp}|text|${r.chain}|${r.text}`;
    case "pair":
      return `${r.route}|${r.vp}|pair|${r.container}|${r.a}|${r.b}`;
    case "box":
      return `${r.route}|${r.vp}|box|${r.chain}|${r.label}`;
    case "control":
      return `${r.route}|${r.vp}|control|${r.chain}|${r.label}`;
    case "clip":
      return `${r.route}|${r.vp}|clip|${r.chain}|${r.label}`;
    case "grid":
      return `${r.route}|${r.vp}|grid|${r.chain}|${r.rowTop}`;
    case "page":
      return `${r.route}|${r.vp}|page`;
  }
};

const index = (rows) => {
  const m = new Map();
  for (const r of rows) {
    const k = key(r);
    if (!m.has(k)) m.set(k, r);
  }
  return m;
};

const B = index(before);
const A = index(after);

const out = [];
const say = (s = "") => out.push(s);

// ---------------------------------------------------------------- overview
const counts = (rows) => {
  const c = {};
  for (const r of rows) c[r.type] = (c[r.type] ?? 0) + 1;
  return c;
};
say("## record counts");
say(JSON.stringify({ before: counts(before), after: counts(after) }, null, 1));

// ---------------------------------------------------------------- page size
say("\n## page height delta (docH) + h-scroll");
for (const [k, a] of A) {
  if (a.type !== "page") continue;
  const b = B.get(k);
  if (!b) continue;
  const d = a.docH - b.docH;
  const pct = ((d / b.docH) * 100).toFixed(1);
  say(
    `${a.route}\t${a.vp}\t${b.docH}\t-> ${a.docH}\t${d > 0 ? "+" : ""}${d}px\t${pct}%\thScroll ${b.hScroll}->${a.hScroll}`,
  );
}

// ---------------------------------------------------------------- wrapping
say("\n## NEW WRAPS — text that gained line boxes");
const wraps = [];
for (const [k, a] of A) {
  if (a.type !== "text") continue;
  const b = B.get(k);
  if (!b || a.lines <= b.lines) continue;
  wraps.push({ ...a, wasLines: b.lines, wasSize: b.size });
}
const wrapAgg = new Map();
for (const w of wraps) {
  const g = `${w.tag}|${w.cls.slice(0, 70)}|${w.wasLines}->${w.lines}`;
  if (!wrapAgg.has(g)) wrapAgg.set(g, { ...w, n: 0, routes: new Set(), vps: new Set() });
  const e = wrapAgg.get(g);
  e.n++;
  e.routes.add(w.route);
  e.vps.add(w.vp);
}
[...wrapAgg.values()]
  .sort((x, y) => y.n - x.n)
  .slice(0, 45)
  .forEach((e) =>
    say(
      `${e.n}x  ${e.wasLines}->${e.lines} lines  ${e.wasSize}->${e.size}px  ${e.tag}.${e.cls.slice(0, 60)}  [${[...e.vps].join(",")}]  ${[...e.routes].slice(0, 4).join(",")}  "${e.text.slice(0, 34)}"`,
    ),
  );
say(`total new-wrap nodes: ${wraps.length}`);

// ---------------------------------------------------------------- ink gaps
say("\n## INK GAP DRIFT — grouped by container class + pair role");
const pairDrift = [];
for (const [k, a] of A) {
  if (a.type !== "pair" || a.inkGap === null) continue;
  const b = B.get(k);
  if (!b || b.inkGap === null) continue;
  const d = a.inkGap - b.inkGap;
  if (Math.abs(d) < 1.5) continue;
  pairDrift.push({ ...a, wasInk: b.inkGap, wasBox: b.boxGap, d });
}
const pd = new Map();
for (const p of pairDrift) {
  const g = `${p.containerCls.slice(0, 60)}|${p.aTag}|${p.rowGap}`;
  if (!pd.has(g)) pd.set(g, []);
  pd.get(g).push(p);
}
[...pd.entries()]
  .map(([g, arr]) => ({
    g,
    arr,
    n: arr.length,
    avg: arr.reduce((s, x) => s + x.d, 0) / arr.length,
  }))
  .sort((x, y) => Math.abs(y.avg) * Math.log(y.n + 1) - Math.abs(x.avg) * Math.log(x.n + 1))
  .slice(0, 40)
  .forEach((e) => {
    const s = e.arr[0];
    say(
      `${e.n}x  ink ${s.wasInk}->${s.inkGap} (avg ${e.avg > 0 ? "+" : ""}${e.avg.toFixed(1)}px)  box ${s.wasBox}->${s.boxGap}  rowGap ${s.rowGap}  <${s.aTag}>  ${s.containerCls.slice(0, 58)}`,
    );
    say(
      `      e.g. ${s.route}/${s.vp}  "${s.a.slice(0, 30)}" -> "${s.b.slice(0, 30)}"  aCls=${s.aCls.slice(0, 50)}`,
    );
  });
say(`total drifting pairs: ${pairDrift.length}`);

// ---------------------------------------------------------------- box ink
say("\n## BOX INK INSET DRIFT — padding constant, ink moved");
const boxDrift = [];
for (const [k, a] of A) {
  if (a.type !== "box") continue;
  const b = B.get(k);
  if (!b) continue;
  const dT = a.inkT - b.inkT;
  const dB = a.inkB - b.inkB;
  if (Math.abs(dT) < 1.5 && Math.abs(dB) < 1.5) continue;
  boxDrift.push({ ...a, wasT: b.inkT, wasB: b.inkB, dT, dB, padSame: a.padT === b.padT });
}
const bd = new Map();
for (const p of boxDrift) {
  const g = p.cls.slice(0, 70);
  if (!bd.has(g)) bd.set(g, []);
  bd.get(g).push(p);
}
[...bd.entries()]
  .sort((x, y) => y[1].length - x[1].length)
  .slice(0, 30)
  .forEach(([g, arr]) => {
    const s = arr[0];
    say(
      `${arr.length}x  padT/B ${s.padT}/${s.padB}  inkT ${s.wasT}->${s.inkT}  inkB ${s.wasB}->${s.inkB}  asym ${(s.inkT - s.inkB).toFixed(1)}px  ${s.tag}.${g.slice(0, 60)}`,
    );
  });
say(`total drifting boxes: ${boxDrift.length}`);

// ---------------------------------------------------------------- boxes now asymmetric
say("\n## BOXES WITH ASYMMETRIC INK (current state, |inkT-inkB| >= 3px, symmetric padding)");
const asym = [];
for (const [, a] of A) {
  if (a.type !== "box") continue;
  if (Math.abs(a.padT - a.padB) > 0.5) continue;
  const d = a.inkT - a.inkB;
  if (Math.abs(d) < 3) continue;
  asym.push({ ...a, d });
}
const ag = new Map();
for (const p of asym) {
  const g = p.cls.slice(0, 70);
  if (!ag.has(g)) ag.set(g, []);
  ag.get(g).push(p);
}
[...ag.entries()]
  .sort((x, y) => Math.abs(y[1][0].d) - Math.abs(x[1][0].d))
  .slice(0, 30)
  .forEach(([g, arr]) => {
    const s = arr[0];
    const bb = B.get(key(s));
    say(
      `${arr.length}x  pad ${s.padT}/${s.padB}  ink ${s.inkT}/${s.inkB}  delta ${s.d.toFixed(1)}px${bb ? ` (was ${(bb.inkT - bb.inkB).toFixed(1)})` : ""}  ${s.tag}.${g.slice(0, 58)}  [${s.route}/${s.vp}]`,
    );
  });

// ---------------------------------------------------------------- controls
say("\n## CONTROL DRIFT — height / breathing room");
const ctlDrift = [];
for (const [k, a] of A) {
  if (a.type !== "control") continue;
  const b = B.get(k);
  if (!b) continue;
  if (Math.abs(a.h - b.h) < 1 && Math.abs(a.breath - b.breath) < 1) continue;
  ctlDrift.push({ ...a, wasH: b.h, wasBreath: b.breath, wasSize: b.size });
}
const cd = new Map();
for (const p of ctlDrift) {
  const g = `${p.cls.slice(0, 70)}|${p.wasH}->${p.h}`;
  if (!cd.has(g)) cd.set(g, []);
  cd.get(g).push(p);
}
[...cd.entries()]
  .sort((x, y) => y[1].length - x[1].length)
  .slice(0, 30)
  .forEach(([g, arr]) => {
    const s = arr[0];
    say(
      `${arr.length}x  h ${s.wasH}->${s.h}  size ${s.wasSize}->${s.size}  breath ${s.wasBreath}->${s.breath}  minH ${s.minH}  pad ${s.padT}/${s.padB}  ${s.tag}.${s.cls.slice(0, 55)}`,
    );
  });
say(`total drifting controls: ${ctlDrift.length}`);

// ---------------------------------------------------------------- tight controls
say("\n## CONTROLS NOW TIGHT (breath < 6px, i.e. <6px above+below the em box)");
const tight = new Map();
for (const [, a] of A) {
  if (a.type !== "control" || a.breath >= 6) continue;
  const g = `${a.cls.slice(0, 70)}`;
  if (!tight.has(g)) tight.set(g, []);
  tight.get(g).push(a);
}
[...tight.entries()]
  .sort((x, y) => x[1][0].breath - y[1][0].breath)
  .slice(0, 25)
  .forEach(([g, arr]) => {
    const s = arr[0];
    const bb = B.get(key(s));
    say(
      `${arr.length}x  breath ${s.breath}${bb ? ` (was ${bb.breath})` : ""}  h ${s.h}  size ${s.size}  minH ${s.minH}  ${s.tag}.${g.slice(0, 60)}  [${s.route}/${s.vp}]`,
    );
  });

// ---------------------------------------------------------------- clipping
say("\n## CLIPPING — new or worsened");
for (const [k, a] of A) {
  if (a.type !== "clip") continue;
  const b = B.get(k);
  const overT = a.scrollH - a.clientH;
  const wasOverT = b ? b.scrollH - b.clientH : 0;
  const overW = a.scrollW - a.clientW;
  const wasOverW = b ? b.scrollW - b.clientW : 0;
  if (b && overT <= wasOverT && overW <= wasOverW) continue;
  say(
    `${a.route}/${a.vp}  ${a.tag}.${a.cls.slice(0, 55)}  vOver ${wasOverT}->${overT}  hOver ${wasOverW}->${overW}  clamp ${a.clamp}  "${a.label.slice(0, 34)}"`,
  );
}

// ---------------------------------------------------------------- grid spread
say("\n## GRID ROW HEIGHT SPREAD — worsened");
const gs = [];
for (const [k, a] of A) {
  if (a.type !== "grid") continue;
  const b = B.get(k);
  if (!b) continue;
  const d = a.spread - b.spread;
  if (d < 2) continue;
  gs.push({ ...a, wasSpread: b.spread, d });
}
const gg = new Map();
for (const p of gs) {
  const g = p.cls.slice(0, 70);
  if (!gg.has(g)) gg.set(g, []);
  gg.get(g).push(p);
}
[...gg.entries()]
  .sort((x, y) => y[1][0].d - x[1][0].d)
  .slice(0, 25)
  .forEach(([g, arr]) => {
    const s = arr[0];
    say(
      `${arr.length}x  spread ${s.wasSpread}->${s.spread} (+${s.d.toFixed(1)})  heights ${JSON.stringify(s.heights)}  .${g.slice(0, 60)}  [${s.route}/${s.vp}]`,
    );
  });

console.log(out.join("\n"));
