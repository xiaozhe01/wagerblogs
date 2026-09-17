import { newsSections } from "@/lib/news";
import { reviewGroups } from "@/lib/reviews";
import { categories } from "@/lib/categories";
import { blogPosts } from "@/lib/blog";
import { siteFaqs } from "@/lib/faq";
import { legalDocs } from "@/lib/mock-data";

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

// Built from the registries the routes resolve from, so a hit cannot link to a
// page that doesn't exist. Server-only — importing this into a client component
// pulls ~37KB of mock-data into the bundle; the API route is the boundary.
// TODO(cms): body copy lives in JSX, so only titles and summaries are indexed.
let cached: SearchDoc[] | null = null;

export function searchDocuments(): SearchDoc[] {
  if (cached) return cached;
  return (cached = [
    ...newsSections.flatMap((section) => [
      {
        title: `${section.category} news`,
        excerpt: `Every story filed under ${section.category}.`,
        kicker: "News section",
        href: section.href,
        scope: "news" as const,
      },
      ...section.stories.map((story) => ({
        title: story.title,
        excerpt: story.excerpt,
        kicker: section.category,
        href: story.href,
        scope: "news" as const,
      })),
    ]),
    ...reviewGroups.flatMap((group) => [
      {
        title: group.title,
        excerpt: `Every ${group.noun} we've reviewed, scored on the same criteria.`,
        kicker: "Review group",
        href: group.href,
        scope: "reviews" as const,
      },
      ...group.operators.map((operator) => ({
        title: `${operator.name} review`,
        // Not ??: an empty array joins to "", which is falsy but not nullish.
        excerpt: operator.advantages?.length
          ? operator.advantages.join(" · ")
          : `Our tested ${group.noun} review — score, strengths and trade-offs.`,
        kicker: group.crumb,
        href: `${group.href}/${operator.slug}`,
        scope: "reviews" as const,
      })),
    ]),
    ...blogPosts.map((post) => ({
      title: post.title,
      excerpt: post.excerpt,
      kicker: post.kicker,
      href: post.href,
      scope: "articles" as const,
    })),
    ...categories.map((category) => ({
      title: category.name,
      excerpt: category.desc,
      kicker: "Category",
      href: category.href,
      scope: "categories" as const,
    })),
    ...siteFaqs.map((faq) => ({
      title: faq.q,
      excerpt: faq.a,
      kicker: "FAQ",
      href: "/faq",
      scope: "pages" as const,
    })),
    ...Object.entries(legalDocs).map(([slug, doc]) => ({
      title: doc.title,
      excerpt: doc.summary,
      kicker: "Legal",
      href: `/legal/${slug}`,
      scope: "pages" as const,
    })),
    {
      title: "About WagerBlogs",
      excerpt: "Who publishes this site, how we review, and how we make money.",
      kicker: "Page",
      href: "/about",
      scope: "pages",
    },
    {
      title: "Responsible gambling",
      excerpt: "Warning signs, a self-check, deposit and time limits, and where to get help.",
      kicker: "Page",
      href: "/responsible-gambling",
      scope: "pages",
    },
    {
      title: "Worldwide gambling-help organisations",
      excerpt: "Free, confidential help by region, with the contact routes each one offers.",
      kicker: "Page",
      href: "/responsible-gambling/help-directory",
      scope: "pages",
    },
    {
      title: "Contact",
      excerpt: "Corrections, editorial enquiries, and partnerships — handled separately.",
      kicker: "Page",
      href: "/contact",
      scope: "pages",
    },
  ]);
}

const normalise = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Scored but never required, so one word no record contains can't empty a query.
const OPTIONAL = new Set([
  "a",
  "an",
  "and",
  "are",
  "at",
  "be",
  "by",
  "do",
  "does",
  "for",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "the",
  "to",
  "we",
  "what",
  "with",
  "you",
  "your",
]);

/** Compiled once per query rather than per document — `search` scores the whole
 * corpus on every keystroke. No `g` flag, so `test` is safe to repeat. */
type Term = { text: string; word: RegExp; prefix: RegExp; optional: boolean };

const compile = (terms: string[]): Term[] =>
  terms.map((text) => ({
    text,
    word: new RegExp(`\\b${text}\\b`),
    prefix: new RegExp(`\\b${text}`),
    optional: OPTIONAL.has(text),
  }));

/** Whole word beats word-prefix beats mid-word — that ranks "StakeHarbor" above
 * "Sweepstakes" for `stake`. */
function hitValue(haystack: string, term: Term, weights: [number, number, number]): number {
  if (term.word.test(haystack)) return weights[0];
  if (term.prefix.test(haystack)) return weights[1];
  return haystack.includes(term.text) ? weights[2] : 0;
}

/** The corpus is fixed, so each document is normalised once, not per query. */
type IndexedDoc = { doc: SearchDoc; title: string; body: string };
let index: IndexedDoc[] | null = null;

const searchIndex = (): IndexedDoc[] =>
  (index ??= searchDocuments().map((doc) => ({
    doc,
    title: normalise(doc.title),
    body: normalise(`${doc.excerpt} ${doc.kicker}`),
  })));

function scoreDoc(entry: IndexedDoc, terms: Term[]): number {
  let score = 0;

  for (const term of terms) {
    const t = hitValue(entry.title, term, [12, 9, 6]);
    const b = hitValue(entry.body, term, [4, 3, 1]);
    // A required term absent from both is a miss, so a two-word query can't
    // match on the commoner word alone.
    if (t === 0 && b === 0 && !term.optional) return 0;
    score += t + b;
  }

  // Shorter titles carrying the same terms are the more specific answer.
  return score + Math.max(0, 3 - entry.title.split(" ").length / 8);
}

export function search(query: string, scope: SearchScope = "all", limit?: number): SearchHit[] {
  const terms = compile(normalise(query.slice(0, MAX_QUERY)).split(" ").filter(Boolean));
  // An all-optional query ("how do you") would otherwise match everything at 0.
  if (terms.length === 0 || terms.every((term) => term.optional)) return [];

  const hits = searchIndex()
    .filter((entry) => scope === "all" || entry.doc.scope === scope)
    .map((entry) => ({ ...entry.doc, score: scoreDoc(entry, terms) }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  return limit == null ? hits : hits.slice(0, limit);
}

export function resolveScope(value: string | string[] | undefined): SearchScope {
  const raw = Array.isArray(value) ? value[0] : value;
  // hasOwn, not `in`: `?in=constructor` walks the prototype and passes, then
  // crashes the results page on searchScopes[scope].toLowerCase().
  return raw && Object.hasOwn(searchScopes, raw) ? (raw as SearchScope) : "all";
}
