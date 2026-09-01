import type { Page, Locator } from "@playwright/test";

// Canvas readback, because getComputedStyle returns lab()/oklab() verbatim here
// and an alpha tint must be composited over its ground.
const RESOLVE = `(css, over) => {
  const c = document.createElement("canvas"); c.width = c.height = 1;
  const x = c.getContext("2d", { willReadFrequently: true });
  if (over) { x.fillStyle = over; x.fillRect(0, 0, 1, 1); }
  x.fillStyle = css; x.fillRect(0, 0, 1, 1);
  const d = x.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2], d[3] / 255];
}`;

const GROUND = `(el) => {
  let n = el;
  while (n && n !== document.documentElement) {
    const bg = getComputedStyle(n).backgroundColor;
    const m = bg.match(/rgba?\\(([^)]+)\\)/);
    if (m) { const p = m[1].split(/[\\s,/]+/).filter(Boolean).map(Number);
      if (p.length < 4 || p[3] > 0) return bg; }
    n = n.parentElement;
  }
  return getComputedStyle(document.body).backgroundColor;
}`;

const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = (rgb: number[]) =>
  rgb
    .slice(0, 3)
    .map((v) => lin(v / 255))
    .reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0);

export function ratio(a: number[], b: number[]) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

export type Measured = { fg: number[]; bg: number[]; label: string };

/** "outline" reads the ring from the closest <label> — an sr-only input's ring
 *  is drawn on its label, not on itself. */
export async function measure(el: Locator, kind: "text" | "outline" | "border"): Promise<Measured> {
  return el.evaluate(
    (node, [g, r, k]) => {
      const ground = new Function("return " + g)();
      const resolve = new Function("return " + r)();
      const ringOn = k === "outline" ? (node.closest("label") ?? node) : node;
      const cs = getComputedStyle(node);
      const rs = getComputedStyle(ringOn);
      const gnd = ground(ringOn.parentElement ?? ringOn);
      // outline-offset puts the ring outside the element, so it sits on the
      // ground — never on the element's own fill.
      const own = resolve(cs.backgroundColor);
      const bg =
        k === "outline"
          ? resolve(gnd)
          : own[3] > 0
            ? resolve(cs.backgroundColor, gnd)
            : resolve(gnd);
      const fg =
        k === "outline"
          ? resolve(rs.outlineColor, gnd)
          : k === "border"
            ? resolve(cs.borderTopColor, gnd)
            : resolve(cs.color);
      return { fg, bg, label: `${k} ${k === "outline" ? rs.outlineColor : cs.color}` };
    },
    [GROUND, RESOLVE, kind] as const,
  );
}

export async function settle(page: Page) {
  await page.waitForTimeout(220);
}
