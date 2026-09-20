import type { SerializedHeadingNode } from "@payloadcms/richtext-lexical";
import type { JSXConverters } from "@payloadcms/richtext-lexical/react";
import { headingAnchorId as anchorId, lexicalNodeText } from "@/lib/lexical";

/** Re-exported from lib/lexical so the page-side TOC derivation and the
 * rendered anchor ids come from one implementation. */
export { headingAnchorId } from "@/lib/lexical";

/** Flattened text of a heading, across whatever formatting nodes it contains. */
export function headingText(node: { children?: unknown[] }): string {
  return lexicalNodeText(node);
}

export const headingConverters: JSXConverters<SerializedHeadingNode> = {
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag;
    return <Tag id={anchorId(node) || undefined}>{nodesToJSX({ nodes: node.children })}</Tag>;
  },
};
