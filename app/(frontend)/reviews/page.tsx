import type { Metadata } from "next";
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
import EditorialSection from "@/components/section/EditorialSection";
import EmptyState from "@/components/section/EmptyState";
import ReviewCard from "@/components/section/ReviewCard";
import { formatDate } from "@/lib/utils";
import { buildOpenGraph } from "@/lib/og";

// ISR. Draft mode coexists with this: the __prerender_bypass cookie makes Next
// skip the cache for that request only, so a preview never serves a stale page
// and an ordinary visitor still gets the cached one.
export const revalidate = 3600;

const TITLE = "Sportsbook & Casino Reviews — WagerBlogs";
const DESCRIPTION = "Independent, tested reviews of legal sportsbooks and online casinos.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION, path: "/reviews" }),
  alternates: { canonical: "/reviews" },
};

// Reviews hub: a directory of the reviews we've published, then the method that
// produced the scores. Ranked lists, the comparison table and bonus offers are
// the home page's job — the hub links inward and carries no operator CTAs.
export default async function ReviewsIndexPage() {
  const { isEnabled: isDraft } = await draftMode();
  const previewUser = isDraft ? await resolvePreviewUser() : null;
  const payload = await getPayload({ config });

  // Verticals is structural taxonomy: no drafts, so no _status filter.
  const { docs: verticals } = await payload.find({
    collection: "verticals",
    where: { hasReviews: { equals: true } },
    sort: "order",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });

  // Reviews is editorial: drafts enabled, so _status is filtered unless the
  // request carries draft mode. One query grouped in memory rather than one
  // per vertical.
  const { docs: reviews } = await payload.find({
    collection: "reviews",
    ...publishedFilter(isDraft, {}, previewUser),
    sort: "-score",
    limit: 500,
    depth: 1,
    overrideAccess: false,
  });

  const tilesByVertical = new Map<number, ReviewTile[]>();
  for (const review of reviews) {
    const verticalId = typeof review.vertical === "object" ? review.vertical.id : review.vertical;
    const tile: ReviewTile = {
      id: review.id,
      name: review.name,
      score: review.score,
      categoryScores: (review.categoryScores ?? []).map((entry) => ({
        label: entry.label,
        score: entry.score,
      })),
      lastVerified: formatDate(review.lastVerified),
      lastVerifiedISO: review.lastVerified,
      href: `/reviews/${verticals.find((v) => v.id === verticalId)?.slug ?? ""}/${review.slug}`,
      logo: review.logo,
    };
    tilesByVertical.set(verticalId, [...(tilesByVertical.get(verticalId) ?? []), tile]);
  }

  return (
    <PageShell activeNavId="reviews" rail={<ReviewsRail />}>
      {/* Register: Comparison · Tier 2/3 — internal links only, no operator CTAs */}
      <Breadcrumbs items={[{ label: "Reviews" }]} />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Sportsbook & casino reviews
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          Every operator we&apos;ve reviewed, scored against the same criteria and dated when we
          last checked it. Ordered by score, not by what anyone pays.
        </p>
      </header>

      {verticals.length === 0 ? (
        <EmptyState
          title="No review sections published yet"
          body="Sections appear here once a vertical is marked as carrying reviews."
        />
      ) : (
        verticals.map((vertical) => {
          const tiles = tilesByVertical.get(vertical.id) ?? [];
          const title = `${vertical.name} reviews`;
          // An empty section states its absence rather than rendering a
          // heading over nothing.
          return tiles.length === 0 ? (
            <EditorialSection key={vertical.id} title={title} register="comparison">
              <EmptyState
                title={`No ${vertical.noun} reviews published yet`}
                body="A review appears here once it is published in the admin panel."
              />
            </EditorialSection>
          ) : (
            <ReviewDirectorySection
              key={vertical.id}
              title={title}
              operators={tiles}
              limit={4}
              allHref={`/reviews/${vertical.slug}`}
              allLabel={`All ${vertical.noun} reviews`}
            />
          );
        })
      )}

      <ReviewCard />
    </PageShell>
  );
}
