import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AnchorList from "@/components/rail/AnchorList";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import ArrowLink from "@/components/ui/ArrowLink";
import ChipList from "@/components/ui/ChipList";
import PostRow from "@/components/cards/PostRow";
import TeaserCardGrid from "@/components/cards/TeaserCardGrid";
import SearchInput from "@/components/rail/SearchInput";
import {
  sampleCategoryName,
  categoryArticles,
  categorySubCategories,
  categoryCompareLinks,
} from "@/lib/mock-data";
import { categories, categoryFilters } from "@/lib/site-data";
import { chipHref, chipMatches, resolveChip } from "@/lib/utils";

// TODO(cms): replace with generateStaticParams() from the CMS taxonomy; sampleCategoryName
// and all counts/lists below are static placeholders for one sample category.
export const metadata: Metadata = {
  title: `${sampleCategoryName} — WagerBlogs`,
};

const TYPE_PARAM = "type";
const ALL_TYPES = "All";
const FEED_ANCHOR = "latest-in-category";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const activeType = resolveChip(categoryFilters, query[TYPE_PARAM], ALL_TYPES);
  const visibleArticles =
    activeType === ALL_TYPES
      ? categoryArticles
      : categoryArticles.filter((a) => chipMatches(a.kicker, activeType));
  const rail = (
    <>
      <SearchInput placeholder={`Search within ${sampleCategoryName}...`} />
      <section className="card pb-0" aria-labelledby="rail-all-categories">
        <h2 id="rail-all-categories" className="font-bold text-sm text-text-primary mb-2.5">
          All categories
        </h2>
        <AnchorList
          items={categories.map((c) => ({
            href: "/categories/sample",
            label: c.name,
            key: c.name,
          }))}
          itemClassName={(item) =>
            `flex items-center min-h-11 lg:min-h-9.5 text-sm no-underline border-b border-border-hairline-alt [li:last-child_&]:border-b-0 leading-snug ${typeof item.label === "string" && item.label.toLowerCase() === sampleCategoryName.toLowerCase() ? "text-text-primary font-bold" : "text-text-body"}`
          }
        />
      </section>
    </>
  );

  return (
    <PageShell activeNavId="categories" rail={rail}>
      {/* Register: Editorial · Tier 1 — category navigation, no outbound operator links */}
      <Breadcrumbs
        items={[{ label: "Categories", href: "/categories" }, { label: sampleCategoryName }]}
      />

      <header className="flex flex-col gap-3">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          {sampleCategoryName}
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder category standfirst — what this vertical covers, who it&apos;s for, and how
          our coverage is organised. Editorial register: this page navigates and explains; it never
          sells.]
        </p>
        <p className="flex gap-4 flex-wrap text-xs text-text-subtle font-mono">
          <span>[n] guides</span>
          <span>[n] reviews</span>
          <span>Updated [Jul 24, 2026]</span>
        </p>
      </header>

      <nav aria-label="Filter by article type">
        <ul role="list" className="flex gap-2 flex-wrap">
          <ChipList
            as="Link"
            inList
            items={categoryFilters.map((f) => ({
              label: f,
              key: f,
              href: chipHref({
                basePath: `/categories/${slug}`,
                param: TYPE_PARAM,
                value: f,
                allValue: ALL_TYPES,
                anchor: FEED_ANCHOR,
              }),
              active: f === activeType,
            }))}
            activeClassName="btn-primary"
            inactiveClassName="btn-secondary"
          />
        </ul>
      </nav>

      <article aria-labelledby="editors-lead">
        <Link
          href="/blog/sample-post"
          className="flex flex-col md:flex-row gap-3.5 md:gap-4 items-stretch md:items-center no-underline border-t border-b border-border-divider py-4 md:py-5"
        >
          <div
            aria-hidden="true"
            className="w-full md:w-80 h-45 md:h-50 shrink-0 rounded-md placeholder-asset text-2xs text-text-subtle font-mono text-center"
          >
            [lead image — credit line required]
          </div>
          <div className="min-w-0 flex flex-col gap-2">
            <p className="meta-label-caps">Editor&apos;s lead</p>
            <h2 id="editors-lead" className="heading text-4xl leading-heading text-pretty">
              [Placeholder] The state of esports betting going into the autumn season
            </h2>
            <p className="text-lg leading-copy text-text-meta text-pretty">
              [Placeholder excerpt — two lines summarising the piece, written to work as a
              standalone summary in search and social previews.]
            </p>
            <p className="text-xs font-medium text-text-subtle font-mono">
              <time dateTime="2026-07-22">07/22/2026</time> · 11 min · byline required before
              publish
            </p>
          </div>
        </Link>
      </article>

      <section id={FEED_ANCHOR}>
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-3">
          <h2 className="heading text-h2 leading-heading">Latest in {sampleCategoryName}</h2>
          <ArrowLink
            href="/news"
            className="inline-flex items-center gap-1 text-md text-text-primary font-semibold group"
          >
            All coverage
          </ArrowLink>
        </div>
        {visibleArticles.length === 0 ? (
          <p className="text-sm text-text-meta leading-relaxed">
            No {activeType.toLowerCase()} filed under {sampleCategoryName} yet.
          </p>
        ) : (
          <ul role="list" className="flex flex-col">
            {visibleArticles.map((a) => (
              <li key={a.title}>
                <PostRow post={a} />
              </li>
            ))}
          </ul>
        )}
        <Pagination className="justify-start mx-0 mt-5">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="/categories/sample" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/categories/sample">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/categories/sample">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="/categories/sample" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>

      <section>
        <h2 className="heading text-h2 leading-heading mb-3">
          Browse {sampleCategoryName} by title
        </h2>
        <ul
          role="list"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-legacy-4 md:gap-3"
        >
          {categorySubCategories.map((s) => (
            <li key={s.name} className="editorial-link-card">
              <h3 className="font-semibold text-md text-text-primary mb-1.5">{s.name}</h3>
              <p className="text-xs text-text-meta leading-relaxed">{s.count}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="heading text-h2 leading-heading mb-3">Compare operators in this category</h2>
        <TeaserCardGrid
          items={categoryCompareLinks}
          titleClassName="text-md font-semibold text-text-primary mb-1.5 leading-snug"
        />
      </section>

      {/* TODO(cms): SourcedStat[] — category market data needs a real source + period
          per figure, or the strip stays absent. Omitted here. */}
    </PageShell>
  );
}
