import assert from "node:assert/strict";
import test from "node:test";

import { slugLabel } from "../lib/utils";

test("a story slug becomes a short breadcrumb label, not the headline", () => {
  assert.equal(
    slugLabel("wisconsin-penn-state-score-comeback-fickell"),
    "Wisconsin Penn State Score Comeback Fickell",
  );
});

test("minor words stay lowercase unless they lead", () => {
  assert.equal(slugLabel("parlays-vs-straight-bets"), "Parlays vs Straight Bets");
  assert.equal(slugLabel("the-house-edge"), "The House Edge");
  assert.equal(slugLabel("vs-the-spread"), "Vs the Spread");
});

test("the label is always shorter than the headline it replaces", () => {
  // The whole point of the change: a crumb must not carry a 78-character title.
  const slug = "wisconsin-penn-state-score-comeback-fickell";
  const headline = "Wisconsin stuns Penn State with comeback from 17 down for Luke Fickell's biggest win";
  assert.ok(slugLabel(slug).length < headline.length);
});

test("stray and repeated hyphens do not produce empty words", () => {
  assert.equal(slugLabel("-double--hyphen-"), "Double Hyphen");
  assert.equal(slugLabel(""), "");
});

test("numerals and already-short slugs pass through intact", () => {
  assert.equal(slugLabel("nfl-week-3-picks"), "Nfl Week 3 Picks");
  assert.equal(slugLabel("examplebet"), "Examplebet");
});
