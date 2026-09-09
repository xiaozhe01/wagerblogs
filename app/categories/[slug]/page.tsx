import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AnchorList from "@/components/rail/AnchorList";
import FilterChips from "@/components/controls/FilterChips";
import PostRow from "@/components/cards/PostRow";
import TeaserCardGrid from "@/components/cards/TeaserCardGrid";
import EditorialSection from "@/components/section/EditorialSection";
import EmptyState from "@/components/section/EmptyState";
import SearchInput from "@/components/rail/SearchInput";
import InfoCard from "@/components/rail/InfoCard";
import { notFound } from "next/navigation";
import { categoryArticles, categoryCompareLinks } from "@/lib/mock-data";
import { ALL_TYPES, TYPE_PARAM, categoryFilters } from "@/lib/site-data";
import { categories, categoryParams, findCategory } from "@/lib/categories";
import { chipHref, chipMatches, chipSlug, headingId, resolveChip } from "@/lib/utils";
import { PAGE_PARAM, pageHref, paginate } from "@/lib/pagination";
import PageNav from "@/components/controls/PageNav";

export function generateStaticParams() {
  return categoryParams;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategory(slug);
  if (!category) return { title: "Categories — WagerBlogs" };
  return {
    title: `${category.name} — WagerBlogs`,
    description: category.desc,
    alternates: { canonical: category.href },
  };
}

// TODO(cms): the article lists, sub-categories and counts below are shared
// placeholders; only the category record itself resolves per slug today.
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const category = findCategory(slug);
  // A vertical we don't cover is a genuine 404, not another category's page.
  if (!category) notFound();
  const query = await searchParams;
  const activeType = resolveChip(categoryFilters, query[TYPE_PARAM], ALL_TYPES);
  const typeHref = (value: string) =>
    chipHref({
      basePath: `/categories/${slug}`,
      param: TYPE_PARAM,
      value,
      allValue: ALL_TYPES,
    });
  const matchingArticles =
    activeType === ALL_TYPES
      ? categoryArticles
      : categoryArticles.filter((a) => chipMatches(a.kicker ?? "", activeType));
  // Changing the chip drops the page param, so a filter always opens on page 1.
  const articlePage = paginate(matchingArticles, query[PAGE_PARAM]);
  const visibleArticles = articlePage.items;
  // Counted off what this page actually lists; the review tally has no data
  // behind it yet, so it stays bracketed.
  const guideCount = categoryArticles.filter((a) => chipMatches(a.kicker ?? "", "Guides")).length;

  const rail = (
    <>
      <SearchInput placeholder={`Search within ${category.name}...`} />
      <section className="card" aria-labelledby="rail-all-categories">
        <h2 id="rail-all-categories" className="heading text-sm mb-2.5">
          All categories
        </h2>
        <AnchorList
          items={categories.map((c) => ({
            href: c.href,
            label: c.name,
            key: c.slug,
            current: c.slug === category.slug,
          }))}
        />
      </section>
      <InfoCard
        title="Editorial standards"
        body="How we research, source, and correct our category coverage."
        cta={{ href: "/about", label: "Read our methodology" }}
      />
    </>
  );

  return (
    <PageShell activeNavId="categories" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — category navigation, no outbound operator links */}
      <Breadcrumbs
        currentPath={category.href}
        items={[{ label: "Categories", href: "/categories" }, { label: category.name }]}
      />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          {category.name}
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder category standfirst — what this vertical covers, who it&apos;s for, and how
          our coverage is organised. Editorial register: this page navigates and explains; it never
          sells.]
        </p>
        <p className="flex gap-4 flex-wrap text-xs text-text-muted tabular-nums">
          <span>
            {guideCount} {guideCount === 1 ? "guide" : "guides"}
          </span>
          <span>[n] reviews</span>
          <span>Updated [Jul 24, 2026]</span>
        </p>
      </header>

      <article aria-labelledby="editors-lead">
        <Link
          href="/blog/how-odds-boosts-actually-work"
          className="flex flex-col md:flex-row gap-3.5 md:gap-4 items-stretch md:items-center no-underline border-t border-b border-border-divider py-4 md:py-5"
        >
          <div
            aria-hidden="true"
            className="w-full md:w-80 h-45 md:h-50 shrink-0 rounded-md placeholder-asset text-2xs text-text-muted tabular-nums text-center"
          >
            [lead image — credit line required]
          </div>
          <div className="min-w-0 flex flex-col gap-2">
            <p className="meta-label-caps">Editor&apos;s lead</p>
            <h2 id="editors-lead" className="heading text-4xl leading-heading text-pretty">
              {`[Placeholder] The state of ${category.name} going into the autumn season`}
            </h2>
            <p className="text-lg leading-copy text-text-muted text-pretty">
              [Placeholder excerpt — two lines summarising the piece, written to work as a
              standalone summary in search and social previews.]
            </p>
            <p className="text-xs font-medium text-text-muted tabular-nums">
              <time dateTime="2026-07-22">07/22/2026</time> · 11 min · byline required before
              publish
            </p>
          </div>
        </Link>
      </article>

      <EditorialSection
        title={`Latest in ${category.name}`}
        register="editorial"
        toolbar={
          <FilterChips
            label="Filter by article type"
            items={categoryFilters.map((f) => ({
              label: f,
              key: f,
              href: typeHref(f),
              active: f === activeType,
            }))}
          />
        }
      >
        {/* Keyed so only the feed replays the fade. */}
        <div key={activeType} className="route-transition">
          {visibleArticles.length === 0 ? (
            <EmptyState
              title={`No ${activeType.toLowerCase()} filed under ${category.name} yet`}
              action={{ href: typeHref(ALL_TYPES), label: "Show all" }}
            />
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
        <PageNav
          page={articlePage.page}
          totalPages={articlePage.totalPages}
          label={`Latest in ${category.name}`}
          hrefFor={(n) =>
            pageHref({
              basePath: `/categories/${slug}`,
              page: n,
              params: {
                [TYPE_PARAM]: activeType === ALL_TYPES ? undefined : chipSlug(activeType),
              },
              anchor: headingId("section", `Latest in ${category.name}`),
            })
          }
        />
      </EditorialSection>

      {/* TODO(cms): a "browse by title" grid returns when sub-categories carry
          their own collections and routes — six tiles that navigate nowhere and
          count nothing are worse than no section. */}
      <EditorialSection title="Compare operators in this category" register="editorial">
        <TeaserCardGrid
          items={categoryCompareLinks}
          titleClassName="text-lg font-semibold text-text-primary mb-1.5 leading-snug"
        />
      </EditorialSection>

      {/* TODO(cms): SourcedStat[] — category market data needs a real source + period
          per figure, or the strip stays absent. Omitted here. */}
    </PageShell>
  );
}
