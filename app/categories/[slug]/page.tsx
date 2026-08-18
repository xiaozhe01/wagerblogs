import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import HelpLineCard from "@/components/rail/HelpLineCard";
import InfoCard from "@/components/rail/InfoCard";
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

// TODO(cms): replace with generateStaticParams() from the CMS taxonomy; sampleCategoryName
// and all counts/lists below are static placeholders for one sample category.
export const metadata: Metadata = { title: `${sampleCategoryName} — WagerBlogs` };

export default function CategoryPage() {
  const rail = (
    <>
      <div className="card">
        <SearchInput placeholder={`Search within ${sampleCategoryName}...`} />
      </div>
      <div className="card">
        <div className="font-bold text-sm text-text-primary mb-2.5">All categories</div>
        <AnchorList
          as="Link"
          items={categories.map((c) => ({
            href: "/categories/sample",
            label: c.name,
            key: c.name,
          }))}
          itemClassName={(item) =>
            `flex items-center min-h-11 lg:min-h-8 text-sm no-underline border-b border-border-hairline-alt leading-snug ${typeof item.label === "string" && item.label.toLowerCase() === sampleCategoryName.toLowerCase() ? "text-text-primary font-bold" : "text-text-body"}`
          }
        />
      </div>
      <InfoCard
        title="Editorial standards"
        body="How we research, source, and correct our category coverage."
        cta={
          <ArrowLink
            href="/about"
            className="inline-flex items-center gap-1 text-md text-text-primary font-semibold group"
          >
            Read our methodology
          </ArrowLink>
        }
      />
      <HelpLineCard />
    </>
  );

  return (
    <PageShell activeNavId="categories" rail={rail}>
      {/* Register: Editorial · Tier 1 — category navigation, no outbound operator links */}
      <Breadcrumbs
        items={[{ label: "Categories", href: "/categories" }, { label: sampleCategoryName }]}
      />

      <header className="flex flex-col gap-3 max-w-160">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          {sampleCategoryName}
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder category standfirst — what this vertical covers, who it&apos;s for, and how
          our coverage is organised. Editorial register: this page navigates and explains; it never
          sells.]
        </p>
        <div className="flex gap-4 flex-wrap text-xs text-text-subtle font-mono">
          <div>[n] guides</div>
          <div>[n] reviews</div>
          <div>Updated [Jul 24, 2026]</div>
        </div>
      </header>

      {/* Browse by States */}
      <nav className="flex gap-2 flex-wrap">
        <ChipList
          as="button"
          items={categoryFilters.map((f, i) => ({ label: f, active: i === 0 }))}
          activeClassName="btn-primary"
          inactiveClassName="btn-secondary"
        />
      </nav>

      <section>
        <Link
          href="/blog/sample-post"
          className="flex flex-col wide:flex-row gap-3.5 wide:gap-6 items-stretch wide:items-center no-underline border-t border-b border-border-divider py-4 wide:py-6"
        >
          <div className="w-full wide:w-[320px] h-45 wide:h-50 shrink-0 rounded-md placeholder-asset text-2xs text-text-subtle font-mono text-center">
            [lead image — credit line required]
          </div>
          <div className="min-w-0 flex flex-col gap-2">
            <div className="meta-label-caps">Editor&apos;s lead</div>
            <div className="heading text-4xl leading-heading text-pretty">
              [Placeholder] The state of esports betting going into the autumn season
            </div>
            <div className="text-lg leading-copy text-text-meta text-pretty">
              [Placeholder excerpt — two lines summarising the piece, written to work as a
              standalone summary in search and social previews.]
            </div>
            <div className="text-xs text-text-subtle font-mono">
              07/22/2026 · 11 min · byline required before publish
            </div>
          </div>
        </Link>
      </section>

      <section>
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-3">
          <h2 className="heading text-h2 leading-heading">Latest in {sampleCategoryName}</h2>
          <ArrowLink
            href="/news"
            className="inline-flex items-center gap-1 text-md text-text-primary font-semibold group"
          >
            All coverage
          </ArrowLink>
        </div>
        <div className="flex flex-col">
          {categoryArticles.map((a) => (
            <PostRow
              key={a.title}
              post={a}
              wrapperClassName="flex gap-4 items-start justify-between py-4 border-b border-border-hairline no-underline"
              titleClassName="heading text-xl leading-snug mb-1.5 text-pretty"
              thumbnailClassName="w-18 h-13.5 lg:w-24 lg:h-17 shrink-0 rounded-sm placeholder-asset text-2xs text-text-subtle font-mono"
            />
          ))}
        </div>
        <Pagination className="justify-start mx-0 mt-5">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="/categories/sample" isActive className="rounded-sm">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/categories/sample" className="rounded-sm">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/categories/sample" className="rounded-sm">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="/categories/sample" className="rounded-sm" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>

      <section>
        <h2 className="heading text-h2 leading-heading mb-3">
          Browse {sampleCategoryName} by title
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-legacy-4 md:gap-3">
          {categorySubCategories.map((s) => (
            <div key={s.name} className="editorial-link-card">
              <div className="font-semibold text-md text-text-primary mb-1.5">{s.name}</div>
              <div className="text-xs text-text-meta leading-relaxed">{s.count}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="heading text-h2 leading-heading mb-3">Compare operators in this category</h2>
        <TeaserCardGrid
          items={categoryCompareLinks}
          titleClassName="text-sm font-bold text-text-primary mb-1 leading-snug"
        />
      </section>

      {/* TODO(cms): SourcedStat[] — category market data needs a real source + period
          per figure, or the strip stays absent. Omitted here. */}

      <section>
        <h2 className="heading text-h2 leading-heading mb-3">About this coverage</h2>
        <p className="text-2xl font-medium leading-copy text-text-body max-w-160 mb-2 text-pretty">
          [Placeholder about-this-category copy — how often the vertical is reviewed, who writes it,
          and what falls outside its scope. Two or three sentences; this is the block search engines
          read as the category&apos;s descriptive text.]
        </p>
        <ArrowLink
          href="/about"
          className="inline-flex items-center gap-1 min-h-11 text-md text-text-primary font-semibold group"
        >
          Read our editorial standards
        </ArrowLink>
      </section>
    </PageShell>
  );
}
