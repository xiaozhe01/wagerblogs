// Derives a dark palette from the SHIPPED light one: for each foreground,
// measure the ratio it achieves against its own ground, then solve for a dark
// value hitting the same ratio at the same hue. Prints the full matrix.
const hex2rgb = (h) => { h = h.replace("#",""); if (h.length===3) h=[...h].map(c=>c+c).join(""); return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255); };
const lin = (v) => v<=0.04045 ? v/12.92 : ((v+0.055)/1.055)**2.4;
const unlin = (v) => v<=0.0031308 ? v*12.92 : 1.055*Math.pow(v,1/2.4)-0.055;
const Y = (h) => { const [r,g,b]=hex2rgb(h).map(lin); return 0.2126*r+0.7152*g+0.0722*b; };
const cr = (a,b) => { const [x,y]=[Y(a),Y(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };
const f = (n) => n.toFixed(2).padStart(5);
const tag = (r) => r>=7?"AAA":r>=4.5?"AA ":r>=3?"LG ":"!! ";
const clamp = (v) => Math.min(1, Math.max(0, v));
const toHex = (rgb) => "#"+rgb.map(v=>Math.round(clamp(v)*255).toString(16).padStart(2,"0")).join("");

function oklch2rgb(L,C,H){
  const a=C*Math.cos(H*Math.PI/180), b=C*Math.sin(H*Math.PI/180);
  const l=(L+0.3963377774*a+0.2158037573*b)**3;
  const m=(L-0.1055613458*a-0.0638541728*b)**3;
  const s=(L-0.0894841775*a-1.2914855480*b)**3;
  return [ 4.0767416621*l-3.3077115913*m+0.2309699292*s,
          -1.2684380046*l+2.6097574011*m-0.3413193965*s,
          -0.0041960863*l-0.7034186147*m+1.7076147010*s ].map(unlin);
}
function rgb2oklch(h){
  const [r,g,b]=hex2rgb(h).map(lin);
  const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b);
  const m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b);
  const s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
  const L=0.2104542553*l+0.7936177850*m-0.0040720468*s;
  const A=1.9779984951*l-2.4285922050*m+0.4505937099*s;
  const B=0.0259040371*l+0.7827717662*m-0.8086757660*s;
  let H=Math.atan2(B,A)*180/Math.PI; if(H<0)H+=360;
  return {L,C:Math.hypot(A,B),H};
}
/** Hex at (C,H) achieving `ratio` against `ground`, on the requested side of
 *  it. cr() is direction-blind, so the search MUST be bounded to one side or
 *  it converges on the mirror solution (a "lift" resolving to black).
 *  Returns {hex, reachable} — an unreachable ratio clamps and says so. */
function solveForRatio(ground, ratio, C, H, lighter=true){
  const gL = rgb2oklch(ground).L;
  let lo = lighter ? gL : 0;
  let hi = lighter ? 1 : gL;
  const at = (Lv) => toHex(oklch2rgb(Lv, C, H));
  const limit = cr(at(lighter ? hi : lo), ground);
  const reachable = limit >= ratio - 0.01;
  for (let i=0;i<80;i++){
    const Lv=(lo+hi)/2;
    const got=cr(at(Lv), ground);
    if (lighter ? got<ratio : got>ratio) lo=Lv; else hi=Lv;
  }
  return { hex: at((lo+hi)/2), reachable, limit };
}

// ---- shipped light palette -------------------------------------------------
const L = {
  page:"#fbf8f1", card:"#fbf8f1", subtle:"#f3ede0", subtleActive:"#e9e1cf",
  primary:"#12110e", strong:"#343330", body:"#565551", muted:"#656460",
  brand:"#1d3b73", safety:"#1d3b73", accent:"#13110b", accentHover:"#2d2a23",
  inverted:"#1c1a14", onInverted:"#f1eee5", onInvertedMuted:"#bebbb3",
  onFill:"#fffdf7", brandOnInverted:"#7fa3e0",
  divider:"#e3ddcd", hairline:"#efe9da", hairlineAlt:"#f1ebdd",
  borderDefault:"#dcd6c8", input:"#c9c2b0", inputHover:"#98917f",
  placeholder:"#bab3a1", control:"#36332c",
};
const HUE = 87.5;                 // the paper's hue, kept for brand continuity
const TEXT = ["primary","strong","body","muted"];

console.log("=== 1. what the SHIPPED light palette actually achieves ===");
const target = {};
for (const t of TEXT) {
  target[t] = cr(L[t], L.page);
  console.log(`  ${t.padEnd(8)} on page ${f(target[t])} ${tag(target[t])}   subtle ${f(cr(L[t],L.subtle))}   active ${f(cr(L[t],L.subtleActive))}`);
}
const tBrand = cr(L.brand, L.page);
console.log(`  ${"brand".padEnd(8)} on page ${f(tBrand)} ${tag(tBrand)}`);
console.log(`  surface steps: page->subtle ${f(cr(L.page,L.subtle))}  subtle->active ${f(cr(L.subtle,L.subtleActive))}  page->inverted ${f(cr(L.page,L.inverted))}`);
console.log(`  paper hue ${rgb2oklch(L.page).H.toFixed(1)}deg  chroma ${rgb2oklch(L.page).C.toFixed(4)}`);

// ---- dark grounds ----------------------------------------------------------
// subtle/active LIFT rather than recess: on a dark ground, recessing heads to
// black and stops reading as a surface at all.
const stepSubtle = cr(L.page, L.subtle);
const stepActive = cr(L.subtle, L.subtleActive);

console.log("\n=== 2. candidate page grounds — does the 4-tier ramp fit? ===");
for (const page of ["#100f0c","#141210","#17150f","#1c1a14"]) {
  const head = cr("#ffffff", page);
  console.log(`  ${page}  white-headroom ${f(head)}  ramp needs ${f(target.primary)}  ${head>=target.primary?"fits":"NO"}`);
}

const D = {};
D.page = "#17150f";
D.card = D.page;
D.subtle = solveForRatio(D.page, stepSubtle, 0.012, HUE, true).hex;
D.subtleActive = solveForRatio(D.subtle, stepActive, 0.014, HUE, true).hex;

console.log("\n=== 3. surfaces ===");
console.log(`  page/card     ${D.page}`);
console.log(`  subtle        ${D.subtle}  page->subtle ${f(cr(D.page,D.subtle))} (light ${f(stepSubtle)})`);
console.log(`  subtleActive  ${D.subtleActive}  subtle->active ${f(cr(D.subtle,D.subtleActive))} (light ${f(stepActive)})`);

// ---- text: mirror the light ratios ----------------------------------------
const CH = { primary:0.006, strong:0.008, body:0.010, muted:0.012 };
for (const t of TEXT) D[t] = solveForRatio(D.page, target[t], CH[t], HUE, true).hex;

console.log("\n=== 4. text ramp, solved to reproduce the light ratios ===");
console.log("  token     hex       page             subtle           active           light ref");
for (const t of TEXT)
  console.log(`  ${t.padEnd(9)}${D[t]}   ${f(cr(D[t],D.page))} ${tag(cr(D[t],D.page))}      ${f(cr(D[t],D.subtle))} ${tag(cr(D[t],D.subtle))}      ${f(cr(D[t],D.subtleActive))} ${tag(cr(D[t],D.subtleActive))}      ${f(target[t])}`);

console.log("\n=== 5. ramp-asymmetry check ===");
const mutedOnSubtle = cr(D.muted, D.subtle);
console.log(`  light muted on subtle ${f(cr(L.muted,L.subtle))} | dark ${f(mutedOnSubtle)} — headroom to AA ${(mutedOnSubtle-4.5).toFixed(2)}`);
console.log(`  -> ${mutedOnSubtle-4.5 > 1.0 ? "a 5th tier would fit on dark, but is NOT added: shared token names" : "no room for a 5th tier"}`);

// ---- fills: designed to constraints, NOT ratio-mirrored --------------------
// Mirroring a fill's page-ratio is wrong: it optimises the wrong thing and
// drives bg-accent to near-white, where it can no longer carry a label.
console.log("\n=== 6. fills (constraint-designed) ===");
D.inverted = solveForRatio(D.page, cr(L.page, L.inverted), 0.010, HUE, true).hex;  // RG card, mirrors the 16.4 step
D.accent = solveForRatio(D.page, 9.0, 0.014, HUE, true).hex;                       // operator CTA, loudest control
const navy = rgb2oklch(L.brand);
D.safety = solveForRatio(D.page, 3.6, navy.C * 0.8, navy.H, true).hex;             // panel; 3.6 is the floor that keeps the btn-on-fill focus ring >= 3.0 on it
D.brand = solveForRatio(D.page, tBrand, navy.C, navy.H, true).hex;                 // AAA links
D.brandHover = solveForRatio(D.page, tBrand * 0.88, navy.C, navy.H, true).hex;
D.brandActive = solveForRatio(D.page, tBrand * 0.78, navy.C, navy.H, true).hex;
D.accentHover = solveForRatio(D.page, 7.6, 0.014, HUE, true).hex;
D.accentActive = solveForRatio(D.page, 11.0, 0.014, HUE, true).hex;

D.onFill = "#17150f";                       // labels on the light operator fill
D.onInverted = solveForRatio(D.inverted, cr(L.inverted, L.onInverted), 0.006, HUE, false).hex;
D.onInvertedMuted = solveForRatio(D.inverted, cr(L.inverted, L.onInvertedMuted), 0.010, HUE, false).hex;
D.borderOnInverted = solveForRatio(D.inverted, cr(L.inverted, "#36332c"), 0.012, HUE, false).hex;
D.brandOnInverted = solveForRatio(D.inverted, cr(L.inverted, L.brandOnInverted), navy.C, navy.H, false).hex;
const onSafety = D.primary;

console.log(`  bg-inverted   ${D.inverted}  ${f(cr(D.inverted,D.page))} vs page (mirrors light ${f(cr(L.page,L.inverted))})`);
console.log(`    on-inverted ${D.onInverted}  ${f(cr(D.onInverted,D.inverted))} ${tag(cr(D.onInverted,D.inverted))}   muted ${D.onInvertedMuted} ${f(cr(D.onInvertedMuted,D.inverted))} ${tag(cr(D.onInvertedMuted,D.inverted))}`);
console.log(`    brand-on-inv ${D.brandOnInverted} ${f(cr(D.brandOnInverted,D.inverted))} ${tag(cr(D.brandOnInverted,D.inverted))}  border ${D.borderOnInverted}`);
console.log(`  bg-accent     ${D.accent}  ${f(cr(D.accent,D.page))} vs page   label ${D.onFill} ${f(cr(D.onFill,D.accent))} ${tag(cr(D.onFill,D.accent))}`);
console.log(`    hover ${D.accentHover}  active ${D.accentActive}`);
console.log(`  bg-safety     ${D.safety}  ${f(cr(D.safety,D.page))} vs page   text ${onSafety} ${f(cr(onSafety,D.safety))} ${tag(cr(onSafety,D.safety))}`);
console.log(`  brand         ${D.brand}  ${f(cr(D.brand,D.page))} ${tag(cr(D.brand,D.page))}   hover ${D.brandHover}  active ${D.brandActive}`);

// ---- borders: mirror the light ratios --------------------------------------
console.log("\n=== 7. borders ===");
for (const [k, lightHex] of [["divider",L.divider],["hairline",L.hairline],["hairlineAlt",L.hairlineAlt],
  ["borderDefault",L.borderDefault],["input",L.input],["inputHover",L.inputHover],
  ["placeholder",L.placeholder],["control",L.control]]) {
  const r = cr(lightHex, L.page);
  D[k] = solveForRatio(D.page, r, 0.012, HUE, true).hex;
  console.log(`  ${k.padEnd(14)}${D[k]}  ${f(cr(D[k],D.page))} vs page (light ${f(r)})`);
}

// ---- distinctness: the gap the Phase 0.5 guard does NOT catch --------------
// Must be perceptual distance, not contrast: contrast is luminance-only, so a
// warm grey and a light blue at the same L read as "identical" to it. This is
// the same blindness that let the chroma-0 palette pass every a11y check.
const dE = (x, y) => {
  const A = rgb2oklch(x), B = rgb2oklch(y);
  const ax = A.C*Math.cos(A.H*Math.PI/180), ay = A.C*Math.sin(A.H*Math.PI/180);
  const bx = B.C*Math.cos(B.H*Math.PI/180), by = B.C*Math.sin(B.H*Math.PI/180);
  return Math.hypot(A.L-B.L, ax-bx, ay-by);
};
const MIN_DE = 0.05;
console.log(`\n=== 8. pairwise distinctness, OKLab dE (min ${MIN_DE}) ===`);
const FILLS = [["bg-accent",D.accent],["bg-safety",D.safety],["bg-inverted",D.inverted],
               ["brand",D.brand],["brand-on-inverted",D.brandOnInverted],["border-control",D.control]];
let worst = { d: Infinity };
for (let i=0;i<FILLS.length;i++) for (let j=i+1;j<FILLS.length;j++) {
  const d = dE(FILLS[i][1], FILLS[j][1]);
  if (d < worst.d) worst = { d, a: FILLS[i], b: FILLS[j] };
  if (d < MIN_DE) console.log(`  TOO CLOSE  ${FILLS[i][0]} ${FILLS[i][1]} vs ${FILLS[j][0]} ${FILLS[j][1]}  dE ${d.toFixed(4)}  (contrast ${f(cr(FILLS[i][1],FILLS[j][1]))})`);
}
console.log(`  closest: ${worst.a[0]} vs ${worst.b[0]}  dE ${worst.d.toFixed(4)}  contrast ${f(cr(worst.a[1],worst.b[1]))}  ${worst.d>=MIN_DE?"OK":"FAILS"}`);
console.log(`  (for reference, the near-identical pair contrast missed: #a2c4ff vs #9fc5ff dE ${dE("#a2c4ff","#9fc5ff").toFixed(4)} — correctly flagged)`);

console.log("\n=== 9. the .dark block ===");
console.log([
  ["--color-text-primary",D.primary],["--color-text-strong-secondary",D.strong],
  ["--color-text-body",D.body],["--color-text-muted",D.muted],
  ["--color-text-on-inverted",D.onInverted],["--color-text-on-inverted-muted",D.onInvertedMuted],
  ["--color-text-on-fill",D.onFill],
  ["--color-border-input",D.input],["--color-border-input-hover",D.inputHover],
  ["--color-border-default",D.borderDefault],["--color-border-divider",D.divider],
  ["--color-border-hairline",D.hairline],["--color-border-hairline-alt",D.hairlineAlt],
  ["--color-border-placeholder",D.placeholder],["--color-border-control",D.control],
  ["--color-bg-page",D.page],["--color-bg-card",D.card],["--color-bg-subtle",D.subtle],
  ["--color-bg-subtle-active",D.subtleActive],
  ["--color-bg-accent",D.accent],["--color-bg-accent-hover",D.accentHover],["--color-bg-accent-active",D.accentActive],
  ["--color-bg-inverted",D.inverted],["--color-border-on-inverted",D.borderOnInverted],
  ["--color-bg-safety",D.safety],
  ["--color-brand",D.brand],["--color-brand-hover",D.brandHover],
  ["--color-brand-active",D.brandActive],["--color-brand-on-inverted",D.brandOnInverted],
].map(([k,v])=>`    ${k}: ${v};`).join("\n"));
