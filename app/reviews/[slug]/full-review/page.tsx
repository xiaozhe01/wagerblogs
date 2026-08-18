import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ReviewCard from "@/components/section/ReviewCard";
import HelpLineCard from "@/components/rail/HelpLineCard";
import PrimaryDomainLink from "@/components/PrimaryDomainLink";
import ComparisonCard from "@/components/section/ComparisonCard";
import ReviewSectionHeading from "@/components/section/ReviewSectionHeading";
import AnchorList from "@/components/rail/AnchorList";
import TeaserCardGrid from "@/components/cards/TeaserCardGrid";
import AtAGlanceCard from "@/components/rail/AtAGlanceCard";
import OtherBooksCard from "@/components/rail/OtherBooksCard";
import ProsConsSection from "@/components/section/ProsConsSection";
import {
  mockPeakWagerReview,
  otherBooksCompared,
  fullReviewBonusTerms,
  fullReviewFaqs,
  fullReviewRelated,
  fullReviewAtAGlance,
  fullReviewJumpLinks,
} from "@/lib/mock-data";

// TODO: this is an alternate long-form "comparison article" template for the same
// operator route as /reviews/[slug] — both were designed during exploration; pick one
// (or merge) during the Claude Code build.
const operatorName = mockPeakWagerReview.name;

export const metadata: Metadata = { title: `${operatorName} Review & Comparison — WagerBlogs` };

const scoreBreakdown = mockPeakWagerReview.categoryScores;
const pros = mockPeakWagerReview.pros ?? [];
const cons = mockPeakWagerReview.cons ?? [];
export default function ReviewPostPage() {
  const rail = (
    <>
      <AtAGlanceCard
        items={fullReviewAtAGlance}
        primaryDomainLink={mockPeakWagerReview.primaryDomainLink}
      />
      <AnchorList
        title="Jump to"
        items={fullReviewJumpLinks.map((j) => ({ href: "#scores", label: j, key: j }))}
        itemClassName="flex items-center min-h-11 lg:min-h-8 text-sm text-text-body no-underline border-b border-border-hairline-alt leading-snug"
      />
      <OtherBooksCard books={otherBooksCompared} />
      <HelpLineCard />
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
        <h1 className="text-3xl leading-snug tracking-tight text-text-primary text-pretty">
          {operatorName} Review — July 2026
        </h1>
        <p className="text-md leading-copy text-text-body max-w-prose text-pretty">
          [Placeholder summary line — what this book is good at, who it suits, and how it compares
          to the two closest alternatives.]
        </p>
        <div className="flex gap-3.5 flex-wrap text-xs text-text-subtle font-mono">
          <div>Last Verified — [Jun 30, 2026]</div>
          <div>Updated [Jul 24, 2026]</div>
          <div>Tested with real deposits</div>
        </div>
      </header>

      <section className="flex flex-col gap-4 bg-bg-subtle border border-border-divider rounded-md p-4 lg:p-5">
        <div className="flex flex-col wide:flex-row items-stretch wide:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 shrink-0 placeholder-asset rounded-md text-2xs text-text-subtle font-mono">
              [logo]
            </div>
            <div className="min-w-0">
              <div className="text-md font-bold text-text-primary mb-1">{operatorName}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-text-primary leading-none">9.4</span>
                <span className="text-sm text-text-meta">/ 10 overall</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 wide:flex wide:flex-col gap-2.5 wide:w-37.5 shrink-0">
            <PrimaryDomainLink
              linkTier="tier3"
              primaryDomainLink={mockPeakWagerReview.primaryDomainLink}
            />
            <Link href="#scores" className="btn-secondary min-h-0 py-1.5 px-3 text-xs">
              See full scores
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 wide:grid-cols-6! gap-legacy-4 md:gap-3">
          {scoreBreakdown.map((s) => (
            <div key={s.label} className="border border-border-divider rounded-sm p-2.5 bg-bg-card">
              <div className="text-2xs text-text-meta font-mono mb-1 uppercase">{s.label}</div>
              <div className="text-lg font-bold text-text-primary">{s.score}</div>
            </div>
          ))}
        </div>
        <div className="text-2xs text-text-subtle leading-relaxed">
          21+. Bonus T&amp;Cs apply. [terms small print placeholder — wagering, expiry, eligibility,
          state availability]
        </div>
      </section>

      <ProsConsSection pros={pros} cons={cons} />

      <ComparisonCard id="scores" />

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
            {fullReviewBonusTerms.map((bt) => (
              <div
                key={bt.label}
                className="flex justify-between gap-3 text-xs text-text-muted py-1.5 border-b border-border-hairline-alt"
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

      <ReviewCard />

      {/* TODO(cms): ReviewerByline — requires a real Person record; Review schema
          needs author.name — this route cannot publish without it. */}

      <section>
        <ReviewSectionHeading title="Questions readers ask" />
        <div className="flex flex-col gap-2.5">
          {fullReviewFaqs.map((f) => (
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
          items={fullReviewRelated}
          titleClassName="text-sm font-bold text-text-primary mb-1 leading-snug"
        />
      </section>
    </PageShell>
  );
}
