import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { traceSource } from "./trace-source";

// axe-core has no single "wcag22aa" tag on its own — WCAG levels are
// cumulative, so a real 2.2 AA sweep needs every tag up through it.
const WCAG22AA_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

// Single place to exclude a rule, with a reason — never disable a rule inline
// in a spec. Empty by default; every entry here should be a documented,
// deliberate call, not a silent workaround for a failing test.
const DISABLED_RULES: { id: string; reason: string }[] = [];

type AxeResults = Awaited<ReturnType<InstanceType<typeof AxeBuilder>["analyze"]>>;
type AxeViolation = AxeResults["violations"][number];
type AxeNode = AxeViolation["nodes"][number];

export async function scanForViolations(page: Page): Promise<AxeViolation[]> {
  const builder = new AxeBuilder({ page }).withTags(WCAG22AA_TAGS);
  if (DISABLED_RULES.length) builder.disableRules(DISABLED_RULES.map((r) => r.id));
  const results = await builder.analyze();
  return results.violations;
}

function formatNode(node: AxeNode, index: number): string {
  const trace = traceSource(node.html);
  const traceLine = trace.length
    ? trace
        .map((t) => `        possible source: ${t.file}  (${t.matched}/${t.of} classes matched — verify manually)`)
        .join("\n")
    : "        possible source: not traced automatically — grep the class names below under components/ or app/";
  const summary = (node.failureSummary ?? "").replace(/\n/g, "\n        ");
  const html = node.html.length > 220 ? `${node.html.slice(0, 220)}…` : node.html;
  return [
    `    [node ${index + 1}] target: ${node.target.join(" ")}`,
    `        ${summary}`,
    `        html: ${html}`,
    traceLine,
  ].join("\n");
}

export function formatViolations(violations: AxeViolation[], routeLabel: string): string {
  if (violations.length === 0) return "";
  const header = `\n${violations.length} axe violation(s) on ${routeLabel} (WCAG 2.2 AA):\n`;
  const body = violations
    .map((v) => {
      const wcagTags = v.tags.filter((t) => t.startsWith("wcag")).join(", ");
      const nodes = v.nodes.map((n, i) => formatNode(n, i)).join("\n");
      return `  ● [${v.impact ?? "unknown"}] ${v.id} — ${v.help}\n    ${v.description}\n    WCAG: ${wcagTags}\n    ${v.helpUrl}\n${nodes}`;
    })
    .join("\n\n");
  return `${header}\n${body}\n`;
}

/** Scans the current page state and fails the test with a formatted, per-node
 * violation report (impact, WCAG criterion, offending markup, heuristically
 * traced source file) rather than a bare pass/fail. */
export async function assertNoViolations(page: Page, routeLabel: string): Promise<void> {
  // Not "networkidle": Next.js's <Link> prefetching keeps background requests
  // going indefinitely on link-heavy pages (e.g. not-found.tsx), so networkidle
  // can time out even though the page itself is fully rendered. page.goto()'s
  // default "load" wait is already sufficient for a static/SSG page's content.
  const violations = await scanForViolations(page);
  const report = formatViolations(violations, routeLabel);
  expect(violations.length, report).toBe(0);
}
