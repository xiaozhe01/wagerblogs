import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Comments from "@/components/section/Comments";
import ReviewCard from "@/components/section/ReviewCard";
import ComparisonCard from "@/components/section/ComparisonCard";
import PrimaryDomainLink from "@/components/controls/PrimaryDomainLink";
import ReviewSection from "@/components/section/ReviewSection";
import TeaserCardGrid from "@/components/cards/TeaserCardGrid";
import AtAGlanceCard from "@/components/rail/AtAGlanceCard";
import EmptyState from "@/components/section/EmptyState";
import ProsConsSection from "@/components/section/ProsConsSection";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import { RichText } from "@/components/rich-text/RichText";
import { ReviewJsonLd } from "@/lib/schema";
import { publishedFilter } from "@/lib/payload-queries";
import { formatDate } from "@/lib/utils";
// TODO Phase 4 hold — Reviews has no `related` relationship, so the
// "Compare further" grid has no Payload source yet.
import { reviewRelated } from "@/lib/mock-data";

type ReviewParams = { vertical: string; slug: string };

// ISR. Draft mode coexists with this: the __prerender_bypass cookie makes Next
// skip the cache for that request only.
export const revalidate = 3600;

async function findReview(verticalSlug: string, reviewSlug: string, isDraft: boolean) {
  const payload = await getPayload({ config });
  // verticals has no _status — structural (no lifecycle).
  const { docs: verticals } = await payload.find({
    collection: "verticals",
    where: { slug: { equals: verticalSlug } },
    limit: 1,
    depth: 0,
    overrideAccess: false,
  });
  const vertical = verticals[0];
  if (!vertical) return undefined;

  const { where, draft } = publishedFilter(isDraft, {
    slug: { equals: reviewSlug },
    vertical: { equals: vertical.id },
  });
  // depth 2: vertical and author populated, plus enough for rich-text internal
  // links to resolve their own parent relationships.
  const { docs } = await payload.find({
    collection: "reviews",
    where,
    draft,
    limit: 1,
    depth: 2,
    overrideAccess: false,
  });
  return docs[0] ? { review: docs[0], vertical } : undefined;
}

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const { where } = publishedFilter(false);
  const { docs } = await payload.find({
    collection: "reviews",
    where,
    limit: 500,
    depth: 1,
    overrideAccess: false,
  });
  return docs
    .map((review) => ({
      vertical: typeof review.vertical === "object" ? review.vertical.slug : undefined,
      slug: review.slug,
    }))
    .filter((entry): entry is ReviewParams => Boolean(entry.vertical));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ReviewParams>;
}): Promise<Metadata> {
  const { vertical: verticalSlug, slug } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const found = await findReview(verticalSlug, slug, isDraft);
  if (!found) return { title: "Reviews — WagerBlogs" };
  const { review } = found;
  return {
    title: review.seo?.metaTitle,
    description: review.seo?.metaDescription,
    alternates: {
      canonical: review.seo?.canonicalUrl || `/reviews/${verticalSlug}/${review.slug}`,
    },
  };
}

export default async function OperatorReviewPage({ params }: { params: Promise<ReviewParams> }) {
  const { vertical: verticalSlug, slug } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const found = await findReview(verticalSlug, slug, isDraft);
  // An operator we haven't reviewed — or one filed under another vertical — is
  // a genuine 404, not a template on empty data.
  if (!found) notFound();
  const { review, vertical } = found;

  const payload = await getPayload({ config });
  const operatorName = review.name;
  const currentPath = `/reviews/${vertical.slug}/${review.slug}`;
  const author = typeof review.author === "object" ? review.author : undefined;

  // reader-reviews carries its own moderation `status`, not the editorial
  // `_status` lifecycle — UGC is the third category in MIGRATION.md's split.
  const { docs: readerReviews } = await payload.find({
    collection: "reader-reviews",
    where: { operator: { equals: review.id }, status: { equals: "approved" } },
    sort: "-createdAt",
    limit: 50,
    depth: 1,
    overrideAccess: false,
  });

  // Sibling reviews in the same vertical, for the rail.
  const { where: siblingWhere, draft: siblingDraft } = publishedFilter(isDraft, {
    vertical: { equals: vertical.id },
    id: { not_equals: review.id },
  });
  const { docs: siblings } = await payload.find({
    collection: "reviews",
    where: siblingWhere,
    draft: siblingDraft,
    sort: "-score",
    limit: 20,
    depth: 0,
    overrideAccess: false,
  });

  const pros = (review.pros ?? [])
    .map((entry) => entry.pro)
    .filter((entry): entry is string => Boolean(entry));
  const cons = (review.cons ?? [])
    .map((entry) => entry.con)
    .filter((entry): entry is string => Boolean(entry));

  // Only rows with a real field behind them. "States live" had no schema
  // source, so it is absent rather than bracketed; reader average is omitted
  // until approved reader reviews exist (CLAUDE.md rule 4).
  const atAGlance = [
    { label: "Editorial score", value: `${review.score.toFixed(1)} / 10` },
    ...(readerReviews.length > 0
      ? [
          {
            label: "Reader average",
            value: `${(
              readerReviews.reduce((sum, entry) => sum + (entry.rating ?? 0), 0) /
              readerReviews.length
            ).toFixed(1)} / 5`,
          },
        ]
      : []),
    ...(review.payoutSpeedText ? [{ label: "Payout speed", value: review.payoutSpeedText }] : []),
    { label: "Last verified", value: formatDate(review.lastVerified) },
  ];

  const rail = (
    <>
      <AtAGlanceCard items={atAGlance} />
      {siblings.length > 0 && (
        <section className="card" aria-labelledby="rail-other-operators">
          <h2 id="rail-other-operators" className="heading text-sm mb-2.5">
            Other {vertical.noun}s compared
          </h2>
          <ul role="list" className="flex flex-col gap-2">
            {siblings.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={`/reviews/${vertical.slug}/${entry.slug}`}
                  className="flex items-center justify-between gap-2 text-sm font-medium text-text-body no-underline"
                >
                  <span className="min-w-0">{entry.name}</span>
                  <span className="shrink-0 tabular-nums font-bold text-text-primary">
                    {entry.score.toFixed(1)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );

  return (
    <PageShell activeNavId="reviews" rail={rail}>
      {/* Register: Comparison · Tier 3 — direct reference */}
      {/* The trail mirrors the route: /reviews/<vertical>/<slug>. */}
      <Breadcrumbs
        currentPath={currentPath}
        items={[
          { label: "Reviews", href: "/reviews" },
          { label: vertical.crumb, href: `/reviews/${vertical.slug}` },
          { label: operatorName },
        ]}
      />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          {operatorName} review
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          {review.seo?.metaDescription}
        </p>
      </header>

      <ReviewSection title="WagerBlogs editorial score">
        <article
          aria-label={`WagerBlogs editorial score for ${operatorName}`}
          className="flex flex-col gap-4 bg-bg-subtle border border-border-divider rounded-md p-3 md:p-5"
        >
          {/* Renders nothing until a real reviewer and date exist — Review schema is a
              trust signal, so it stays structurally absent on placeholder data. */}
          <ReviewJsonLd
            linkTier="tier3"
            itemName={operatorName}
            itemUrl={review.primaryDomainLink?.url ?? ""}
            pagePath={currentPath}
            ratingValue={review.score}
            bestRating={10}
            reviewerName={author?.name ?? ""}
            reviewerUrl={author ? `/authors/${author.slug}` : ""}
            datePublished={review.lastVerified}
          />
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                aria-hidden="true"
                className="w-14 h-14 shrink-0 placeholder-asset rounded-md text-2xs text-text-muted tabular-nums"
              >
                [logo]
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-text-primary mb-1">{operatorName}</h3>
                <p className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-text-primary leading-none">
                    <data value={review.score}>{review.score.toFixed(1)}</data>
                  </span>
                  <span className="text-sm text-text-muted">/ 10 editorial</span>
                </p>
                <p className="meta-label mt-1">
                  Last verified{" "}
                  <time dateTime={review.lastVerified}>{formatDate(review.lastVerified)}</time>
                  {review.fundedAccountConfirmed && " · tested with real deposits"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:flex md:flex-col gap-2.5 md:w-37.5 shrink-0">
              <PrimaryDomainLink
                linkTier="tier3"
                primaryDomainLink={
                  review.isPrimaryDomain && review.primaryDomainLink?.url
                    ? {
                        anchorText: review.primaryDomainLink.anchorText!,
                        url: review.primaryDomainLink.url,
                        relAttribute: review.primaryDomainLink.relAttribute ?? "nofollow",
                      }
                    : undefined
                }
              />
              <Link
                href="/about"
                className="btn-secondary min-h-11 wide:min-h-5 py-1.5 px-3 text-xs leading-heading"
              >
                How we score
              </Link>
            </div>
          </div>
          <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-legacy-4 md:gap-3">
            {(review.categoryScores ?? []).map((entry) => (
              <div
                key={entry.id ?? entry.label}
                className="border border-border-divider rounded-sm p-2.5 bg-bg-card"
              >
                <dt className="text-2xs text-text-muted tabular-nums mb-1 uppercase">
                  {entry.label}
                </dt>
                <dd className="text-lg font-bold text-text-primary">
                  <data value={entry.score}>{entry.score.toFixed(1)}</data>
                </dd>
              </div>
            ))}
          </dl>
          {author && (
            <div className="flex gap-3 items-center bg-bg-card border border-border-divider rounded-md p-3.5">
              <div className="w-10 h-10 rounded-full placeholder-asset shrink-0" />
              <p className="text-xs font-medium text-text-body">
                Reviewed by{" "}
                <Link
                  href={`/authors/${author.slug}`}
                  className="font-semibold text-text-primary no-underline hover:underline underline-offset-2"
                >
                  {author.name}
                </Link>
                {author.credentialLine && `, ${author.credentialLine}`}
              </p>
            </div>
          )}
        </article>
      </ReviewSection>

      {(pros.length > 0 || cons.length > 0) && <ProsConsSection pros={pros} cons={cons} />}

      <ComparisonCard linkTier="tier3" />

      <ReviewSection title="Our verdict">
        <RichText data={review.reviewBody} />
      </ReviewSection>

      {(review.bonusTerms ?? []).length > 0 && (
        <ReviewSection title="Bonus detail">
          <div className="card">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
              {(review.bonusTerms ?? []).map((entry) => (
                <div
                  key={entry.id ?? entry.label}
                  className="flex justify-between gap-3 text-xs text-text-muted py-1.5 border-b border-border-hairline"
                >
                  <dt>{entry.label}</dt>
                  <dd className="text-text-strong-secondary font-semibold">{entry.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </ReviewSection>
      )}

      {/* TRUST BLOCK 2/3 — reader reviews. Signed-out invitation state; FW-2
          wires submission once auth exists. */}
      <ReviewSection id="reader-reviews" title="Reader reviews">
        <div className="card flex flex-col gap-4">
          <div className="bg-bg-subtle border border-border-divider rounded-md p-3 flex flex-col items-start gap-2.5">
            <h3 className="text-lg font-semibold text-text-primary">
              Used this {vertical.noun}? Add your review.
            </h3>
            <p className="text-sm text-text-body leading-relaxed">
              Reviews are tied to an account — one per member per operator, held for moderation
              before they appear.
            </p>
            {/* TODO(FW-2): /login lands when auth is wired. */}
            <Link href="/login" className="btn-brand">
              Sign in to review
            </Link>
          </div>
          {readerReviews.length === 0 ? (
            <EmptyState
              title="No reader reviews yet"
              body="Approved member reviews appear here. Nothing is shown until a real one is moderated and published."
            />
          ) : (
            <ul role="list" className="flex flex-col gap-2.5">
              {readerReviews.map((entry) => (
                <li key={entry.id}>
                  <article className="border border-border-hairline rounded-md p-3.5 flex items-start gap-2.5">
                    <div
                      aria-hidden="true"
                      className="w-6 h-6 rounded-full placeholder-asset shrink-0"
                    />
                    <div className="min-w-0 flex flex-col gap-2">
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className="text-sm font-semibold text-text-primary">
                          {typeof entry.author === "object" ? entry.author?.id : entry.author}
                        </span>
                        <span className="meta-label tabular-nums">{entry.rating} / 5</span>
                      </div>
                      {/* Plain text, not rich text — ReaderReviews.body is a
                          textarea, deliberately: UGC carries no markup. */}
                      <p className="text-sm text-text-muted leading-relaxed wrap-break-word">
                        {entry.body}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </ReviewSection>

      {/* TRUST BLOCK 3/3 — Trustpilot. TODO(cms): no schema field for external
          ratings. The block states its absence rather than showing a stub score. */}
      <ReviewSection title="Trustpilot">
        <EmptyState
          title="No Trustpilot rating connected"
          body="A rating appears here only with a real score, review count, profile URL and fetch date behind it."
        />
      </ReviewSection>

      <ReviewCard />

      <ReviewSection title="Compare further">
        {/* TODO Phase 4 hold — no Payload source for this field yet. */}
        <TeaserCardGrid
          items={reviewRelated}
          titleClassName="text-lg font-semibold text-text-primary mb-1.5 leading-snug"
        />
      </ReviewSection>

      <ArrowLink href="/reviews" className={`${sectionCtaClassName} min-h-11 w-fit`}>
        All reviews
      </ArrowLink>

      <Comments />
    </PageShell>
  );
}
