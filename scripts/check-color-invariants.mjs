// Guards colour rules that no contrast test can express. Parses globals.css
// statically. "light" is @theme + :root, "dark" is that plus every `.dark {}`
// block — so the dark theme starts being checked the moment one is added.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// argv[2] overrides the target so the guard can be tested against a fixture.
const CSS =
  process.argv[2] ?? resolve(dirname(fileURLToPath(import.meta.url)), "..", "app", "globals.css");

/** Rules. `a` and `b` must never resolve to the same colour in the named theme. */
const MUST_DIFFER = [
  {
    a: "--color-bg-accent",
    b: "--color-brand",
    why: "The outbound operator CTA must not wear the site's identity colour, or the brand reads affiliate-first.",
    source: "docs/02 §6 · CLAUDE.md rule 5",
  },
  {
    a: "--color-bg-safety",
    b: "--color-bg-accent",
    why: "A safety message must not wear the operator CTA fill — black means 'this link leaves the site for an operator'.",
    source: "established 2026-08-31, see .claude/theme-toggle-deferred.md",
  },
  {
    a: "--color-brand-on-inverted",
    b: "--color-brand",
    why: "These target opposite surfaces and are never swappable; equal values mean one of them is on the wrong ground.",
    source: "globals.css, --color-brand-on-inverted",
  },
];

// ---------------------------------------------------------------- parsing

const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "");

/** Top-level `selector { body }` pairs, brace-matched so nested rules survive. */
function blocks(css) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open === -1) break;
    let depth = 1;
    let j = open + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
      j++;
    }
    // Only the statement before the brace is the selector; earlier text is a
    // finished at-rule (@import, @custom-variant).
    const prelude = css.slice(i, open);
    const selector = prelude.slice(
      Math.max(prelude.lastIndexOf(";"), prelude.lastIndexOf("}")) + 1,
    );
    out.push({ selector: selector.trim(), body: css.slice(open + 1, j - 1) });
    i = j;
  }
  return out;
}

/** `--name: value;` declarations at the top level of a block body. */
function decls(body) {
  const out = new Map();
  let depth = 0;
  let buf = "";
  for (const ch of body) {
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if (ch === ";" && depth === 0) {
      const m = buf.match(/^\s*(--[\w-]+)\s*:\s*([\s\S]+)$/);
      if (m) out.set(m[1], m[2].trim());
      buf = "";
      continue;
    }
    if (depth === 0) buf += ch;
  }
  return out;
}

function themes(css) {
  const light = new Map();
  const darkOverrides = new Map();
  for (const { selector, body } of blocks(stripComments(css))) {
    const sel = selector.replace(/\s+/g, " ").trim();
    const isLight = sel === ":root" || sel === ":root, :host" || /^@theme\b/.test(sel);
    const isDark = /(^|[\s,])\.dark\b/.test(sel);
    if (!isLight && !isDark) continue;
    for (const [k, v] of decls(body)) (isDark ? darkOverrides : light).set(k, v);
  }
  return { light, dark: new Map([...light, ...darkOverrides]), darkCount: darkOverrides.size };
}

// ------------------------------------------------------------ resolution

function deref(name, map, seen = new Set()) {
  if (seen.has(name)) return null;
  seen.add(name);
  const raw = map.get(name);
  if (raw == null) return null;
  const m = raw.match(/^var\(\s*(--[\w-]+)\s*(?:,([\s\S]*))?\)$/);
  if (!m) return raw;
  const via = deref(m[1], map, seen);
  return via ?? (m[2] ? m[2].trim() : null);
}

const clamp = (v) => Math.min(255, Math.max(0, Math.round(v)));
const unlin = (v) => (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);

/** Normalise a colour to an "r,g,b" string, or null if not comparable. */
function toRgb(value) {
  if (!value) return null;
  const v = value.trim().toLowerCase();

  let m = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (m) {
    const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(",");
  }

  m = v.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const p = m[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .slice(0, 3)
      .map(Number);
    if (p.length === 3 && p.every(Number.isFinite)) return p.map(clamp).join(",");
  }

  m = v.match(/^oklch\(([^)]+)\)$/);
  if (m) {
    const p = m[1].split(/[\s/]+/).filter(Boolean);
    const L = parseFloat(p[0]) / (p[0].includes("%") ? 100 : 1);
    const C = parseFloat(p[1]);
    const H = (parseFloat(p[2] ?? "0") * Math.PI) / 180;
    if (![L, C].every(Number.isFinite)) return null;
    const a = C * Math.cos(H);
    const b = C * Math.sin(H);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [
      4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s,
    ]
      .map((x) => clamp(unlin(x) * 255))
      .join(",");
  }

  return null;
}

// ----------------------------------------------------------------- check

const { light, dark, darkCount } = themes(readFileSync(CSS, "utf8"));
const failures = [];
const skipped = [];

for (const [themeName, map] of [
  ["light", light],
  ["dark", dark],
]) {
  // No project .dark block yet: dark == light, so checking twice is noise.
  if (themeName === "dark" && darkCount === 0) continue;

  for (const rule of MUST_DIFFER) {
    const rawA = deref(rule.a, map);
    const rawB = deref(rule.b, map);
    if (rawA == null || rawB == null) {
      skipped.push(`${themeName}: ${rule.a} or ${rule.b} is not declared`);
      continue;
    }
    const A = toRgb(rawA);
    const B = toRgb(rawB);
    if (A == null || B == null) {
      skipped.push(`${themeName}: ${rule.a}/${rule.b} not comparable (${rawA} vs ${rawB})`);
      continue;
    }
    if (A === B) {
      failures.push(
        `  ${themeName}: ${rule.a} === ${rule.b}  (both resolve to rgb(${A}) — ${rawA} / ${rawB})\n` +
          `      ${rule.why}\n      source: ${rule.source}`,
      );
    }
  }
}

const themeLabel = darkCount === 0 ? "light only (no project .dark block yet)" : "light + dark";
if (failures.length) {
  console.error(`\ncheck-color-invariants FAILED — ${themeLabel}\n`);
  console.error(failures.join("\n\n"));
  console.error("");
  process.exit(1);
}

console.log(
  `check-color-invariants OK — ${MUST_DIFFER.length} rules, ${themeLabel}` +
    (skipped.length ? `\n  skipped:\n    ${skipped.join("\n    ")}` : ""),
);
