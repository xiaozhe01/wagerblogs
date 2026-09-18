// Helpers that read Payload's Lexical JSON without rendering it. The rendering
// side lives in components/rich-text/.

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
