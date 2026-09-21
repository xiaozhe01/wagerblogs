import assert from "node:assert/strict";
import test from "node:test";
import type { Article, Media, News } from "../payload-types";
import { articleRow } from "../lib/article-rows";
import { storyRow } from "../lib/news-rows";

const body = {
  root: { type: "root", children: [], direction: null, format: "", indent: 0, version: 1 },
};

const media = { id: 7, url: "/api/media/file/hero.jpg", alt: "Hero" } as Media;

const article = (heroImage: Article["heroImage"]) =>
  ({
    id: 1,
    slug: "a-guide",
    title: "A guide",
    type: "guide",
    excerpt: "dek",
    body,
    heroImage,
  }) as unknown as Article;

const story = (heroImage: News["heroImage"]) =>
  ({
    id: 2,
    slug: "a-story",
    title: "A story",
    excerpt: "dek",
    body,
    heroImage,
  }) as unknown as News;

test("articleRow passes a populated heroImage through", () => {
  assert.equal(articleRow(article(media)).thumbnail, media);
});

test("articleRow leaves the thumbnail unresolvable when the record has none", () => {
  assert.equal(articleRow(article(null)).thumbnail, null);
});

test("articleRow passes an unpopulated relationship through as the bare id", () => {
  // depth 0 hands back a number; the skeleton branch is what must render.
  assert.equal(articleRow(article(7)).thumbnail, 7);
});

test("storyRow passes a populated heroImage through", () => {
  assert.equal(storyRow(story(media), "football").thumbnail, media);
});

test("storyRow leaves the thumbnail unresolvable when the record has none", () => {
  assert.equal(storyRow(story(null), "football").thumbnail, null);
});
