import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Comments from "@/components/Comments";
import ReviewCard from "@/components/section/ReviewCard";
import ComparisonCard from "@/components/section/ComparisonCard";
import PrimaryDomainLink from "@/components/PrimaryDomainLink";
import ReviewSectionHeading from "@/components/section/ReviewSectionHeading";
import TeaserCardGrid from "@/components/cards/TeaserCardGrid";
import AtAGlanceCard from "@/components/rail/AtAGlanceCard";
import OtherBooksCard from "@/components/rail/OtherBooksCard";
import ProsConsSection from "@/components/section/ProsConsSection";
import ArrowLink from "@/components/ui/ArrowLink";
import {
  mockPeakWagerReview,
  otherBooksCompared,
  reviewReaderReviews,
  reviewRelated,
  reviewAtAGlance,
  reviewTrustIndex,
  reviewBonusTerms,
  reviewFaqs,
} from "@/lib/mock-data";

// TODO(cms): replace with generateStaticParams() from the CMS operator list.
const operatorName = mockPeakWagerReview.name;

export const metadata: Metadata = { title: `${operatorName} Review — WagerBlogs` };

const scoreBreakdown = mockPeakWagerReview.categoryScores;
const pros = mockPeakWagerReview.pros ?? [];
const cons = mockPeakWagerReview.cons ?? [];

export default function OperatorReviewPage() {
  const rail = (
    <>
      <AtAGlanceCard items={reviewAtAGlance} />
      <div className="card pb-1 flex flex-col gap-2.5">
        <div className="font-bold text-sm text-text-primary">Trust signals on this page</div>
        {reviewTrustIndex.map((t) => (
          <div
            key={t.num}
            className="flex gap-2.5 items-baseline py-2 border-b border-border-hairline-alt last:border-b-0"
          >
            <div className="text-2xs text-text-subtle font-mono shrink-0">{t.num}</div>
            <div>
              <div className="text-sm font-semibold text-text-primary mb-0.5">{t.label}</div>
              <div className="text-2xs font-semibold text-text-subtle leading-relaxed">
                {t.note}
              </div>
            </div>
          </div>
        ))}
      </div>
      <OtherBooksCard books={otherBooksCompared} />
    </>
  );

  return (
    <PageShell activeNavId="reviews" rail={rail}>
      {/* Register: Comparison · Tier 3 — direct reference */}
      <Breadcrumbs
        items={[
          { label: "Reviews", href: "/reviews" },
          { label: "Sportsbooks", href: "/categories/sample" },
          { label: operatorName },
        ]}
      />

      <header className="flex flex-col gap-2.5">
        <h1 className="heading text-3xl leading-snug text-pretty">
          {operatorName} Review — July 2026
        </h1>
        <p className="text-md leading-copy text-text-body text-pretty">
          [Placeholder summary — the verdict in two sentences, what changed since last verification,
          and who this book suits.]
        </p>
      </header>

      {/* TRUST BLOCK 1/3 — editorial score */}
      <section>
        <ReviewSectionHeading
          badge="TRUST BLOCK 1 / 3"
          title="WagerBlogs editorial score"
          note="our tested verdict — produced by a named reviewer, methodology public"
        />
        <div className="flex flex-col gap-4 bg-bg-subtle border border-border-divider rounded-md p-4 md:p-5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 shrink-0 placeholder-asset rounded-md text-2xs text-text-subtle font-mono">
                [logo]
              </div>
              <div className="min-w-0">
                <div className="text-md font-bold text-text-primary mb-1">{operatorName}</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-text-primary leading-none">
                    {mockPeakWagerReview.score}
                  </span>
                  <span className="text-sm text-text-meta">/ 10 editorial</span>
                </div>
                <div className="text-2xs text-text-subtle font-mono mt-1">
                  Last Verified — [Jun 30, 2026] · tested with real deposits
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:flex md:flex-col gap-2.5 md:w-37.5 shrink-0">
              <PrimaryDomainLink
                linkTier="tier3"
                primaryDomainLink={mockPeakWagerReview.primaryDomainLink}
              />
              <Link href="/about" className="btn-secondary min-h-5 py-1.5 px-3 text-xs">
                How we score
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-legacy-4 md:gap-3">
            {scoreBreakdown.map((s) => (
              <div
                key={s.label}
                className="border border-border-divider rounded-sm p-2.5 bg-bg-card"
              >
                <div className="text-2xs text-text-meta font-mono mb-1 uppercase">{s.label}</div>
                <div className="text-lg font-bold text-text-primary">{s.score}</div>
              </div>
            ))}
          </div>
          {/* TODO(cms): ReviewerByline required — Review schema needs author.name. This
              block cannot publish anonymously. Sample fixture for layout reference only. */}
          <div className="flex gap-3 items-center bg-bg-card border border-dashed border-border-placeholder rounded-md p-3.5">
            <div className="w-10 h-10 rounded-full placeholder-asset shrink-0" />
            <div className="text-xs text-text-body">
              Reviewed by{" "}
              <Link
                href="/authors/jane-placeholder"
                className="font-semibold text-text-primary no-underline hover:underline underline-offset-2"
              >
                Jane Placeholder
              </Link>
              , Example Analyst
            </div>
          </div>
          <div className="text-2xs text-text-subtle leading-relaxed">
            21+. Bonus T&amp;Cs apply. [terms small print placeholder — wagering, expiry,
            eligibility, state availability]
          </div>
        </div>
      </section>

      <ProsConsSection pros={pros} cons={cons} />

      <ComparisonCard />

      <section>
        <ReviewSectionHeading title="Bonus detail" />
        <div className="card">
          <div className="flex justify-between gap-4 flex-wrap items-start mb-3">
            <div className="min-w-0">
              <div className="text-md font-semibold text-text-primary mb-1.5">
                Bet $5 Get $200 in Bonus Bets
              </div>
              <div className="text-xs text-text-subtle font-mono">
                code: PEAK200 · verified [Jun 30, 2026]
              </div>
            </div>
            <PrimaryDomainLink
              linkTier="tier3"
              primaryDomainLink={mockPeakWagerReview.primaryDomainLink}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
            {reviewBonusTerms.map((bt) => (
              <div
                key={bt.label}
                className="flex justify-between gap-3 text-xs text-text-muted py-1.5 border-b border-border-hairline"
              >
                <span>{bt.label}</span>
                <span className="text-text-strong-secondary font-semibold">{bt.value}</span>
              </div>
            ))}
          </div>
          <div className="text-2xs text-text-subtle leading-relaxed mt-2.5">
            [full bonus terms small print placeholder — required before publish; links to
            operator&apos;s own terms page]
          </div>
        </div>
      </section>

      {/* TRUST BLOCK 2/3 — reader reviews. Default rendered here is the signed-out
          invitation state; TODO: swap for real auth state in the app build. */}
      <section id="reader-reviews">
        <ReviewSectionHeading
          badge="TRUST BLOCK 2 / 3"
          title="Reader reviews"
          note="first-party · submitted on wagerblogs.com · never blended into the editorial score"
        />
        <div className="flex flex-col gap-4 border border-border-divider rounded-md p-4 md:p-5">
          <div className="flex items-baseline gap-2 pb-3 border-b border-border-hairline">
            <span className="text-2xl font-bold text-text-primary leading-none">[x.x]</span>
            <span className="text-sm text-text-meta">/ 5 reader average · [n] reviews</span>
          </div>
          <div className="bg-bg-subtle border border-border-divider rounded-md p-4">
            <div className="text-md font-semibold text-text-primary mb-1.5">
              Used this sportsbook? Add your review.
            </div>
            <div className="text-sm text-text-body leading-relaxed mb-3">
              Reviews are tied to an account — one per member per operator, held for moderation
              before they appear.
            </div>
            <Link href="/login" className="btn-primary">
              Sign in to review
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {reviewReaderReviews.map((r) => (
              <div
                key={r.username + r.meta}
                className="border border-border-hairline rounded-md p-3.5"
              >
                <div className="flex items-center justify-between gap-2.5 flex-wrap mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full placeholder-asset shrink-0" />
                    <span className="text-sm font-semibold text-text-primary">{r.username}</span>
                  </div>
                  <div className="text-2xs text-text-subtle font-mono">{r.meta}</div>
                </div>
                <div className="text-sm text-text-muted leading-relaxed">{r.text}</div>
              </div>
            ))}
          </div>
          <ArrowLink
            href="#reader-reviews"
            className="inline-flex items-center gap-1 min-h-11 text-md text-text-primary font-semibold group w-fit"
          >
            All [n] reader reviews
          </ArrowLink>
        </div>
      </section>

      {/* TRUST BLOCK 3/3 — Trustpilot. TODO(cms): TrustpilotWidget requires a real
          score, reviewCount > 0, profileUrl, fetchedAt, or it renders nothing (no
          skeleton, no "coming soon"). Sample fixture shown for layout reference only. */}
      <section>
        <ReviewSectionHeading
          badge="TRUST BLOCK 3 / 3"
          title="Trustpilot"
          note="third-party · conditional — renders only with real Trustpilot data"
        />
        <div className="border border-border-divider rounded-md p-4 md:p-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3.5">
            <div className="w-22 h-9 shrink-0 placeholder-asset rounded-md text-2xs text-text-subtle font-mono">
              [TP logo]
            </div>
            <div>
              <div className="text-md font-bold text-text-primary tracking-wide mb-0.5">☆☆☆☆☆</div>
              <div className="text-xs text-text-meta">4.x / 5 — N Trustpilot reviews</div>
              <div className="text-2xs text-text-subtle font-mono mt-0.5">fetched [fetch date]</div>
            </div>
          </div>
          <ArrowLink href="#" className="btn-secondary group min-h-0 py-1.5 px-3 gap-1 text-xs">
            Read Reviews
          </ArrowLink>
        </div>
      </section>

      <ReviewCard />

      <section>
        <ReviewSectionHeading title="Questions readers ask" />
        <div className="flex flex-col gap-2.5">
          {reviewFaqs.map((f) => (
            <div key={f.q} className="card">
              <div className="text-md font-semibold text-text-primary mb-1.5">{f.q}</div>
              <div className="text-sm text-text-muted leading-relaxed">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <ReviewSectionHeading title="Compare further" />
        <TeaserCardGrid
          items={reviewRelated}
          titleClassName="text-md font-semibold text-text-primary mb-1.5 leading-snug"
        />
      </section>

      <section>
        <Comments />
      </section>
    </PageShell>
  );
}
