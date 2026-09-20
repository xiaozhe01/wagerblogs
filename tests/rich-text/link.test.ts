import type { ReactNode } from "react";
import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { isExternalHref, linkConverters } from "../../components/rich-text/converters/link";

const SAFE_REL = 'rel="nofollow noopener noreferrer"';

const nodesToJSX = ({ nodes }: { nodes: unknown[] }) =>
  (nodes ?? []).map((n) => (n as { text?: string }).text ?? "");

function render(fields: Record<string, unknown>, kind: "autolink" | "link" = "link") {
  const convert = linkConverters[kind] as (args: unknown) => ReactNode;
  return renderToStaticMarkup(
    convert({
      node: { children: [{ text: "anchor" }], fields, type: kind },
      nodesToJSX,
    }) as never,
  );
}

test("internal root-relative href gets no forced rel", () => {
  const html = render({ linkType: "custom", newTab: false, url: "/articles/foo" });
  assert.ok(!html.includes("rel="), html);
  assert.ok(html.includes('href="/articles/foo"'));
});

test("internal fragment href gets no forced rel", () => {
  assert.ok(!render({ linkType: "custom", newTab: false, url: "#section-1" }).includes("rel="));
});

test("own hostname is internal", () => {
  assert.ok(
    !render({ linkType: "custom", newTab: false, url: "https://wagerblogs.com/foo" }).includes(
      "rel=",
    ),
  );
});

test("own hostname with trailing slash is internal", () => {
  assert.equal(isExternalHref("https://wagerblogs.com/foo/"), false);
});

test("www prefix is the same property, so internal", () => {
  assert.equal(isExternalHref("https://www.wagerblogs.com/foo"), false);
});

test("other subdomains are treated as external", () => {
  assert.equal(isExternalHref("https://blog.wagerblogs.com"), true);
});

test("external href is forced to the safe rel", () => {
  const html = render({ linkType: "custom", newTab: false, url: "https://example.com" });
  assert.ok(html.includes(SAFE_REL), html);
});

// Regression guard, not a live path: Payload's stock LinkFeature exposes no
// rel field (LinkFields is doc/linkType/newTab/url), but the type is indexed
// by [key: string], so a future `fields` config could add one. If that ever
// happens, an author-supplied value must still lose to the forced rel.
test("author-supplied rel in node data never wins", () => {
  const html = render({
    linkType: "custom",
    newTab: false,
    rel: "dofollow",
    url: "https://example.com",
  });
  assert.ok(html.includes(SAFE_REL), html);
  assert.ok(!html.includes("dofollow"), html);
});

test("mailto is skipped — no rel forced", () => {
  const html = render({ linkType: "custom", newTab: false, url: "mailto:foo@bar.com" });
  assert.ok(!html.includes("rel="), html);
  assert.ok(html.includes('href="mailto:foo@bar.com"'));
});

test("protocol-relative href is external despite the leading slash", () => {
  assert.equal(isExternalHref("//evil.example.com/x"), true);
  assert.ok(
    render({ linkType: "custom", newTab: false, url: "//evil.example.com/x" }).includes(SAFE_REL),
  );
});

test("newTab on an internal link keeps the stock rel", () => {
  const html = render({ linkType: "custom", newTab: true, url: "/articles/foo" });
  assert.ok(html.includes('rel="noopener noreferrer"'), html);
  assert.ok(html.includes('target="_blank"'));
});

test("newTab on an external link still gets nofollow", () => {
  assert.ok(
    render({ linkType: "custom", newTab: true, url: "https://example.com" }).includes(SAFE_REL),
  );
});

test("autolink nodes are enforced the same way", () => {
  assert.ok(
    render({ linkType: "custom", newTab: false, url: "https://example.com" }, "autolink").includes(
      SAFE_REL,
    ),
  );
});

const doc = (relationTo: string, value: Record<string, unknown>) => ({
  linkType: "internal",
  newTab: false,
  doc: { relationTo, value },
});

test("internal links map each linkable collection to its route", () => {
  const cases: [string, Record<string, unknown>, string][] = [
    ["articles", { slug: "odds-boosts" }, "/articles/odds-boosts"],
    ["authors", { slug: "dave" }, "/authors/dave"],
    ["verticals", { slug: "sportsbooks" }, "/categories/sportsbooks"],
    ["news-sections", { slug: "football" }, "/news/football"],
    [
      "news",
      { slug: "transfer-window", section: { slug: "football" } },
      "/news/football/transfer-window",
    ],
    [
      "reviews",
      { slug: "stakeblogs", vertical: { slug: "online-casinos" } },
      "/reviews/online-casinos/stakeblogs",
    ],
  ];
  for (const [relationTo, value, href] of cases) {
    assert.ok(
      render(doc(relationTo, value)).includes(`href="${href}"`),
      `${relationTo} -> ${href}`,
    );
  }
});

// Anything unresolvable becomes a visibly broken href rather than a silent "#",
// so a bad link is findable in the rendered page.
test("unresolvable internal links fall through to a visible marker", () => {
  const unresolved = 'href="/#internal-link-not-resolved"';
  // A news story whose section was not populated deeply enough.
  assert.ok(render(doc("news", { slug: "transfer-window" })).includes(unresolved));
  // A review whose vertical was not populated.
  assert.ok(render(doc("reviews", { slug: "stakeblogs" })).includes(unresolved));
  // A collection that is not linkable from body content.
  assert.ok(render(doc("comments", { slug: "whatever" })).includes(unresolved));
  // A reference that came back as a bare id rather than a document.
  assert.ok(
    render({
      linkType: "internal",
      newTab: false,
      doc: { relationTo: "articles", value: 7 },
    }).includes(unresolved),
  );
});

test("internal links are never treated as external", () => {
  assert.ok(!render(doc("articles", { slug: "odds-boosts" })).includes("nofollow"));
});

test("empty and unparseable hrefs are not external", () => {
  assert.equal(isExternalHref(""), false);
  assert.equal(isExternalHref(undefined), false);
  assert.equal(isExternalHref("http://["), false);
});
