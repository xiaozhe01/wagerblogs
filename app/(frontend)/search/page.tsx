import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PageNav from "@/components/controls/PageNav";
import FilterChips from "@/components/controls/FilterChips";
import InfoCard from "@/components/rail/InfoCard";
import AnchorList from "@/components/rail/AnchorList";
import EditorialSection from "@/components/section/EditorialSection";
import EmptyState from "@/components/section/EmptyState";
import SearchResultList from "@/components/section/SearchResultList";
import { PAGE_PARAM, pageHref, paginate } from "@/lib/pagination";
import {
  MAX_QUERY,
  SCOPE_PARAM,
  SEARCH_PARAM,
  resolveScope,
  search,
  searchScopes,
  type SearchScope,
} from "@/lib/search";
import { headingId } from "@/lib/utils";
import { buildOpenGraph } from "@/lib/og";

// noindex: thin, duplicative and infinitely variable by query. Absent from the
// sitemap and llms.txt for the same reason.
const TITLE = "Search — WagerBlogs";
const DESCRIPTION = "Search WagerBlogs reviews, news, guides and trust pages.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // OG tags still matter on a noindex route: social scrapers do not honour
  // robots, so a pasted /search link renders a card either way.
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION, path: "/search" }),
  robots: { index: false, follow: true },
};

const RESULTS_ANCHOR = headingId("section", "Results");
const RESULTS_PER_PAGE = 10;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const raw = params[SEARCH_PARAM];
  const query = (Array.isArray(raw) ? raw[0] : (raw ?? "")).slice(0, MAX_QUERY);
  const scope = resolveScope(params[SCOPE_PARAM]);
  // Searched once, then split: the chips need every scope's count, and a chip
  // leading to a blank page is a trap rather than a filter.
  const allHits = await search(query, "all");
  const hits = scope === "all" ? allHits : allHits.filter((hit) => hit.scope === scope);
  const counts = allHits.reduce<Partial<Record<SearchScope, number>>>((acc, hit) => {
    acc[hit.scope] = (acc[hit.scope] ?? 0) + 1;
    return acc;
  }, {});
  const scopeLabel = searchScopes[scope].toLowerCase();
  const results = paginate(hits, params[PAGE_PARAM], RESULTS_PER_PAGE);

  const rail = (
    <>
      <InfoCard
        title="Not finding it?"
        body="Tell us what you were looking for and we'll point you at it, or write it."
        cta={{ href: "/contact", label: "Contact us" }}
      />
      <AnchorList
        title="Start here"
        cardClassName="card"
        items={[
          { href: "/reviews", label: "All reviews", key: "reviews" },
          { href: "/news", label: "Newsroom", key: "news" },
          { href: "/articles", label: "Guides", key: "articles" },
          { href: "/faq", label: "FAQ", key: "faq" },
        ]}
      />
    </>
  );

  return (
    <PageShell activeNavId="more" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — no operator links on a results page */}
      <Breadcrumbs items={[{ label: "Search" }]} />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          {query ? `Results for “${query}”` : "Search"}
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          {query
            ? scope === "all"
              ? `${hits.length} ${hits.length === 1 ? "result" : "results"} across reviews, news, guides and trust pages.`
              : `${hits.length} ${hits.length === 1 ? "result" : "results"} in ${scopeLabel}, of ${allHits.length} in total.`
            : "Search reviews, news, guides and the pages that explain how we work."}
        </p>
      </header>

      <EditorialSection
        id={RESULTS_ANCHOR}
        title="Results"
        register="editorial"
        tier="supporting"
        toolbar={
          query ? (
            <FilterChips
              label="Filter results by section"
              items={(Object.keys(searchScopes) as SearchScope[])
                .filter((key) => key === "all" || key === scope || (counts[key] ?? 0) > 0)
                .map((key) => ({
                  key,
                  label: `${searchScopes[key]} ${key === "all" ? allHits.length : (counts[key] ?? 0)}`,
                  active: key === scope,
                  href:
                    key === "all"
                      ? `/search?${SEARCH_PARAM}=${encodeURIComponent(query)}`
                      : `/search?${SEARCH_PARAM}=${encodeURIComponent(query)}&${SCOPE_PARAM}=${key}`,
                }))}
            />
          ) : undefined
        }
      >
        {!query ? (
          <EmptyState
            title="Type something to search"
            body="Try an operator name, a sport, or a question about how we review."
          />
        ) : results.items.length === 0 ? (
          // Name the filter that emptied the page, not the query — it matched
          // elsewhere — and offer the way out.
          scope !== "all" && allHits.length > 0 ? (
            <EmptyState
              title={`No ${scopeLabel} results for “${query}”`}
              body={`There ${allHits.length === 1 ? "is 1 result" : `are ${allHits.length} results`} in other sections.`}
              action={{
                href: `/search?${SEARCH_PARAM}=${encodeURIComponent(query)}`,
                label: "Search everything",
              }}
            />
          ) : (
            <EmptyState
              title={`Nothing matched “${query}”`}
              body="Check the spelling, try a broader term, or browse the sections in the rail."
              action={{ href: "/news", label: "Browse the newsroom" }}
            />
          )
        ) : (
          <SearchResultList hits={results.items} scope={scope} />
        )}
      </EditorialSection>

      <PageNav
        page={results.page}
        totalPages={results.totalPages}
        total={results.total}
        from={results.from}
        to={results.to}
        noun="results"
        label="Search results"
        hrefFor={(n) =>
          pageHref({
            basePath: "/search",
            page: n,
            params: {
              [SEARCH_PARAM]: query,
              [SCOPE_PARAM]: scope === "all" ? undefined : scope,
            },
            anchor: RESULTS_ANCHOR,
          })
        }
      />
    </PageShell>
  );
}
