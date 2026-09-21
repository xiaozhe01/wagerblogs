import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import InfoCard from "@/components/rail/InfoCard";
import LinkTileGrid from "@/components/cards/LinkTileGrid";
import EditorialSection from "@/components/section/EditorialSection";
import EmptyState from "@/components/section/EmptyState";
import RecentPublishedSection from "@/components/section/RecentPublishedSection";
import { getPayload } from "payload";
import config from "@payload-config";
import { draftMode } from "next/headers";
import { publishedFilter } from "@/lib/payload-queries";
import { articleRow } from "@/lib/article-rows";

// ISR. Draft mode coexists with this: the __prerender_bypass cookie makes Next
// skip the cache for that request only, so a preview never serves a stale page
// and an ordinary visitor still gets the cached one.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Betting Categories — WagerBlogs",
  description: "Browse every betting and casino vertical WagerBlogs covers.",
  alternates: { canonical: "/categories" },
};

// Minimal categories index — every vertical as a card. Individual category
// pages live at /categories/[slug].
export default async function CategoriesIndexPage() {
  const { isEnabled: isDraft } = await draftMode();
  const payload = await getPayload({ config });
  // Verticals is structural taxonomy: no drafts, so no _status filter.
  const { docs: verticals } = await payload.find({
    collection: "verticals",
    sort: "order",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });

  // articles filters _status — editorial. depth 1 resolves the author byline.
  const { docs: recent } = await payload.find({
    collection: "articles",
    ...publishedFilter(isDraft),
    sort: "-publishedAt",
    limit: 3,
    depth: 1,
    overrideAccess: false,
  });

  const rail = (
    <>
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
      <Breadcrumbs items={[{ label: "Categories" }]} />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Betting categories
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder standfirst — every vertical WagerBlogs covers, and how coverage is
          organized.]
        </p>
      </header>

      <EditorialSection title="All categories" register="editorial">
        {verticals.length === 0 ? (
          <EmptyState
            title="No categories published yet"
            body="Verticals appear here as soon as the taxonomy is populated."
          />
        ) : (
          <LinkTileGrid
            items={verticals.map((vertical) => ({
              href: `/categories/${vertical.slug}`,
              title: vertical.name,
              desc: vertical.description,
              key: vertical.slug,
            }))}
          />
        )}
      </EditorialSection>

      <RecentPublishedSection register="editorial" posts={recent.map(articleRow)} />
    </PageShell>
  );
}
