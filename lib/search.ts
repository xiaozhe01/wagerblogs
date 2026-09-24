import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { publishedFilter } from "@/lib/payload-queries";
import {
  MAX_QUERY,
  SEARCH_CACHE_TAG,
  type SearchDoc,
  type SearchHit,
  type SearchScope,
} from "@/lib/search-shared";
import {
  articleUrl,
  authorUrl,
  categoryUrl,
  legalUrl,
  newsUrl,
  reviewIndexUrl,
  reviewUrl,
  sectionUrl,
} from "@/lib/urls";

// Re-exported so server callers keep one import. Client components must import
// from lib/search-shared directly — see the note at the top of that file.
export {
  MAX_QUERY,
  SCOPE_PARAM,
  SEARCH_PARAM,
  resolveScope,
  searchScopes,
  type SearchDoc,
  type SearchHit,
  type SearchScope,
} from "@/lib/search-shared";

/** Routes with no record behind them. About, Contact and Responsible Gambling
 * are deliberately static — see MIGRATION.md. */
const STATIC_DOCS: SearchDoc[] = [
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
];

const ARTICLE_KICKER = {
  guide: "Guide",
  analysis: "Analysis",
  research: "Research",
  blog: "Blog",
} as const;

// Built from the records the routes resolve from, so a hit cannot link to a
// page that doesn't exist.
// TODO(cms): body copy is Lexical rich text, so only titles and summaries are
// indexed.
async function buildCorpus(): Promise<SearchDoc[]> {
  const payload = await getPayload({ config });

  // Independent queries, run once per cache miss rather than per request, so
  // the concurrency is a batch cost rather than per-user pool pressure.
  // depth 1 where the record's URL needs its relationship populated.
  const [reviews, articles, stories, authors, verticals, newsSections, faq, legal] =
    await Promise.all([
      payload.find({
        collection: "reviews",
        ...publishedFilter(false),
        limit: 1000,
        depth: 1,
        overrideAccess: false,
      }),
      payload.find({
        collection: "articles",
        ...publishedFilter(false),
        limit: 1000,
        depth: 1,
        overrideAccess: false,
      }),
      payload.find({
        collection: "news",
        ...publishedFilter(false),
        limit: 1000,
        depth: 1,
        overrideAccess: false,
      }),
      payload.find({
        collection: "authors",
        ...publishedFilter(false),
        limit: 1000,
        depth: 0,
        overrideAccess: false,
      }),
      // Structural taxonomies: no drafts, so no _status filter.
      payload.find({
        collection: "verticals",
        sort: "order",
        limit: 100,
        depth: 0,
        overrideAccess: false,
      }),
      payload.find({
        collection: "news-sections",
        sort: "order",
        limit: 100,
        depth: 0,
        overrideAccess: false,
      }),
      payload.findGlobal({ slug: "faq", depth: 0, overrideAccess: false }),
      payload.findGlobal({ slug: "legal-documents", depth: 0, overrideAccess: false }),
    ]);

  return [
    ...newsSections.docs.map((section) => ({
      title: `${section.name} news`,
      excerpt: `Every story filed under ${section.name}.`,
      kicker: "News section",
      href: sectionUrl(section),
      scope: "news" as const,
    })),
    ...stories.docs.flatMap((story) => {
      const href = newsUrl(story);
      const section = typeof story.section === "object" ? story.section : undefined;
      return href
        ? [
            {
              title: story.title,
              excerpt: story.excerpt,
              kicker: section?.name ?? "News",
              href,
              scope: "news" as const,
            },
          ]
        : [];
    }),
    ...verticals.docs
      .filter((vertical) => vertical.hasReviews)
      .map((vertical) => ({
        title: `${vertical.name} reviews`,
        excerpt: `Every ${vertical.noun} we've reviewed, scored on the same criteria.`,
        kicker: "Review group",
        href: reviewIndexUrl(vertical),
        scope: "reviews" as const,
      })),
    ...reviews.docs.flatMap((review) => {
      const href = reviewUrl(review);
      const vertical = typeof review.vertical === "object" ? review.vertical : undefined;
      return href
        ? [
            {
              title: `${review.name} review`,
              // advantages is the schema's designated search excerpt. Not ??:
              // an empty array joins to "", which is falsy but not nullish.
              excerpt: review.advantages?.length
                ? review.advantages.map((row) => row.advantage).join(" · ")
                : review.seo.metaDescription,
              kicker: vertical?.crumb ?? "Review",
              href,
              scope: "reviews" as const,
            },
          ]
        : [];
    }),
    ...articles.docs.map((article) => ({
      title: article.title,
      excerpt: article.excerpt,
      kicker: ARTICLE_KICKER[article.type],
      href: articleUrl(article),
      scope: "articles" as const,
    })),
    ...verticals.docs.map((vertical) => ({
      title: vertical.name,
      excerpt: vertical.description,
      kicker: "Category",
      href: categoryUrl(vertical),
      scope: "categories" as const,
    })),
    // Scoped to "pages": searchScopes has no authors key, and adding one would
    // put a new chip in the results filter.
    ...authors.docs.map((author) => ({
      title: author.name,
      excerpt: author.credentialLine,
      kicker: "Author",
      href: authorUrl(author),
      scope: "pages" as const,
    })),
    // A global. `status` here is the entry's own moderation state, not the
    // editorial _status lifecycle — same filter as faq/page.tsx.
    ...(faq.entries ?? [])
      .filter((entry) => entry.status === "published")
      .map((entry) => ({
        title: entry.question,
        excerpt: entry.answer,
        kicker: "FAQ",
        href: "/faq",
        scope: "pages" as const,
      })),
    ...(legal.documents ?? []).map((doc) => ({
      title: doc.title,
      excerpt: doc.summary,
      kicker: "Legal",
      href: legalUrl(doc),
      scope: "pages" as const,
    })),
    ...STATIC_DOCS,
  ];
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

/** The corpus is fixed between revalidations, so each document is normalised
 * once, not per query. Normalisation happens inside the cache rather than
 * after it: an IndexedDoc is plain strings, so it survives serialisation, and
 * caching the raw corpus instead would re-normalise on every request. */
type IndexedDoc = { doc: SearchDoc; title: string; body: string };

const searchIndex = unstable_cache(
  async (): Promise<IndexedDoc[]> =>
    (await buildCorpus()).map((doc) => ({
      doc,
      title: normalise(doc.title),
      body: normalise(`${doc.excerpt} ${doc.kicker}`),
    })),
  ["search-index"],
  { revalidate: 3600, tags: [SEARCH_CACHE_TAG] },
);

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

/** Async only at the corpus boundary — the scoring below is in-memory against
 * the cached index and issues no query of its own. */
export async function search(
  query: string,
  scope: SearchScope = "all",
  limit?: number,
): Promise<SearchHit[]> {
  const terms = compile(normalise(query.slice(0, MAX_QUERY)).split(" ").filter(Boolean));
  // An all-optional query ("how do you") would otherwise match everything at 0.
  if (terms.length === 0 || terms.every((term) => term.optional)) return [];

  const hits = (await searchIndex())
    .filter((entry) => scope === "all" || entry.doc.scope === scope)
    .map((entry) => ({ ...entry.doc, score: scoreDoc(entry, terms) }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  return limit == null ? hits : hits.slice(0, limit);
}
