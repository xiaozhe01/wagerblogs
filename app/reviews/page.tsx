import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import HelpLineCard from "@/components/rail/HelpLineCard";
import InfoCard from "@/components/rail/InfoCard";
import SearchInput from "@/components/rail/SearchInput";
import RankedListSection from "@/components/section/RankedListSection";
import ComparisonCard from "@/components/section/ComparisonCard";
import ReviewCard from "@/components/section/ReviewCard";
import WriterQuoteCard from "@/components/section/WriterQuoteCard";
import { mockRankedSportsbooks, mockRankedCasinos } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Sportsbook & Casino Reviews — WagerBlogs",
  description: "Independent, tested reviews of legal sportsbooks and online casinos.",
};

// Reviews hub: rankings → side-by-side comparison → methodology + editorial
// trust. Individual operator pages live at /reviews/[slug].
export default function ReviewsIndexPage() {
  const rail = (
    <>
      <div className="card">
        <SearchInput placeholder="Search reviews..." />
      </div>
      <InfoCard
        title="Editorial standards"
        body="How we research, test with real deposits, and correct our reviews."
        cta={{ href: "/about", label: "Read our methodology" }}
      />
      <HelpLineCard />
    </>
  );

  return (
    <PageShell activeNavId="reviews" rail={rail}>
      {/* Register: Comparison · Tier 2/3 — CTA-bearing, one primary-domain entry per list */}
      <Breadcrumbs items={[{ label: "Reviews" }]} />

      <header className="flex flex-col gap-3 max-w-160">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Sportsbook & casino reviews
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder standfirst — how these operators are tested, scored, and re-verified.]
        </p>
      </header>

      <section
        aria-label="Operator rankings"
        className="flex flex-col gap-5 bg-bg-subtle border border-border-divider rounded-md p-4"
      >
        <RankedListSection
          title="Top-Rated Sportsbooks — July 2026"
          operators={mockRankedSportsbooks}
        />
        <RankedListSection
          title="Top-Rated Online Casinos — July 2026"
          operators={mockRankedCasinos}
        />
      </section>

      <ComparisonCard />

      <ReviewCard />

      <WriterQuoteCard />
    </PageShell>
  );
}
