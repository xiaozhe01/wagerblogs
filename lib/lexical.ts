// Helpers that read Payload's Lexical JSON without rendering it. The rendering
// side lives in components/rich-text/, and imports the heading helpers below
// so a derived table of contents and the rendered anchor ids cannot disagree.

import { chipSlug } from "@/lib/utils";

export type DerivedHeading = { id: string; label: string; level: 2 | 3 | 4 };

const WORDS_PER_MINUTE = 250;

/** Every text node in a Lexical tree, flattened. */
export function lexicalPlainText(data: unknown): string {
  const parts: string[] = [];
  const walk = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!node || typeof node !== "object") return;
    const n = node as { children?: unknown; root?: unknown; text?: unknown };
    if (typeof n.text === "string") parts.push(n.text);
    if (n.root) walk(n.root);
    if (n.children) walk(n.children);
  };
  walk(data);
  return parts.join(" ");
}

/** Reading time derived from the body, because no record stores one. Rounds up
 * so a short piece reads "1 min read" rather than "0". */
export function readTime(body: unknown): string {
  const words = lexicalPlainText(body).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min read`;
}

/** Flattened text of a single node's subtree. */
export function lexicalNodeText(node: { children?: unknown }): string {
  return lexicalPlainText(node.children).replace(/\s+/g, " ").trim();
}

/** Deterministic: the same heading text yields the same id on every render. */
export function headingAnchorId(node: { children?: unknown }): string {
  return chipSlug(lexicalNodeText(node));
}

/** h2/h3/h4 nodes in document order, with the ids the converter will render.
 * h1 is not in the enabled feature set, so it never appears. */
export function deriveHeadings(body: unknown): DerivedHeading[] {
  const out: DerivedHeading[] = [];
  const walk = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!node || typeof node !== "object") return;
    const n = node as { children?: unknown; root?: unknown; tag?: unknown; type?: unknown };
    if (n.type === "heading" && typeof n.tag === "string" && /^h[234]$/.test(n.tag)) {
      const label = lexicalNodeText(n);
      if (label) {
        out.push({ id: chipSlug(label), label, level: Number(n.tag.slice(1)) as 2 | 3 | 4 });
      }
    }
    if (n.root) walk(n.root);
    if (n.children) walk(n.children);
  };
  walk(body);
  return out;
}
