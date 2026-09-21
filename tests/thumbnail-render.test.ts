import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Media } from "../payload-types";
import BlogPostCard from "../components/cards/BlogPostCard";
import PostRow from "../components/cards/PostRow";
import { resolveMedia } from "../components/cards/MediaImage";

// No record carries a heroImage yet, so the branch that renders one cannot be
// reached by browsing. resolveMedia is the predicate both surfaces branch on,
// so it is tested directly; the skeleton side is then asserted through a real
// render. The populated side cannot render here — next/image resolves to a
// module namespace outside Next's bundler — and is covered live by the author
// photo, which uses this same resolveMedia + MediaImage pair.

const media = { id: 7, url: "/hero.jpg", alt: "Hero alt", width: 1600, height: 900 } as Media;

test("resolveMedia accepts only a populated record with a file", () => {
  assert.equal(resolveMedia(media), media);
  assert.equal(resolveMedia(undefined), undefined);
  assert.equal(resolveMedia(null), undefined);
  // depth 0 hands back the bare id: renderable only once the query populates it.
  assert.equal(resolveMedia(7), undefined);
  // a record whose upload never completed has no url, so there is nothing to show.
  assert.equal(resolveMedia({ id: 7, alt: "no file" } as Media), undefined);
});

const card = (thumbnail: unknown) =>
  renderToStaticMarkup(
    createElement(BlogPostCard, { href: "/articles/x", title: "T", thumbnail } as never),
  );

const row = (thumbnail: unknown) =>
  renderToStaticMarkup(
    createElement(PostRow, { post: { title: "T", meta: "m", href: "/x", thumbnail } } as never),
  );

test("BlogPostCard keeps its skeleton for every unrenderable thumbnail", () => {
  for (const value of [undefined, null, 7]) {
    const html = card(value);
    assert.match(html, /placeholder-asset/, `thumbnail=${String(value)} lost the skeleton`);
    assert.doesNotMatch(html, /<img/);
  }
});

test("PostRow keeps its skeleton for every unrenderable thumbnail", () => {
  for (const value of [undefined, null, 7]) {
    const html = row(value);
    assert.match(html, /placeholder-asset/, `thumbnail=${String(value)} lost the skeleton`);
    assert.doesNotMatch(html, /<img/);
  }
});
