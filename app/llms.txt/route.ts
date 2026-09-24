import { getPayload } from "payload";
import config from "@payload-config";
import { siteUrl } from "@/lib/schema";
import { publishedFilter } from "@/lib/payload-queries";
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

// llmstxt.org convention: a markdown site map for language models. A proposed
// convention, not a standard. A route handler rather than a static
// public/llms.txt so it reads the same records the routes resolve from and
// cannot list a dead URL. It previously read lib/ fixtures and carried five
// dead links. See MIGRATION.md.
export const dynamic = "force-static";
export const revalidate = 3600;

const MAX_NOTE = 200;

/** Descriptions come from editor-written fields of unbounded length. Trim on a
 * word boundary — a note cut mid-word is worth less than a shorter whole one. */
function note(text: string | null | undefined): string {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= MAX_NOTE) return clean;
  const cut = clean.slice(0, MAX_NOTE);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function section(heading: string, lines: string[]) {
  return lines.length ? `## ${heading}\n\n${lines.join("\n")}\n` : "";
}

const link = (path: string, label: string, text: string | null | undefined) => {
  const description = note(text);
  return `- [${label}](${siteUrl}${path})${description ? `: ${description}` : ""}`;
};

/** Stable-sorts by a secondary key applied over an already-sorted list. */
const byKey =
  <T>(key: (item: T) => string) =>
  (a: T, b: T) =>
    key(a).localeCompare(key(b));

const verticalName = (record: { vertical: number | { name: string } }) =>
  typeof record.vertical === "object" ? record.vertical.name : "";

const sectionName = (record: { section: number | { name: string } }) =>
  typeof record.section === "object" ? record.section.name : "";

export async function GET() {
  const payload = await getPayload({ config });

  // Sequential, as everywhere else — this renders once per revalidation
  // window, not in a user's request path.

  // Structural taxonomies: no drafts, so no _status filter.
  const { docs: verticals } = await payload.find({
    collection: "verticals",
    sort: "order",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });
  const { docs: newsSections } = await payload.find({
    collection: "news-sections",
    sort: "order",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });

  // Editorial collections: published only. No draftMode — llms.txt is a
  // crawler surface, which never carries the bypass cookie.
  // depth 1 on reviews and news populates the relationship their URL needs.
  const { docs: reviews } = await payload.find({
    collection: "reviews",
    ...publishedFilter(false),
    sort: "name",
    limit: 1000,
    depth: 1,
    overrideAccess: false,
  });
  const { docs: stories } = await payload.find({
    collection: "news",
    ...publishedFilter(false),
    sort: "-publishedAt",
    limit: 1000,
    depth: 1,
    overrideAccess: false,
  });
  const { docs: articles } = await payload.find({
    collection: "articles",
    ...publishedFilter(false),
    sort: "-publishedAt",
    limit: 1000,
    depth: 0,
    overrideAccess: false,
  });
  const { docs: authors } = await payload.find({
    collection: "authors",
    ...publishedFilter(false),
    sort: "name",
    limit: 1000,
    depth: 0,
    overrideAccess: false,
  });

  const legal = await payload.findGlobal({
    slug: "legal-documents",
    depth: 0,
    overrideAccess: false,
  });

  const body = [
    "# WagerBlogs",
    "",
    "> Independent betting and casino review publication. Operators are scored against",
    "> published criteria by a named reviewer, re-verified on a schedule, and commission",
    "> never affects a score or a ranking position.",
    "",
    "This site is a pre-launch scaffold. Copy inside square brackets is placeholder text",
    "awaiting real records — treat any bracketed value as absent, not as fact. Ratings,",
    "dates and bylines are not yet real and are excluded from structured data.",
    "",
    section("Trust and methodology", [
      link("/about", "About", "who publishes this, the editorial remit, and how it earns"),
      link(
        "/about#how-we-review",
        "How we review",
        "the four-step methodology every operator goes through",
      ),
      link("/faq", "FAQ", "how reviews are produced, how the site earns, how corrections work"),
      link(
        "/legal/affiliate-disclosure",
        "Affiliate disclosure",
        "which links pay us and how that is separated from editorial",
      ),
      link(
        "/responsible-gambling",
        "Responsible gambling",
        "warning signs, a self-check, limits, and where to get help",
      ),
    ]),
    section("Reviews", [
      ...verticals
        .filter((vertical) => vertical.hasReviews)
        .map((vertical) =>
          link(
            reviewIndexUrl(vertical),
            `${vertical.name} reviews`,
            `every ${vertical.noun} reviewed on the same criteria`,
          ),
        ),
      ...[...reviews].sort(byKey(verticalName)).flatMap((review) => {
        const path = reviewUrl(review);
        return path ? [link(path, `${review.name} review`, review.seo?.metaDescription)] : [];
      }),
    ]),
    section("News", [
      link("/news", "News index", "every section of the newsroom"),
      ...newsSections.map((newsSection) =>
        link(
          sectionUrl(newsSection),
          `${newsSection.name} news`,
          `${newsSection.name.toLowerCase()} coverage`,
        ),
      ),
      ...[...stories].sort(byKey(sectionName)).flatMap((story) => {
        const path = newsUrl(story);
        return path ? [link(path, story.title, story.excerpt)] : [];
      }),
    ]),
    section("Guides", [
      link("/articles", "Articles", "explainers and strategy"),
      ...articles.map((article) => link(articleUrl(article), article.title, article.excerpt)),
    ]),
    section("Categories", [
      link("/categories", "All categories", "the betting verticals covered"),
      ...verticals.map((vertical) =>
        link(categoryUrl(vertical), vertical.name, vertical.description),
      ),
    ]),
    section("Authors", [
      link("/authors", "All authors", "who writes and reviews here, and what qualifies them"),
      ...authors.map((author) => link(authorUrl(author), author.name, author.credentialLine)),
    ]),
    section(
      "Legal",
      (legal.documents ?? []).map((doc) => link(legalUrl(doc), doc.title, doc.summary)),
    ),
  ].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
