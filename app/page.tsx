import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import HomeRail from "@/components/rail/HomeRail";
import RankedListSection from "@/components/section/RankedListSection";
import { mockRankedSportsbooks, mockRankedCasinos } from "@/lib/mock-data";
import ReviewCard from "@/components/section/ReviewCard";
import WriterQuoteCard from "@/components/section/WriterQuoteCard";
import FeaturedBonusesCard from "@/components/section/FeaturedBonusesCard";
import ComparisonCard from "@/components/section/ComparisonCard";
import MarketCard from "@/components/section/MarketCard";
import ExploreSection from "@/components/section/ExploreSection";
import LatestNewsSection from "@/components/section/LatestNewsSection";
import BlogSection from "@/components/section/BlogSection";
import Divider from "@/components/ui/Divider";
import BettingToolboxSection from "@/components/section/BettingToolboxSection";
import TopHeroSection from "@/components/section/TopHeroSection";

export const metadata: Metadata = {
  title: "WagerBlogs — Compare Legal Sports Betting & Online Casino Sites",
  description: "Independent reviews, odds comparisons, and state-by-state legal betting guides.",
};

// ---------------------------------------------------------------------------
// Sample content only. TODO(cms) markers below call out where CMS/data wiring
// replaces this. Tier-based gating, link-policy (rel/anchor text), and auth
// state are NOT implemented here — see offpage-seo-six-layer-map.md for the
// rules this scaffold intentionally leaves out.
// ---------------------------------------------------------------------------

export default function Home() {
  return (
    <PageShell activeNavId="home" rail={<HomeRail />}>
      {/* Register: Editorial · Tier 1 — no outbound operator links */}
      <TopHeroSection />

      {/* Register: Comparison · Tier 2/3 — CTA-bearing, one primary-domain entry per list */}
      <div className="flex flex-col gap-5 bg-bg-subtle border border-border-divider rounded-md p-4">
        <RankedListSection
          title="Top-Rated Sportsbooks — July 2026"
          operators={mockRankedSportsbooks}
        />

        <ReviewCard />
        {/* TODO(cms): EditorialByline — requires a real Person record (photo, fullName,
            credential, authorUrl, quote). Sample fixture shown for layout reference only;
            omit this section entirely until a real author is connected. */}
        <WriterQuoteCard />
        <RankedListSection
          title="Top-Rated Online Casinos — July 2026"
          operators={mockRankedCasinos}
        />

        <FeaturedBonusesCard />
        <ComparisonCard />

        {/* TODO(cms): SourcedStat[] — sample fixture from Component-Reference-Filled-States;
            each figure needs a real named source + reporting period, or the strip collapses. */}
        <MarketCard />
      </div>

      {/* Register: Editorial · Tier 1 — internal links only */}
      <section className="flex flex-col gap-5">
        <ExploreSection />
        <Divider />
        <LatestNewsSection />
        <Divider />
        <BlogSection />
        <Divider />
        <BettingToolboxSection />
      </section>

      {/* TODO(cms): "As Featured In" media placements — omitted entirely; no logo
          placeholders and no "as seen in" strip until a real placement exists. */}
    </PageShell>
  );
}
