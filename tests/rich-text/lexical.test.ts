import assert from "node:assert/strict";
import test from "node:test";
import { deriveHeadings, lexicalPlainText, readTime } from "../../lib/lexical";

const heading = (tag: string, text: string) => ({
  type: "heading",
  tag,
  children: [{ text }],
});

const body = {
  root: {
    children: [
      { type: "paragraph", children: [{ text: "Intro paragraph." }] },
      heading("h2", "Reading the number"),
      { type: "paragraph", children: [{ text: "Body." }] },
      heading("h3", "Common mistakes"),
      heading("h4", "Note on payouts"),
    ],
  },
};

test("deriveHeadings returns h2/h3/h4 in document order with derived ids", () => {
  assert.deepEqual(deriveHeadings(body), [
    { id: "reading-the-number", label: "Reading the number", level: 2 },
    { id: "common-mistakes", label: "Common mistakes", level: 3 },
    { id: "note-on-payouts", label: "Note on payouts", level: 4 },
  ]);
});

test("deriveHeadings ids match the ids the heading converter renders", async () => {
  const { headingAnchorId } = await import("../../components/rich-text/converters/heading");
  for (const h of deriveHeadings(body)) {
    assert.equal(headingAnchorId({ children: [{ text: h.label }] }), h.id);
  }
});

test("deriveHeadings is deterministic", () => {
  assert.deepEqual(deriveHeadings(body), deriveHeadings(body));
});

test("a body with no headings yields no table of contents", () => {
  assert.deepEqual(
    deriveHeadings({ root: { children: [{ type: "paragraph", children: [] }] } }),
    [],
  );
});

test("h1 is never collected — it is not in the enabled feature set", () => {
  assert.deepEqual(deriveHeadings({ root: { children: [heading("h1", "Title")] } }), []);
});

test("headings with nested formatting still flatten to one label", () => {
  const nested = {
    root: {
      children: [
        {
          type: "heading",
          tag: "h2",
          children: [{ text: "Reading " }, { children: [{ text: "the number" }] }],
        },
      ],
    },
  };
  assert.deepEqual(deriveHeadings(nested), [
    { id: "reading-the-number", label: "Reading the number", level: 2 },
  ]);
});

test("readTime rounds up and never returns zero", () => {
  assert.equal(readTime(body), "1 min read");
  const long = {
    root: { children: [{ type: "paragraph", children: [{ text: "word ".repeat(600) }] }] },
  };
  assert.equal(readTime(long), "3 min read");
});

test("lexicalPlainText walks the whole tree", () => {
  assert.ok(lexicalPlainText(body).includes("Reading the number"));
  assert.ok(lexicalPlainText(body).includes("Intro paragraph."));
});
