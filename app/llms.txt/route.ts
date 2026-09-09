import { siteUrl } from "@/lib/schema";
import { newsSections } from "@/lib/news";
import { reviewGroups } from "@/lib/reviews";
import { categories } from "@/lib/categories";
import { blogPosts } from "@/lib/blog";
import { legalDocs } from "@/lib/mock-data";

// llmstxt.org convention: a markdown site map for language models. A proposed
// convention, not a standard. A route handler rather than a static
// public/llms.txt so it reads the same registries and cannot list a dead URL.
export const dynamic = "force-static";

function section(heading: string, lines: string[]) {
  return lines.length ? `## ${heading}\n\n${lines.join("\n")}\n` : "";
}

const link = (path: string, label: string, note: string) =>
  `- [${label}](${siteUrl}${path}): ${note}`;

export function GET() {
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
      ...reviewGroups.map((g) =>
        link(g.href, g.title, `every ${g.noun} reviewed on the same criteria`),
      ),
      ...reviewGroups.flatMap((g) =>
        g.operators.map((o) =>
          link(`${g.href}/${o.slug}`, `${o.name} review`, `tested ${g.noun} review`),
        ),
      ),
    ]),
    section("News", [
      link("/news", "News index", "every section of the newsroom"),
      ...newsSections.map((s) =>
        link(s.href, `${s.category} news`, `${s.category.toLowerCase()} coverage`),
      ),
    ]),
    section("Guides", [
      link("/blog", "Blog", "explainers and strategy"),
      ...blogPosts.map((p) => link(p.href, p.title, p.kicker)),
    ]),
    section("Categories", [
      link("/categories", "All categories", "the betting verticals covered"),
      ...categories.map((c) => link(c.href, c.name, c.desc)),
    ]),
    section(
      "Legal",
      Object.entries(legalDocs).map(([slug, d]) =>
        link(`/legal/${slug}`, d.title, "binding policy text"),
      ),
    ),
  ].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
