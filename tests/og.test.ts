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
