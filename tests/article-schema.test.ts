import assert from "node:assert/strict";
import test from "node:test";
import type { Media } from "../payload-types";
import { articleJsonLd, newsArticleJsonLd } from "../lib/schema";
import { recordImage } from "../lib/og";

const real = {
  headline: "Wisconsin stuns Penn State with comeback from 17 down",
  pagePath: "/news/football/wisconsin-penn-state-score-comeback-fickell",
  datePublished: "2026-09-27T12:00:00.000Z",
  authorName: "Richard Reegan",
  authorUrl: "/authors/richard-reegan",
  image: { url: "/api/media/file/hero-1200x630.webp", width: 1200, height: 630 },
};

test("a complete record emits an absolute-URL NewsArticle", () => {
  const data = newsArticleJsonLd(real);
  assert.ok(data);
  assert.equal(data["@type"], "NewsArticle");
  assert.equal(data.headline, real.headline);
  assert.equal(data.image.url, "https://wagerblogs.com/api/media/file/hero-1200x630.webp");
  assert.equal(data.author.url, "https://wagerblogs.com/authors/richard-reegan");
  assert.equal(data.url, `https://wagerblogs.com${real.pagePath}`);
});

test("only the @type differs between an Article and a NewsArticle", () => {
  const article = articleJsonLd(real);
  const news = newsArticleJsonLd(real);
  assert.ok(article && news);
  assert.equal(article["@type"], "Article");
  assert.deepEqual({ ...article, "@type": null }, { ...news, "@type": null });
});

// The gate, one arm at a time. Every published record but one failed at least
// one of these when this shipped.
test("a bracketed headline gates the whole block off", () => {
  assert.equal(newsArticleJsonLd({ ...real, headline: "[Placeholder headline — Esports]" }), null);
  assert.equal(articleJsonLd({ ...real, headline: "[Placeholder] Bankroll management 101" }), null);
});

test("a placeholder author gates the block off", () => {
  assert.equal(articleJsonLd({ ...real, authorName: "Jane Placeholder" }), null);
  assert.equal(articleJsonLd({ ...real, authorName: undefined }), null);
});

test("a mononym is a real name, not a placeholder", () => {
  assert.ok(articleJsonLd({ ...real, authorName: "Jane" }));
});

test("a non-ISO or bracketed date gates the block off", () => {
  assert.equal(articleJsonLd({ ...real, datePublished: "[Jul 20, 2026]" }), null);
  assert.equal(articleJsonLd({ ...real, datePublished: "Sep 27, 2026" }), null);
  assert.equal(articleJsonLd({ ...real, datePublished: null }), null);
});

test("a record with no image of its own gates the block off", () => {
  assert.equal(articleJsonLd({ ...real, image: undefined }), null);
});

// The reason the previous test matters: recordImage returns undefined rather
// than the sitewide placeholder, so a record with no hero cannot reach the
// emitter with an image at all.
test("recordImage yields undefined rather than the sitewide fallback", () => {
  assert.equal(recordImage(undefined, undefined), undefined);
  assert.equal(recordImage(null as never), undefined);
});

test("recordImage prefers the og derivative and takes the first ref that resolves", () => {
  const hero = {
    id: 1,
    url: "/api/media/file/hero.webp",
    width: 770,
    height: 514,
    sizes: { og: { url: "/api/media/file/hero-1200x630.webp", width: 1200, height: 630 } },
  } as Media;
  assert.deepEqual(recordImage(undefined, hero), {
    url: "/api/media/file/hero-1200x630.webp",
    width: 1200,
    height: 630,
    alt: hero.alt,
  });
});

test("publisher and dateModified are deliberately absent", () => {
  const data = newsArticleJsonLd(real);
  assert.ok(data);
  assert.equal("publisher" in data, false);
  assert.equal("dateModified" in data, false);
});
