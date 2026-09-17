import type { SerializedHeadingNode } from "@payloadcms/richtext-lexical";
import type { JSXConverters } from "@payloadcms/richtext-lexical/react";
import { chipSlug } from "@/lib/utils";

/** Flattened text of a heading, across whatever formatting nodes it contains.
 * Exported because Phase 4 derives the in-article TOC from the same values —
 * the TOC and the anchor must come from one function or they drift. */
export function headingText(node: { children?: unknown[] }): string {
  const parts: string[] = [];
  const walk = (nodes: undefined | unknown[]) => {
    for (const child of nodes ?? []) {
      const n = child as { children?: unknown[]; text?: unknown };
      if (typeof n.text === "string") parts.push(n.text);
      if (Array.isArray(n.children)) walk(n.children);
    }
  };
  walk(node.children);
  return parts.join("").trim();
}

/** Deterministic: the same heading text yields the same id on every render. */
export function headingAnchorId(node: { children?: unknown[] }): string {
  return chipSlug(headingText(node));
}

export const headingConverters: JSXConverters<SerializedHeadingNode> = {
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag;
    return (
      <Tag id={headingAnchorId(node) || undefined}>{nodesToJSX({ nodes: node.children })}</Tag>
    );
  },
};
