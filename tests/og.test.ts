import assert from "node:assert/strict";
import test from "node:test";
import type { Media } from "../payload-types";
import { DEFAULT_OG_IMAGE, SITE_NAME, buildOpenGraph } from "../lib/og";

const media = {
  id: 7,
  url: "/api/media/file/card.png",
  alt: "A real card",
  width: 1600,
  height: 900,
} as Media;

/** Metadata["openGraph"] is a wide union; every case here passes an object. */
const og = (...args: Parameters<typeof buildOpenGraph>) =>
  buildOpenGraph(...args) as {
    type: string;
    siteName: string;
    title?: string;
    description?: string;
    url?: string;
    images: { url: string; width?: number; height?: number; alt: string }[];
  };

test("an unpopulated ogImage falls back to the sitewide placeholder", () => {
  for (const value of [undefined, null, 7]) {
    const result = og({ title: "T", description: "D", ogImage: value });
    assert.deepEqual(result.images[0], DEFAULT_OG_IMAGE, `ogImage=${String(value)}`);
  }
});

test("a populated ogImage supplies url, dimensions and its own alt", () => {
  const result = og({ title: "T", ogImage: media });
  assert.deepEqual(result.images[0], {
    url: "/api/media/file/card.png",
    width: 1600,
    height: 900,
    alt: "A real card",
  });
});

test("a record without stored dimensions still emits the image", () => {
  const result = og({ ogImage: { id: 8, url: "/x.png", alt: "No size" } as Media });
  assert.deepEqual(result.images[0], { url: "/x.png", alt: "No size" });
});

test("heroImage is never a substitute — only ogImage is read", () => {
  const result = og({ title: "T", ogImage: undefined });
  assert.equal(result.images[0].url, DEFAULT_OG_IMAGE.url);
});

test("type defaults to website and can be overridden per route", () => {
  assert.equal(og({ title: "T" }).type, "website");
  assert.equal(og({ title: "T", type: "article" }).type, "article");
  assert.equal(og({ title: "T", type: "profile" }).type, "profile");
});

test("siteName is always present, because the layout's cannot reach the route", () => {
  assert.equal(og({ title: "T" }).siteName, SITE_NAME);
  assert.equal(og({}).siteName, SITE_NAME);
});

test("path emits url; no path emits no url field", () => {
  assert.equal(og({ title: "T", path: "/articles/x" }).url, "/articles/x");
  assert.ok(!("url" in og({ title: "T" })));
});

test("an unwritten metaTitle or metaDescription is omitted, not emitted empty", () => {
  const result = og({ title: undefined, description: null });
  assert.ok(!("title" in result));
  assert.ok(!("description" in result));
});

test("article:* is emitted only on an article, never on a website", () => {
  const args = {
    type: "article" as const,
    publishedTime: "2026-09-27T12:00:00.000Z",
    modifiedTime: "2026-09-27T04:58:33.556Z",
    authors: ["Richard Reegan"],
    section: "Football",
  };
  const article = buildOpenGraph(args) as Record<string, unknown>;
  assert.equal(article.publishedTime, args.publishedTime);
  assert.equal(article.modifiedTime, args.modifiedTime);
  assert.deepEqual(article.authors, ["Richard Reegan"]);
  assert.equal(article.section, "Football");

  const website = buildOpenGraph({ ...args, type: "website" }) as Record<string, unknown>;
  for (const key of ["publishedTime", "modifiedTime", "authors", "section"]) {
    assert.ok(!(key in website), `${key} leaked onto a website`);
  }
});

test("a placeholder date never becomes a machine-readable timestamp", () => {
  // The CMS still carries bracketed dates on unwritten records. Emitting one
  // as article:published_time would publish a fabricated fact.
  for (const bad of ["[Jul 18, 2026]", "", "TBC", "coming soon"]) {
    const og = buildOpenGraph({ type: "article", publishedTime: bad }) as Record<string, unknown>;
    assert.ok(!("publishedTime" in og), `emitted ${JSON.stringify(bad)}`);
  }
});

test("an absent author or section is omitted rather than emitted empty", () => {
  const og = buildOpenGraph({
    type: "article",
    authors: [undefined, null, "  "],
    section: "   ",
  }) as Record<string, unknown>;
  assert.ok(!("authors" in og));
  assert.ok(!("section" in og));
});
