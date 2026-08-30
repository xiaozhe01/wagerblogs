import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AnchorList from "@/components/rail/AnchorList";
import ArrowLink from "@/components/ui/ArrowLink";
import ChipList from "@/components/ui/ChipList";
import PostRow from "@/components/cards/PostRow";
import TeaserCardGrid from "@/components/cards/TeaserCardGrid";
import TeaserCardBody from "@/components/cards/TeaserCardBody";
import EditorialSection from "@/components/section/EditorialSection";
import SearchInput from "@/components/rail/SearchInput";
import {
  sampleCategoryName,
  categoryArticles,
  categorySubCategories,
  categoryCompareLinks,
} from "@/lib/mock-data";
import { ALL_TYPES, TYPE_PARAM, categories, categoryFilters } from "@/lib/site-data";
import { chipHref, chipMatches, resolveChip } from "@/lib/utils";

// TODO(cms): replace with generateStaticParams() from the CMS taxonomy; sampleCategoryName
// and all counts/lists below are static placeholders for one sample category.
export const metadata: Metadata = {
  title: `${sampleCategoryName} — WagerBlogs`,
};

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
      <section className="card" aria-labelledby="rail-all-categories">
        <h2 id="rail-all-categories" className="heading text-sm mb-2.5">
          All categories
        </h2>
        <AnchorList
          items={categories.map((c) => ({
            href: "/categories/sample",
            label: c.name,
            key: c.name,
            current: c.name.toLowerCase() === sampleCategoryName.toLowerCase(),
          }))}
        />
      </section>
    </>
  );

  return (
    <PageShell activeNavId="categories" register="editorial" rail={rail}>
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
        <p className="flex gap-4 flex-wrap text-xs text-text-subtle tabular-nums">
          <span>[n] guides</span>
          <span>[n] reviews</span>
          <span>Updated [Jul 24, 2026]</span>
        </p>
      </header>

      <article aria-labelledby="editors-lead">
        <Link
          href="/blog/sample-post"
          className="flex flex-col md:flex-row gap-3.5 md:gap-4 items-stretch md:items-center no-underline border-t border-b border-border-divider py-4 md:py-5"
        >
          <div
            aria-hidden="true"
            className="w-full md:w-80 h-45 md:h-50 shrink-0 rounded-md placeholder-asset text-2xs text-text-subtle tabular-nums text-center"
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
            <p className="text-xs font-medium text-text-subtle tabular-nums">
              <time dateTime="2026-07-22">07/22/2026</time> · 11 min · byline required before
              publish
            </p>
          </div>
        </Link>
      </article>

      <EditorialSection
        title={`Latest in ${sampleCategoryName}`}
        register="editorial"
        toolbar={
          <nav aria-label="Filter by article type">
            <ul role="list" className="flex gap-2 flex-wrap">
              <ChipList
                as="Link"
                inList
                filter
                items={categoryFilters.map((f) => ({
                  label: f,
                  key: f,
                  href: chipHref({
                    basePath: `/categories/${slug}`,
                    param: TYPE_PARAM,
                    value: f,
                    allValue: ALL_TYPES,
                  }),
                  active: f === activeType,
                }))}
                activeClassName="btn-primary"
                inactiveClassName="btn-secondary"
              />
            </ul>
          </nav>
        }
      >
        {/* Keyed so only the feed replays the fade. */}
        <div key={activeType} className="route-transition">
          {visibleArticles.length === 0 ? (
            <p className="text-sm font-medium text-text-meta leading-relaxed">
              No {activeType.toLowerCase()} filed under {sampleCategoryName} yet.
            </p>
          ) : (
            <ul role="list" className="flex flex-col gap-3">
              {visibleArticles.map((a) => (
                <li key={a.title}>
                  <PostRow post={a} />
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* TODO(cms): pagination returns when a category has real volume and
            per-page routing. The placeholder pointed every page at one href,
            so "2" and "Next" navigated to a different category. */}
        <ArrowLink
          href="/news"
          className="inline-flex items-center self-center gap-1 text-md text-text-primary font-semibold group w-fit"
        >
          All coverage
        </ArrowLink>
      </EditorialSection>

      <EditorialSection title={`Browse ${sampleCategoryName} by Title`} register="editorial">
        <ul
          role="list"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-legacy-4 md:gap-3"
        >
          {/* TODO(cms): href is a placeholder until sub-category routes exist —
              same stand-in the "All categories" grid uses. */}
          {categorySubCategories.map((s) => (
            <li key={s.name}>
              <Link href="/categories/sample" className="editorial-link-card min-h-11 lg:min-h-0">
                <TeaserCardBody title={s.name} desc={s.count} />
              </Link>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <EditorialSection title="Compare operators in this category" register="editorial">
        <TeaserCardGrid
          items={categoryCompareLinks}
          titleClassName="text-md font-semibold text-text-primary mb-1.5 leading-snug"
        />
      </EditorialSection>

      {/* TODO(cms): SourcedStat[] — category market data needs a real source + period
          per figure, or the strip stays absent. Omitted here. */}
    </PageShell>
  );
}
