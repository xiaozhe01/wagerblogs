import assert from "node:assert/strict";
import test from "node:test";

import { GRID_PAGE_SIZE, PAGE_SIZE, TILE_PAGE_SIZE, paginate, pageHref } from "../lib/pagination";

const items = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

/** Every page of a list, in order. */
function allPages(n: number, perPage: number) {
  const total = paginate(items(n), "1", perPage).totalPages;
  return Array.from({ length: total }, (_, i) => paginate(items(n), String(i + 1), perPage));
}

test("the nav appears on its own as a list grows past one page", () => {
  // The guarantee behind the count line: nothing is hardcoded per route, so a
  // list that gains records gains the control without anyone wiring it again.
  for (const n of [0, 1, 2, 3, 4]) {
    assert.equal(paginate(items(n), "1", GRID_PAGE_SIZE).totalPages, 1, `${n} items`);
  }
  assert.equal(paginate(items(5), "1", GRID_PAGE_SIZE).totalPages, 2);
  assert.equal(paginate(items(9), "1", GRID_PAGE_SIZE).totalPages, 3);
});

test("only the last page is ever short", () => {
  // Grid page sizes are multiples of the column count, so a full page is whole
  // rows. Spreading items evenly instead would short EVERY page and put a
  // half-empty row on each one.
  for (const perPage of [PAGE_SIZE, GRID_PAGE_SIZE, TILE_PAGE_SIZE]) {
    for (let n = 1; n <= 60; n++) {
      const pages = allPages(n, perPage);
      for (const page of pages.slice(0, -1)) {
        assert.equal(page.items.length, perPage, `n=${n} perPage=${perPage} short-filled a page`);
      }
      assert.ok(pages[pages.length - 1].items.length <= perPage);
    }
  }
});

test("paging covers every item exactly once, in order, without exceeding perPage", () => {
  for (const perPage of [PAGE_SIZE, GRID_PAGE_SIZE, TILE_PAGE_SIZE]) {
    for (let n = 0; n <= 60; n++) {
      const pages = allPages(n, perPage);
      const seen = pages.flatMap((p) => p.items);
      assert.deepEqual(seen, items(n), `n=${n} perPage=${perPage}`);
      for (const page of pages) {
        assert.ok(page.items.length <= perPage, `n=${n} perPage=${perPage} overfilled a page`);
      }
    }
  }
});

test("from/to describe the slice the reader is actually looking at", () => {
  const [first, second] = allPages(5, GRID_PAGE_SIZE);
  assert.deepEqual(
    { from: first.from, to: first.to, total: first.total },
    { from: 1, to: 4, total: 5 },
  );
  assert.deepEqual(
    { from: second.from, to: second.to, total: second.total },
    { from: 5, to: 5, total: 5 },
  );
  assert.equal(paginate([], undefined, GRID_PAGE_SIZE).from, 0);
});

test("an out-of-range or malformed ?page never renders an empty list", () => {
  for (const raw of ["99", "0", "-4", "abc", "", undefined, ["3", "9"]]) {
    const result = paginate(items(5), raw, GRID_PAGE_SIZE);
    assert.ok(result.page >= 1 && result.page <= result.totalPages, `?page=${String(raw)}`);
    assert.ok(result.items.length > 0, `?page=${String(raw)} rendered nothing`);
  }
});

test("page 1 keeps one canonical URL and carries other query state", () => {
  assert.equal(pageHref({ basePath: "/articles", page: 1 }), "/articles");
  assert.equal(pageHref({ basePath: "/articles", page: 2 }), "/articles?page=2");
  assert.equal(
    pageHref({ basePath: "/articles", page: 2, params: { type: "guide" } }),
    "/articles?type=guide&page=2",
  );
  assert.equal(
    pageHref({ basePath: "/articles", page: 2, anchor: "section-all-articles" }),
    "/articles?page=2#section-all-articles",
  );
});
