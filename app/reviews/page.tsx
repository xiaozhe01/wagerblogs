import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import HelpLineCard from "@/components/rail/HelpLineCard";
import SearchInput from "@/components/rail/SearchInput";
import RankedListSection from "@/components/section/RankedListSection";
import { mockRankedSportsbooks, mockRankedCasinos } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Sportsbook & Casino Reviews — WagerBlogs",
  description: "Independent, tested reviews of legal sportsbooks and online casinos.",
};

// Minimal reviews index — lists the same ranked operators shown on the
// homepage. Individual operator pages live at /reviews/[slug].
export default function ReviewsIndexPage() {
  const rail = (
    <>
      <div className="card">
        <SearchInput placeholder="Search reviews..." />
      </div>
      <HelpLineCard />
    </>
  );

  return (
    <PageShell activeNavId="reviews" rail={rail}>
      {/* Register: Comparison · Tier 2/3 — CTA-bearing, one primary-domain entry per list */}
      <Breadcrumbs items={[{ label: "Reviews" }]} />

      <header className="flex flex-col gap-3 max-w-160 border-t border-text-primary pt-4 lg:pt-5">
        <h1 className="heading-serif text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Sportsbook & casino reviews
        </h1>
        <p className="font-serif text-xl leading-copy text-text-body text-pretty">
          [Placeholder standfirst — how these operators are tested, scored, and re-verified.]
        </p>
      </header>

      <div className="flex flex-col gap-5 bg-bg-subtle border border-border-divider rounded-md p-4">
        <RankedListSection
          title="Top-Rated Sportsbooks — July 2026"
          operators={mockRankedSportsbooks}
        />
        <RankedListSection
          title="Top-Rated Online Casinos — July 2026"
          operators={mockRankedCasinos}
        />
      </div>
    </PageShell>
  );
}
