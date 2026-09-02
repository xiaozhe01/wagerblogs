import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PostRow from "@/components/cards/PostRow";
import AnchorList from "@/components/rail/AnchorList";
import HelpLineCard from "@/components/rail/HelpLineCard";
import InfoCard from "@/components/rail/InfoCard";
import SearchInput from "@/components/rail/SearchInput";
import ChipList from "@/components/ui/ChipList";
import EditorialSection from "@/components/section/EditorialSection";
import EmptyState from "@/components/section/EmptyState";
import { newsCategories } from "@/lib/site-data";
import { newsFeed } from "@/lib/mock-data";
import { chipHref, chipMatches, resolveChip } from "@/lib/utils";

export const metadata: Metadata = {
  title: "News — WagerBlogs",
  description: "Betting and casino industry news, regulation, and market coverage.",
};

const CATEGORY_PARAM = "category";
const ALL_CATEGORIES = newsCategories[0];

const categoryHref = (category: string) =>
  chipHref({
    basePath: "/news",
    param: CATEGORY_PARAM,
    value: category,
    allValue: ALL_CATEGORIES,
  });

// TODO(cms): replace newsFeed with the CMS news collection, paginated, and give
// each story a real href. Filters read from the same taxonomy the chips render.
export default async function NewsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const activeCategory = resolveChip(newsCategories, query[CATEGORY_PARAM], ALL_CATEGORIES);
  const visibleStories =
    activeCategory === ALL_CATEGORIES
      ? newsFeed
      : newsFeed.filter((n) => chipMatches(n.category, activeCategory));

  const rail = (
    <>
      <SearchInput placeholder="Search news..." />
      <AnchorList
        title="Sections"
        cardClassName="card"
        items={newsCategories.map((c) => ({
          href: categoryHref(c),
          label: c,
          key: c,
          current: c === activeCategory,
        }))}
      />
      <InfoCard
        title="Corrections"
        body="Spotted something wrong? Tell us and we'll fix it."
        cta={{ href: "/contact", label: "Report an issue" }}
      />
      <HelpLineCard />
    </>
  );

  return (
    <PageShell activeNavId="news" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — reporting, no outbound operator links */}
      <Breadcrumbs items={[{ label: "News" }]} />

      <header className="flex flex-col gap-3">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          News
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder standfirst — regulation, market moves, and industry reporting, written to be
          useful whether or not you bet.]
        </p>
      </header>

      {/* Chips and the feed they filter are one unit. */}
      <section aria-label="News stories" className="flex flex-col gap-3">
        <nav aria-label="Filter by section">
          <ul role="list" className="flex gap-2 flex-wrap">
            <ChipList
              as="Link"
              inList
              filter
              items={newsCategories.map((c) => ({
                label: c,
                key: c,
                href: categoryHref(c),
                active: c === activeCategory,
              }))}
              activeClassName="btn-secondary chip-active"
              inactiveClassName="btn-secondary"
            />
          </ul>
        </nav>

        {/* Keyed so only the feed replays the fade. */}
        <div key={activeCategory} className="route-transition">
          {visibleStories.length === 0 ? (
            <EmptyState
              title={`No stories filed under ${activeCategory} yet`}
              action={{ href: categoryHref(ALL_CATEGORIES), label: "Show all news" }}
            />
          ) : (
            <ul role="list" className="flex flex-col gap-3">
              {visibleStories.map((n) => (
                <li key={n.title}>
                  <PostRow post={{ kicker: n.category, title: n.title, meta: n.meta }} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <EditorialSection title="How we report" register="editorial">
        <p className="text-lg font-medium leading-copy text-text-strong-secondary max-w-none text-pretty">
          [Placeholder — sourcing policy: what we verify before publishing, how corrections are
          handled, and why commercial partnerships never affect coverage.]
        </p>
      </EditorialSection>
    </PageShell>
  );
}
