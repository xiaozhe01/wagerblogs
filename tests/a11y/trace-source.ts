import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

// Best-effort "which component did this come from" tracer for axe violation
// nodes. There is no real source map from rendered DOM back to JSX in a React
// app, so this is a grep-equivalent heuristic: it indexes every quoted string
// in components/ and app/ that looks like a Tailwind class list (className
// literals, cva() variant strings, template literals), then ranks source
// files by how many of a violation node's actual classes appear together in
// one of those strings. Treat results as a lead to verify, not a citation —
// low-overlap or tied matches are reported as such, not hidden.

const ROOT = path.resolve(__dirname, "..", "..");
const SOURCE_DIRS = ["components", "app"];
const STRING_LITERAL = /"([^"\n]{3,400})"|`([^`\n]{3,400})`/g;

type SourceIndexEntry = { file: string; classSets: string[][] };

let cachedIndex: SourceIndexEntry[] | null = null;

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) out.push(full);
  }
  return out;
}

/** A string like `class="foo bar"` counts as a class-list candidate when most
 * of its whitespace-separated tokens look like CSS/Tailwind class tokens. */
function asClassList(raw: string): string[] | null {
  const tokens = raw.trim().split(/\s+/).filter(Boolean);
  if (tokens.length < 2) return null;
  const classLike = tokens.filter((t) => /^[a-zA-Z0-9][a-zA-Z0-9:/_.\-[\]%]*$/.test(t));
  if (classLike.length < tokens.length * 0.7) return null;
  return tokens;
}

function buildIndex(): SourceIndexEntry[] {
  if (cachedIndex) return cachedIndex;
  const files = SOURCE_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
  cachedIndex = files.map((file) => {
    const src = readFileSync(file, "utf8");
    const classSets: string[][] = [];
    let match: RegExpExecArray | null;
    STRING_LITERAL.lastIndex = 0;
    while ((match = STRING_LITERAL.exec(src))) {
      const raw = match[1] ?? match[2] ?? "";
      const classList = asClassList(raw);
      if (classList) classSets.push(classList);
    }
    return { file: path.relative(ROOT, file), classSets };
  });
  return cachedIndex;
}

/** Pulls the class list off the first tag in an axe violation node's outerHTML snippet. */
function classesFromSnippet(html: string): string[] {
  const tagMatch = html.match(/^<[a-zA-Z0-9-]+\s+([^>]*)>/);
  if (!tagMatch) return [];
  const classMatch = tagMatch[1].match(/class="([^"]*)"/);
  if (!classMatch) return [];
  return classMatch[1].split(/\s+/).filter(Boolean);
}

export type TraceResult = { file: string; matched: number; of: number };

export function traceSource(nodeHtml: string, minOverlap = 3): TraceResult[] {
  const targetClasses = classesFromSnippet(nodeHtml);
  if (targetClasses.length === 0) return [];
  const targetSet = new Set(targetClasses);
  const index = buildIndex();
  const results: TraceResult[] = [];
  for (const entry of index) {
    let best = 0;
    for (const classSet of entry.classSets) {
      const overlap = classSet.filter((c) => targetSet.has(c)).length;
      if (overlap > best) best = overlap;
    }
    if (best >= minOverlap) results.push({ file: entry.file, matched: best, of: targetClasses.length });
  }
  return results.sort((a, b) => b.matched - a.matched).slice(0, 3);
}
