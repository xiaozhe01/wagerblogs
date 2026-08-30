import { test } from "@playwright/test";
import { appendFileSync } from "node:fs";

const OUT = process.env.SPACING_OUT;
if (!OUT) throw new Error("set SPACING_OUT");

const ROUTES: Array<[string, string]> = [
  ["home", "/"],
  ["blog-post", "/blog/how-odds-boosts-actually-work"],
  ["review", "/reviews/peakwager"],
  ["reviews-hub", "/reviews"],
  ["category", "/categories/esports-betting"],
  ["categories-hub", "/categories"],
  ["author", "/authors/jane-placeholder"],
  ["legal-privacy", "/legal/privacy-policy"],
  ["legal-terms", "/legal/terms-of-service"],
  ["legal-affiliate", "/legal/affiliate-disclosure"],
  ["legal-cookie", "/legal/cookie-policy"],
  ["responsible-gambling", "/responsible-gambling"],
  ["help-directory", "/responsible-gambling/help-directory"],
  ["not-found", "/this-route-does-not-exist"],
];

const VIEWPORTS: Array<[string, number, number]> = [
  ["d1440", 1440, 900],
  ["w1370", 1370, 900],
  ["n1100", 1100, 900],
  ["t768", 768, 1024],
  ["m425", 425, 844],
  ["m390", 390, 844],
  ["m320", 320, 844],
];

for (const [vpName, width, height] of VIEWPORTS) {
  test.describe(vpName, () => {
    test.use({ viewport: { width, height } });

    for (const [name, path] of ROUTES) {
      test(name, async ({ page }) => {
        await page.goto(path, { waitUntil: "load" });
        await page.evaluate(async () => {
          await document.fonts.ready;
        });
        await page.waitForTimeout(250);

        const rows = await page.evaluate(() => {
          const SKIP = new Set([
            "SCRIPT",
            "STYLE",
            "NOSCRIPT",
            "TITLE",
            "HEAD",
            "META",
            "LINK",
            "BR",
            "SVG",
            "PATH",
          ]);
          const out: Record<string, unknown>[] = [];
          const r2 = (n: number) => Math.round(n * 100) / 100;

          const chain = (el: Element) => {
            const parts: string[] = [];
            let cur: Element | null = el;
            for (let i = 0; i < 4 && cur; i++) {
              const cls = typeof cur.className === "string" ? cur.className.trim() : "";
              const first = cls ? "." + cls.split(/\s+/)[0] : "";
              parts.unshift(cur.tagName.toLowerCase() + first);
              cur = cur.parentElement;
            }
            return parts.join(">");
          };

          const visible = (el: Element) => {
            if (SKIP.has(el.tagName)) return false;
            if (!el.getClientRects().length) return false;
            const cs = getComputedStyle(el);
            if (cs.visibility === "hidden" || cs.display === "none") return false;
            if (parseFloat(cs.opacity) === 0) return false;
            const r = el.getBoundingClientRect();
            return r.width >= 1 && r.height >= 1;
          };

          const ownText = (el: Element) =>
            Array.from(el.childNodes)
              .filter((n) => n.nodeType === 3)
              .map((n) => n.textContent ?? "")
              .join("")
              .trim();

          // Line boxes of an element's own text, via Range — these carry the
          // real line-height, which the element rect does not once padding is
          // involved.
          const lineRects = (el: Element) => {
            const rects: DOMRect[] = [];
            for (const node of Array.from(el.childNodes)) {
              if (node.nodeType !== 3 || !(node.textContent ?? "").trim()) continue;
              const rg = document.createRange();
              rg.selectNodeContents(node);
              for (const rect of Array.from(rg.getClientRects())) {
                if (rect.width > 0.5 && rect.height > 0.5) rects.push(rect);
              }
            }
            return rects;
          };

          const lhPx = (cs: CSSStyleDeclaration) => {
            const lh = cs.lineHeight;
            if (lh === "normal") return parseFloat(cs.fontSize) * 1.2;
            return parseFloat(lh);
          };

          // Leading-trimmed edges: the em box sits centred in the line box, so
          // stripping half-leading off each end approximates the ink extent.
          type Trim = { top: number; bottom: number; size: number; lines: number };
          const trimOf = (el: Element): Trim | null => {
            const rects = lineRects(el);
            if (!rects.length) return null;
            const cs = getComputedStyle(el);
            const size = parseFloat(cs.fontSize);
            let top = Infinity;
            let bottom = -Infinity;
            for (const r of rects) {
              top = Math.min(top, r.top);
              bottom = Math.max(bottom, r.bottom);
            }
            const first = rects.reduce((a, b) => (b.top < a.top ? b : a));
            const last = rects.reduce((a, b) => (b.bottom > a.bottom ? b : a));
            const halfFirst = Math.max(0, (first.height - size) / 2);
            const halfLast = Math.max(0, (last.height - size) / 2);
            return { top: top + halfFirst, bottom: bottom - halfLast, size, lines: rects.length };
          };

          const textLeaves = (root: Element) => {
            const leaves: Element[] = [];
            const walk = (el: Element) => {
              if (!visible(el)) return;
              if (ownText(el)) leaves.push(el);
              for (const c of Array.from(el.children)) walk(c);
            };
            walk(root);
            return leaves;
          };

          // First/last ink edge anywhere inside a subtree.
          const inkTopOf = (root: Element) => {
            let best: number | null = null;
            for (const leaf of textLeaves(root)) {
              const t = trimOf(leaf);
              if (t && (best === null || t.top < best)) best = t.top;
            }
            return best;
          };
          const inkBottomOf = (root: Element) => {
            let best: number | null = null;
            for (const leaf of textLeaves(root)) {
              const t = trimOf(leaf);
              if (t && (best === null || t.bottom > best)) best = t.bottom;
            }
            return best;
          };

          const label = (el: Element) => {
            const t = (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 44);
            return t || chain(el);
          };

          const all = Array.from(document.querySelectorAll("*")).filter(visible);

          // ---- text nodes: size / weight / leading / wrap count ------------
          for (const el of all) {
            const t = ownText(el);
            if (!t) continue;
            const cs = getComputedStyle(el);
            const trim = trimOf(el);
            if (!trim) continue;
            const rect = el.getBoundingClientRect();
            out.push({
              type: "text",
              tag: el.tagName.toLowerCase(),
              cls: typeof el.className === "string" ? el.className : "",
              chain: chain(el),
              text: t.replace(/\s+/g, " ").slice(0, 44),
              size: r2(parseFloat(cs.fontSize)),
              weight: parseInt(cs.fontWeight, 10),
              lh: r2(lhPx(cs)),
              ratio: r2(lhPx(cs) / parseFloat(cs.fontSize)),
              lines: trim.lines,
              w: r2(rect.width),
              h: r2(rect.height),
              inkH: r2(trim.bottom - trim.top),
            });
          }

          // ---- adjacent vertical sibling gaps: box vs leading-trimmed ink --
          for (const parent of all) {
            const kids = Array.from(parent.children).filter(visible);
            if (kids.length < 2 || kids.length > 24) continue;
            const pcs = getComputedStyle(parent);
            const disp = pcs.display;
            for (let i = 0; i < kids.length - 1; i++) {
              const a = kids[i];
              const b = kids[i + 1];
              const ra = a.getBoundingClientRect();
              const rb = b.getBoundingClientRect();
              if (rb.top < ra.bottom - 1) continue; // not stacked
              if (!(ra.left < rb.right && rb.left < ra.right)) continue; // not same column
              const boxGap = rb.top - ra.bottom;
              if (boxGap > 200) continue;
              const aInk = inkBottomOf(a);
              const bInk = inkTopOf(b);
              const acs = getComputedStyle(a);
              out.push({
                type: "pair",
                container: chain(parent),
                containerCls:
                  typeof parent.className === "string" ? parent.className.slice(0, 120) : "",
                display: disp,
                rowGap: pcs.rowGap === "normal" ? 0 : r2(parseFloat(pcs.rowGap)),
                aTag: a.tagName.toLowerCase(),
                aHeading: /^H[1-6]$/.test(a.tagName) || acs.fontWeight >= "600",
                a: label(a),
                b: label(b),
                aCls: typeof a.className === "string" ? a.className.slice(0, 80) : "",
                bCls: typeof b.className === "string" ? b.className.slice(0, 80) : "",
                boxGap: r2(boxGap),
                inkGap: aInk !== null && bInk !== null ? r2(bInk - aInk) : null,
                marginBottom: r2(parseFloat(acs.marginBottom)),
                marginTop: r2(parseFloat(getComputedStyle(b).marginTop)),
              });
            }
          }

          // ---- boxed containers: padding vs ink inset ----------------------
          for (const el of all) {
            const cs = getComputedStyle(el);
            const hasBorder =
              parseFloat(cs.borderTopWidth) > 0 ||
              parseFloat(cs.borderBottomWidth) > 0 ||
              parseFloat(cs.borderLeftWidth) > 0;
            const bg = cs.backgroundColor;
            const hasBg = bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
            const padded =
              parseFloat(cs.paddingTop) > 0 ||
              parseFloat(cs.paddingBottom) > 0 ||
              parseFloat(cs.paddingLeft) > 0;
            if (!((hasBorder || hasBg) && padded)) continue;
            const rect = el.getBoundingClientRect();
            if (rect.height < 8) continue;
            const it = inkTopOf(el);
            const ib = inkBottomOf(el);
            if (it === null || ib === null) continue;
            out.push({
              type: "box",
              tag: el.tagName.toLowerCase(),
              cls: typeof el.className === "string" ? el.className.slice(0, 120) : "",
              chain: chain(el),
              label: label(el),
              padT: r2(parseFloat(cs.paddingTop)),
              padB: r2(parseFloat(cs.paddingBottom)),
              padL: r2(parseFloat(cs.paddingLeft)),
              padR: r2(parseFloat(cs.paddingRight)),
              inkT: r2(it - rect.top),
              inkB: r2(rect.bottom - ib),
              w: r2(rect.width),
              h: r2(rect.height),
              radius: cs.borderTopLeftRadius,
            });
          }

          // ---- interactive controls: vertical breathing room ---------------
          for (const el of all) {
            const tag = el.tagName.toLowerCase();
            const cls = typeof el.className === "string" ? el.className : "";
            const isControl =
              tag === "button" ||
              tag === "input" ||
              el.getAttribute("data-slot") === "button" ||
              el.getAttribute("role") === "button" ||
              /\b(btn|chip|badge|pill|tag)\b/i.test(cls);
            if (!isControl) continue;
            const cs = getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            const size = parseFloat(cs.fontSize);
            out.push({
              type: "control",
              tag,
              cls: cls.slice(0, 120),
              chain: chain(el),
              label: label(el),
              h: r2(rect.height),
              w: r2(rect.width),
              size: r2(size),
              lh: r2(lhPx(cs)),
              padT: r2(parseFloat(cs.paddingTop)),
              padB: r2(parseFloat(cs.paddingBottom)),
              padL: r2(parseFloat(cs.paddingLeft)),
              minH: cs.minHeight,
              breath: r2((rect.height - size) / 2),
              radius: cs.borderTopLeftRadius,
            });
          }

          // ---- clipping / truncation --------------------------------------
          for (const el of all) {
            const cs = getComputedStyle(el);
            const clamp = (cs as unknown as Record<string, string>).webkitLineClamp;
            const oy = cs.overflowY;
            const ox = cs.overflowX;
            const vClip =
              (oy === "hidden" || oy === "clip") && el.scrollHeight > el.clientHeight + 1;
            const hClip = (ox === "hidden" || ox === "clip") && el.scrollWidth > el.clientWidth + 1;
            const clamped = clamp && clamp !== "none";
            if (!vClip && !hClip && !clamped) continue;
            if (cs.position === "absolute" && parseFloat(cs.width) <= 1) continue; // sr-only
            out.push({
              type: "clip",
              tag: el.tagName.toLowerCase(),
              cls: typeof el.className === "string" ? el.className.slice(0, 120) : "",
              chain: chain(el),
              label: label(el),
              vClip,
              hClip,
              clamp: clamped ? clamp : null,
              scrollH: el.scrollHeight,
              clientH: el.clientHeight,
              scrollW: el.scrollWidth,
              clientW: el.clientWidth,
            });
          }

          // ---- grid rows: sibling height spread ----------------------------
          for (const el of all) {
            const cs = getComputedStyle(el);
            if (!cs.display.includes("grid") && !cs.display.includes("flex")) continue;
            const kids = Array.from(el.children).filter(visible);
            if (kids.length < 2 || kids.length > 24) continue;
            const rects = kids.map((k) => k.getBoundingClientRect());
            // same-row siblings only
            const rows = new Map<number, number[]>();
            rects.forEach((r) => {
              const key = Math.round(r.top / 4) * 4;
              if (!rows.has(key)) rows.set(key, []);
              rows.get(key)!.push(r2(r.height));
            });
            for (const [top, hs] of rows) {
              if (hs.length < 2) continue;
              const min = Math.min(...hs);
              const max = Math.max(...hs);
              if (max - min < 0.5) continue;
              out.push({
                type: "grid",
                chain: chain(el),
                cls: typeof el.className === "string" ? el.className.slice(0, 120) : "",
                label: label(el),
                rowTop: top,
                heights: hs,
                spread: r2(max - min),
              });
            }
          }

          out.push({
            type: "page",
            scrollW: document.documentElement.scrollWidth,
            innerW: window.innerWidth,
            docH: document.documentElement.scrollHeight,
            bodyH: document.body.scrollHeight,
            hScroll: document.documentElement.scrollWidth > window.innerWidth + 1,
          });

          return out;
        });

        const lines = rows.map((r) => JSON.stringify({ route: name, vp: vpName, ...r })).join("\n");
        appendFileSync(OUT!, lines + "\n");
      });
    }
  });
}
