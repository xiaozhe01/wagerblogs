import { test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const URL = "http://localhost:4400/responsible-gambling";
const ROOT = "#self-check";

// Contrast is computed here rather than trusted to axe alone: axe skips
// elements it considers to have an indeterminate background, and it does not
// evaluate states (checked / disabled / hover) that only exist after input.
const CONTRAST_FN = `(() => {
  const lum = (c) => {
    const p = c.match(/[\\d.]+/g).map(Number);
    const [r, g, b] = p.slice(0, 3).map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const alpha = (c) => { const p = c.match(/[\\d.]+/g).map(Number); return p.length > 3 ? p[3] : 1; };
  const over = (fg, bg) => {
    const a = alpha(fg);
    if (a >= 1) return fg;
    const f = fg.match(/[\\d.]+/g).map(Number), b = bg.match(/[\\d.]+/g).map(Number);
    return 'rgb(' + [0,1,2].map((i) => Math.round(f[i] * a + b[i] * (1 - a))).join(',') + ')';
  };
  const bgOf = (el) => {
    let n = el;
    while (n) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && alpha(c) > 0) return c;
      n = n.parentElement;
    }
    return 'rgb(255,255,255)';
  };
  const ratio = (fg, bg) => {
    const a = lum(fg), b = lum(bg);
    return Math.round(((Math.max(a,b) + 0.05) / (Math.min(a,b) + 0.05)) * 100) / 100;
  };
  return { lum, alpha, over, bgOf, ratio };
})()`;

async function report(page: import("@playwright/test").Page, label: string) {
  const rows = await page.evaluate(
    ([root, fnSrc]) => {
      const H = eval(fnSrc) as {
        alpha: (c: string) => number;
        over: (fg: string, bg: string) => string;
        bgOf: (el: Element) => string;
        ratio: (fg: string, bg: string) => number;
      };
      const scope = document.querySelector(root as string);
      if (!scope) return [];
      const out: Record<string, unknown>[] = [];
      const seen = new Set<Element>();
      for (const el of Array.from(scope.querySelectorAll<HTMLElement>("*"))) {
        const own = Array.from(el.childNodes).some(
          (n) => n.nodeType === 3 && (n.textContent ?? "").trim().length > 0
        );
        if (!own || seen.has(el)) continue;
        seen.add(el);
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        const bg = H.bgOf(el);
        // fold the element's own opacity into the effective colour
        const opacity = parseFloat(cs.opacity);
        let fg = H.over(cs.color, bg);
        if (opacity < 1) {
          const f = fg.match(/[\d.]+/g)!.map(Number);
          const b = bg.match(/[\d.]+/g)!.map(Number);
          fg = "rgb(" + [0, 1, 2].map((i) => Math.round(f[i] * opacity + b[i] * (1 - opacity))).join(",") + ")";
        }
        const size = parseFloat(cs.fontSize);
        const weight = parseInt(cs.fontWeight, 10);
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        out.push({
          text: (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 30),
          size: `${size}px`,
          weight,
          opacity,
          fg,
          bg,
          ratio: H.ratio(fg, bg),
          need: large ? 3 : 4.5,
        });
      }
      return out;
    },
    [ROOT, CONTRAST_FN] as [string, string]
  );

  console.log(`\n  --- ${label} ---`);
  console.log(`  ${"text".padEnd(31)} ${"size".padEnd(6)} wt  op    ratio  need  verdict`);
  for (const r of rows as Record<string, string | number>[]) {
    const pass = (r.ratio as number) >= (r.need as number);
    console.log(
      `  ${String(r.text).padEnd(31)} ${String(r.size).padEnd(6)} ${String(r.weight).padEnd(3)} ${String(r.opacity).padEnd(5)} ` +
        `${String(r.ratio).padStart(6)} ${String(r.need).padStart(5)}  ${pass ? "pass" : "**FAIL**"}`
    );
  }
}

test("SelfAssessment — axe + contrast", async ({ page }) => {
  await page.goto(URL, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  const axe = await new AxeBuilder({ page })
    .include(ROOT)
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  console.log(`\n=== AXE (scoped to ${ROOT}) ===`);
  if (!axe.violations.length) console.log("  0 violations");
  for (const v of axe.violations) {
    console.log(`  [${v.impact}] ${v.id} — ${v.help}  (${v.nodes.length} node${v.nodes.length > 1 ? "s" : ""})`);
    v.nodes.slice(0, 3).forEach((n) => console.log(`      ${n.target.join(" ")}`));
  }
  console.log(`  incomplete (needs manual review): ${axe.incomplete.length}`);
  for (const i of axe.incomplete.slice(0, 6))
    console.log(`      ${i.id} — ${i.help} (${i.nodes.length})`);

  console.log("\n=== CONTRAST ===");
  await report(page, "default state");

  // checked state
  await page.locator(`${ROOT} label`).first().click();
  await page.waitForTimeout(200);
  await report(page, "after selecting an answer (checked)");

  // disabled Previous button on question 1
  const prev = page.locator(`${ROOT} button`, { hasText: "Previous" });
  console.log(`\n  Previous disabled? ${await prev.isDisabled()}`);
});
