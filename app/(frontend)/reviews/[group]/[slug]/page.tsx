import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Comments from "@/components/section/Comments";
import ReviewCard from "@/components/section/ReviewCard";
import ComparisonCard from "@/components/section/ComparisonCard";
import PrimaryDomainLink from "@/components/controls/PrimaryDomainLink";
import ReviewSection from "@/components/section/ReviewSection";
import TeaserCardGrid from "@/components/cards/TeaserCardGrid";
import AtAGlanceCard from "@/components/rail/AtAGlanceCard";
import OtherBooksCard from "@/components/rail/OtherBooksCard";
import ProsConsSection from "@/components/section/ProsConsSection";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import { ReviewJsonLd } from "@/lib/schema";
import {
  mockAuthor,
  reviewReaderReviews,
  reviewRelated,
  reviewAtAGlance,
  reviewBonusTerms,
} from "@/lib/mock-data";
import { findReview, reviewParams } from "@/lib/reviews";

type ReviewParams = { group: string; slug: string };

// TODO(cms): reviewer comes from the Person record. Shared by the byline below and
// the Review schema so the two can never drift apart.
const reviewerName = mockAuthor.name;
const reviewerHref = `/authors/${mockAuthor.slug}`;

export function generateStaticParams() {
  return reviewParams;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ReviewParams>;
}): Promise<Metadata> {
  const { group, slug } = await params;
  const found = findReview(group, slug);
  if (!found) return { title: "Reviews — WagerBlogs" };
  return {
    title: `${found.operator.name} Review — WagerBlogs`,
    description: `Our tested ${found.group.noun} review of ${found.operator.name}: editorial score, strengths, trade-offs, and how it compares.`,
    alternates: { canonical: `${found.group.href}/${found.operator.slug}` },
  };
}

export default async function OperatorReviewPage({ params }: { params: Promise<ReviewParams> }) {
  const { group: groupSlug, slug } = await params;
  const found = findReview(groupSlug, slug);
  // An operator we haven't reviewed — or one filed under another group — is a
  // genuine 404, not a template on empty data.
  if (!found) notFound();
  const { operator, group } = found;
  const operatorName = operator.name;
  const currentPath = `${group.href}/${operator.slug}`;
  const scoreBreakdown = operator.categoryScores;
  const pros = operator.pros ?? [];
  const cons = operator.cons ?? [];
  const siblings = group.operators.filter((entry) => entry.slug !== operator.slug);
  const atAGlance = [
    { label: "Editorial score", value: `${operator.score.toFixed(1)} / 10` },
    ...reviewAtAGlance,
  ];
  const rail = (
    <>
      <AtAGlanceCard items={atAGlance} />
      <OtherBooksCard title={`Other ${group.noun}s compared`} operators={siblings} />
    </>
  );

  return (
    <PageShell activeNavId="reviews" rail={rail}>
      {/* Register: Comparison · Tier 3 — direct reference */}
      {/* The trail mirrors the route: /reviews/<group>/<slug>. */}
      <Breadcrumbs
        currentPath={currentPath}
        items={[
          { label: "Reviews", href: "/reviews" },
          { label: group.crumb, href: group.href },
          { label: operatorName },
        ]}
      />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          {operatorName} Review — July 2026
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder summary — the verdict in two sentences, what changed since last verification,
          and who this book suits.]
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
            itemUrl={operator.primaryDomainLink?.url ?? ""}
            pagePath={currentPath}
            ratingValue={operator.score}
            bestRating={10}
            reviewerName={reviewerName}
            reviewerUrl={reviewerHref}
            datePublished={operator.lastVerified}
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
                    <data value={operator.score}>{operator.score.toFixed(1)}</data>
                  </span>
                  <span className="text-sm text-text-muted">/ 10 editorial</span>
                </p>
                {/* TODO(cms): stays bracketed on purpose. mockPeakWagerReview.lastVerified is
                    real ISO, but "tested with real deposits" is a trust claim that hasn't
                    happened — don't swap in the date (or a <time>) until it has. */}
                <p className="meta-label mt-1">
                  Last Verified — [Jun 30, 2026] · tested with real deposits
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:flex md:flex-col gap-2.5 md:w-37.5 shrink-0">
              <PrimaryDomainLink linkTier="tier3" primaryDomainLink={operator.primaryDomainLink} />
              <Link
                href="/about"
                className="btn-secondary min-h-11 wide:min-h-5 py-1.5 px-3 text-xs leading-heading"
              >
                How we score
              </Link>
            </div>
          </div>
          <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-legacy-4 md:gap-3">
            {scoreBreakdown.map((s) => (
              <div
                key={s.label}
                className="border border-border-divider rounded-sm p-2.5 bg-bg-card"
              >
                <dt className="text-2xs text-text-muted tabular-nums mb-1 uppercase">{s.label}</dt>
                <dd className="text-lg font-bold text-text-primary">
                  <data value={s.score}>{s.score.toFixed(1)}</data>
                </dd>
              </div>
            ))}
          </dl>
          {/* TODO(cms): ReviewerByline required — Review schema needs author.name. This
              block cannot publish anonymously. Sample fixture for layout reference only. */}
          <div className="flex gap-3 items-center bg-bg-card border border-dashed border-border-placeholder rounded-md p-3.5">
            <div className="w-10 h-10 rounded-full placeholder-asset shrink-0" />
            <p className="text-xs font-medium text-text-body">
              Reviewed by{" "}
              <Link
                href={reviewerHref}
                className="font-semibold text-text-primary no-underline hover:underline underline-offset-2"
              >
                {reviewerName}
              </Link>
              , Example Analyst
            </p>
          </div>
          <p className="text-2xs font-medium text-text-muted leading-relaxed">
            21+. Bonus T&amp;Cs apply. [terms small print placeholder — wagering, expiry,
            eligibility, state availability]
          </p>
        </article>
      </ReviewSection>

      <ProsConsSection pros={pros} cons={cons} />

      <ComparisonCard linkTier="tier3" />

      <ReviewSection title="Bonus detail">
        <div className="card">
          <div className="flex justify-between gap-4 flex-wrap items-start mb-3">
            <div className="min-w-0">
              {/* TODO(cms): the offer is per-operator — headline, code, and the date
                  it was checked. Bracketed until a real one is attached; a shared
                  fixture here would read as this operator's actual bonus. */}
              <h3 className="text-lg font-semibold text-text-primary mb-1.5">
                [Placeholder bonus headline — {operatorName}]
              </h3>
              <p className="text-xs text-text-muted tabular-nums">
                code: <code>[CODE]</code> · verified [date required]
              </p>
            </div>
            <PrimaryDomainLink linkTier="tier3" primaryDomainLink={operator.primaryDomainLink} />
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
            {reviewBonusTerms.map((bt) => (
              <div
                key={bt.label}
                className="flex justify-between gap-3 text-xs text-text-muted py-1.5 border-b border-border-hairline"
              >
                <dt>{bt.label}</dt>
                <dd className="text-text-strong-secondary font-semibold">{bt.value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-2xs font-medium text-text-muted leading-relaxed mt-2.5">
            [full bonus terms small print placeholder — required before publish; links to
            operator&apos;s own terms page]
          </p>
        </div>
      </ReviewSection>

      {/* TRUST BLOCK 2/3 — reader reviews. Default rendered here is the signed-out
          invitation state; TODO: swap for real auth state in the app build. */}
      <ReviewSection id="reader-reviews" title="Reader reviews">
        <div className="card flex flex-col gap-4">
          {/* pb-4 matches the parent gap so the rule sits centred between the
              summary and the block below it. */}
          <p className="flex items-baseline gap-2 pb-4 border-b border-border-hairline">
            <span className="text-2xl font-bold text-text-primary leading-none">[x.x]</span>
            <span className="text-sm text-text-muted">
              / 5 reader average · {reviewReaderReviews.length} reviews
            </span>
          </p>
          <div className="bg-bg-subtle border border-border-divider rounded-md p-3 flex flex-col items-start gap-2.5">
            <h3 className="text-lg font-semibold text-text-primary">
              Used this {group.noun}? Add your review.
            </h3>
            <p className="text-sm text-text-body leading-relaxed">
              Reviews are tied to an account — one per member per operator, held for moderation
              before they appear.
            </p>
            {/* TODO(clerk): /login lands when Clerk is wired. */}
            <Link href="/login" className="btn-brand">
              Sign in to review
            </Link>
          </div>
          <ul role="list" className="flex flex-col gap-2.5">
            {reviewReaderReviews.map((r) => (
              <li key={r.username + r.meta}>
                <article className="border border-border-hairline rounded-md p-3.5 flex items-start gap-2.5">
                  <div
                    aria-hidden="true"
                    className="w-6 h-6 rounded-full placeholder-asset shrink-0"
                  />
                  <div className="min-w-0 flex flex-col gap-2">
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className="text-sm font-semibold text-text-primary">{r.username}</span>
                      {/* TODO(cms): real review records carry an ISO timestamp — render as <time dateTime>. */}
                      <span className="meta-label">{r.meta}</span>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed wrap-break-word">
                      {r.text}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
          <ArrowLink href="#reader-reviews" className={`${sectionCtaClassName} min-h-11 w-fit`}>
            All {reviewReaderReviews.length} reader reviews
          </ArrowLink>
        </div>
      </ReviewSection>

      {/* TRUST BLOCK 3/3 — Trustpilot. TODO(cms): TrustpilotWidget requires a real
          score, reviewCount > 0, profileUrl, fetchedAt, or it renders nothing (no
          skeleton, no "coming soon"). Sample fixture shown for layout reference only. */}
      <ReviewSection title="Trustpilot">
        <div className="card flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3.5">
            <div
              aria-hidden="true"
              className="w-22 h-9 shrink-0 placeholder-asset rounded-md text-2xs text-text-muted tabular-nums"
            >
              [TP logo]
            </div>
            <div>
              <p
                aria-hidden="true"
                className="text-md font-bold text-text-primary tracking-wide mb-0.5"
              >
                ☆☆☆☆☆
              </p>
              <p className="text-xs font-medium text-text-muted">4.x / 5 — N Trustpilot reviews</p>
              <p className="meta-label font-medium mt-0.5">fetched [fetch date]</p>
            </div>
          </div>
          <ArrowLink
            href="/reviews"
            className="btn-secondary group min-h-11 wide:min-h-5 py-1.5 px-3 gap-1 text-xs leading-heading"
          >
            Read Reviews
          </ArrowLink>
        </div>
      </ReviewSection>

      <ReviewCard />

      <ReviewSection title="Compare further">
        <TeaserCardGrid
          items={reviewRelated}
          titleClassName="text-lg font-semibold text-text-primary mb-1.5 leading-snug"
        />
      </ReviewSection>

      <Comments />
    </PageShell>
  );
}
