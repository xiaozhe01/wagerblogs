// The client-safe half of search: query-string keys, scope labels and the
// result shape. Split out because lib/search.ts imports the Payload config to
// build its corpus, and SearchBox is a client component — importing the corpus
// module from the browser pulls payload.config.ts, and with it sharp, into the
// client bundle, where it fails to resolve child_process.
//
// Anything a client component needs belongs here. Anything that touches a
// record belongs in lib/search.ts.

// Also the home for the cache tag. It is read by lib/search.ts and by the
// Payload hook that invalidates it; keeping it in either of those would close a
// cycle, since lib/search.ts imports the Payload config and the config imports
// the collections. This module imports nothing, so it can't.
export const SEARCH_CACHE_TAG = "search-corpus";

export const SEARCH_PARAM = "q";
export const SCOPE_PARAM = "in";

export const searchScopes = {
  all: "Everything",
  news: "News",
  reviews: "Reviews",
  articles: "Articles",
  categories: "Categories",
  pages: "Pages",
} as const;

export type SearchScope = keyof typeof searchScopes;

export type SearchDoc = {
  title: string;
  excerpt: string;
  /** Section, group or content type, shown above the title. */
  kicker: string;
  href: string;
  scope: SearchScope;
};

export type SearchHit = SearchDoc & { score: number };

/** Longest query accepted, by the API route and the results page alike. */
export const MAX_QUERY = 120;

export function resolveScope(value: string | string[] | undefined): SearchScope {
  const raw = Array.isArray(value) ? value[0] : value;
  // hasOwn, not `in`: `?in=constructor` walks the prototype and passes, then
  // crashes the results page on searchScopes[scope].toLowerCase().
  return raw && Object.hasOwn(searchScopes, raw) ? (raw as SearchScope) : "all";
}
