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
import { publishedFilter, resolvePreviewUser } from "@/lib/payload-queries";
import { articleRow } from "@/lib/article-rows";
import { buildOpenGraph } from "@/lib/og";
import PageNav from "@/components/controls/PageNav";
import { PAGE_PARAM, TILE_PAGE_SIZE, pageHref, paginate } from "@/lib/pagination";
import { headingId } from "@/lib/utils";

// No `revalidate`: this route reads searchParams for the page number, so Next
// renders it per request and the ISR window would never apply.

const SECTION_TITLE = "All categories";
const TITLE = "Betting Categories — WagerBlogs";
const DESCRIPTION = "Browse every betting and casino vertical WagerBlogs covers.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION, path: "/categories" }),
  alternates: { canonical: "/categories" },
};

// Minimal categories index — every vertical as a card. Individual category
// pages live at /categories/[slug].
export default async function CategoriesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const { isEnabled: isDraft } = await draftMode();
  const previewUser = isDraft ? await resolvePreviewUser() : null;
  const payload = await getPayload({ config });
  // Verticals is structural taxonomy: no drafts, so no _status filter.
  const { docs: verticals } = await payload.find({
    collection: "verticals",
    sort: "order",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });

  const categoryPage = paginate(verticals, query[PAGE_PARAM], TILE_PAGE_SIZE);

  // articles filters _status — editorial. depth 1 resolves the author byline.
  const { docs: recent } = await payload.find({
    collection: "articles",
    ...publishedFilter(isDraft, {}, previewUser),
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
          Every market we cover. Each category collects the reviews, guides and reporting on one
          subject, so you can start from what interests you instead of a ranking.
        </p>
      </header>

      <EditorialSection title={SECTION_TITLE} register="editorial">
        {categoryPage.total === 0 ? (
          <EmptyState
            title="No categories published yet"
            body="Verticals appear here as soon as the taxonomy is populated."
          />
        ) : (
          <>
            <LinkTileGrid
              items={categoryPage.items.map((vertical) => ({
                href: `/categories/${vertical.slug}`,
                title: vertical.name,
                desc: vertical.description,
                key: vertical.slug,
              }))}
            />
            <PageNav
              page={categoryPage.page}
              totalPages={categoryPage.totalPages}
              total={categoryPage.total}
              from={categoryPage.from}
              to={categoryPage.to}
              noun="categories"
              label={SECTION_TITLE}
              hrefFor={(n) =>
                pageHref({
                  basePath: "/categories",
                  page: n,
                  anchor: headingId("section", SECTION_TITLE),
                })
              }
            />
          </>
        )}
      </EditorialSection>

      <RecentPublishedSection register="editorial" posts={recent.map(articleRow)} />
    </PageShell>
  );
}
