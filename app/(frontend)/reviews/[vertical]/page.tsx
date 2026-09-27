import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { publishedFilter, resolvePreviewUser } from "@/lib/payload-queries";
import { getPayload } from "payload";
import config from "@payload-config";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ReviewsRail from "@/components/rail/ReviewsRail";
import ReviewDirectorySection, {
  type ReviewTile,
} from "@/components/section/ReviewDirectorySection";
import EmptyState from "@/components/section/EmptyState";
import ReviewCard from "@/components/section/ReviewCard";
import { GRID_PAGE_SIZE, PAGE_PARAM, pageHref, paginate } from "@/lib/pagination";
import { formatDate, headingId } from "@/lib/utils";
import { buildOpenGraph } from "@/lib/og";
import PageNav from "@/components/controls/PageNav";

type VerticalParams = { vertical: string };

// ISR. Draft mode coexists with this: the __prerender_bypass cookie makes Next
// skip the cache for that request only, so a preview never serves a stale page
// and an ordinary visitor still gets the cached one.
export const revalidate = 3600;

/** Verticals is structural taxonomy — no drafts, so no _status filter. */
async function findVertical(slug: string) {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "verticals",
    where: { slug: { equals: slug }, hasReviews: { equals: true } },
    limit: 1,
    depth: 0,
    overrideAccess: false,
  });
  return docs[0];
}

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "verticals",
    where: { hasReviews: { equals: true } },
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });
  return docs.map((vertical) => ({ vertical: vertical.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<VerticalParams>;
}): Promise<Metadata> {
  const { vertical: verticalSlug } = await params;
  const vertical = await findVertical(verticalSlug);
  if (!vertical) return { title: "Reviews — WagerBlogs" };
  // Straight from the seo group, placeholders and all. A title composed from
  // vertical.name would hide an unwritten record instead of showing it.
  return {
    title: vertical.seo?.metaTitle,
    description: vertical.seo?.metaDescription,
    openGraph: buildOpenGraph({
      title: vertical.seo?.metaTitle,
      description: vertical.seo?.metaDescription,
      ogImage: vertical.seo?.ogImage,
      path: `/reviews/${vertical.slug}`,
    }),
    alternates: { canonical: vertical.seo?.canonicalUrl || `/reviews/${vertical.slug}` },
  };
}

export default async function ReviewGroupPage({
  params,
  searchParams,
}: {
  params: Promise<VerticalParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { vertical: verticalSlug } = await params;
  const query = await searchParams;
  const { isEnabled: isDraft } = await draftMode();
  const previewUser = isDraft ? await resolvePreviewUser() : null;

  const vertical = await findVertical(verticalSlug);
  // A vertical we don't cover, or one that carries no reviews, is a genuine
  // 404 — not an empty directory page.
  if (!vertical) notFound();

  const payload = await getPayload({ config });
  // Reviews is editorial: drafts enabled, so _status is filtered unless the
  // request carries draft mode.
  const { docs: reviews } = await payload.find({
    collection: "reviews",
    ...publishedFilter(isDraft, { vertical: { equals: vertical.id } }, previewUser),
    sort: "-score",
    limit: 500,
    depth: 0,
    overrideAccess: false,
  });

  const tiles: ReviewTile[] = reviews.map((review) => ({
    id: review.id,
    name: review.name,
    score: review.score,
    categoryScores: (review.categoryScores ?? []).map((entry) => ({
      label: entry.label,
      score: entry.score,
    })),
    lastVerified: formatDate(review.lastVerified),
    lastVerifiedISO: review.lastVerified,
    href: `/reviews/${vertical.slug}/${review.slug}`,
  }));

  const href = `/reviews/${vertical.slug}`;
  const sectionTitle = `All ${vertical.noun} reviews`;
  const reviewPage = paginate(tiles, query[PAGE_PARAM], GRID_PAGE_SIZE);

  return (
    <PageShell activeNavId="reviews" rail={<ReviewsRail currentSlug={vertical.slug} />}>
      {/* Register: Comparison · Tier 2/3 — internal links only, no operator CTAs */}
      <Breadcrumbs
        currentPath={href}
        items={[{ label: "Reviews", href: "/reviews" }, { label: vertical.crumb }]}
      />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          {vertical.name} reviews
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          {vertical.description}
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {reviewPage.items.length === 0 ? (
          <EmptyState
            title={`No ${vertical.noun} reviews published yet`}
            body="A review appears here once it is published in the admin panel."
            action={{ href: "/reviews", label: "All review sections" }}
          />
        ) : (
          <>
            <ReviewDirectorySection title={sectionTitle} operators={reviewPage.items} />
            <PageNav
              page={reviewPage.page}
              totalPages={reviewPage.totalPages}
              total={reviewPage.total}
              from={reviewPage.from}
              to={reviewPage.to}
              noun="reviews"
              label={sectionTitle}
              hrefFor={(n) =>
                pageHref({ basePath: href, page: n, anchor: headingId("section", sectionTitle) })
              }
            />
          </>
        )}
      </div>

      <ReviewCard />
    </PageShell>
  );
}
