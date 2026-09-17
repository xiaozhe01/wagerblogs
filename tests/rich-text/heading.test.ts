import type { ReactNode } from "react";
import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  headingAnchorId,
  headingConverters,
  headingText,
} from "../../components/rich-text/converters/heading";

const nodesToJSX = ({ nodes }: { nodes: unknown[] }) =>
  (nodes ?? []).map((n) => (n as { text?: string }).text ?? "");

function render(tag: string, text: string) {
  const convert = headingConverters.heading as (args: unknown) => ReactNode;
  return renderToStaticMarkup(
    convert({ node: { children: [{ text }], tag, type: "heading" }, nodesToJSX }) as never,
  );
}

test("h2 derives its anchor id from the heading text", () => {
  assert.equal(
    render("h2", "Reading the number"),
    '<h2 id="reading-the-number">Reading the number</h2>',
  );
});

test("h3 derives its anchor id from the heading text", () => {
  assert.equal(render("h3", "Common mistakes"), '<h3 id="common-mistakes">Common mistakes</h3>');
});

test("h4 derives its anchor id from the heading text", () => {
  assert.equal(render("h4", "Note on payouts"), '<h4 id="note-on-payouts">Note on payouts</h4>');
});

test("ids are deterministic across renders", () => {
  assert.equal(render("h2", "Reading the number"), render("h2", "Reading the number"));
});

test("text is flattened across nested formatting nodes", () => {
  const node = {
    children: [{ text: "Reading " }, { children: [{ text: "the number" }], type: "text" }],
  };
  assert.equal(headingText(node), "Reading the number");
  assert.equal(headingAnchorId(node), "reading-the-number");
});

test("punctuation and casing collapse the same way chipSlug does", () => {
  assert.equal(
    headingAnchorId({ children: [{ text: "What's next — really?" }] }),
    "what-s-next-really",
  );
});

test("a heading with no text emits no id attribute", () => {
  assert.equal(render("h2", ""), "<h2></h2>");
});
