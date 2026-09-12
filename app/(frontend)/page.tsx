import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import HomeRail from "@/components/rail/HomeRail";
import RankedListSection from "@/components/section/RankedListSection";
import { mockRankedSportsbooks, mockRankedCasinos } from "@/lib/mock-data";
import ReviewCard from "@/components/section/ReviewCard";
import FeaturedBonusesCard from "@/components/section/FeaturedBonusesCard";
import ComparisonCard from "@/components/section/ComparisonCard";
import MarketCard from "@/components/section/MarketCard";
import ExploreSection from "@/components/section/ExploreSection";
import LatestNewsSection, { NEWS_PARAM } from "@/components/section/LatestNewsSection";
import BlogSection from "@/components/section/BlogSection";
import BettingToolboxSection from "@/components/section/BettingToolboxSection";
import TopHeroSection from "@/components/section/TopHeroSection";

export const metadata: Metadata = {
  title: "WagerBlogs — Compare Legal Sports Betting & Online Casino Sites",
  description: "Independent reviews, odds comparisons, and state-by-state legal betting guides.",
};

// ---------------------------------------------------------------------------
// Sample content only. TODO(cms) markers below call out where CMS/data wiring
// replaces this. Tier-based gating, link-policy (rel/anchor text), and auth
// state are NOT implemented here — see offpage-seo-six-layer-map.md.
//
// Four groups, one role each: the newsroom, the rankings, what those rankings
// are selling, then the context around them. Groups are plain layout wrappers
// — <main>'s gap is the break between roles, the group's own gap the rhythm
// within one.
// ---------------------------------------------------------------------------

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <PageShell activeNavId="home" rail={<HomeRail categoryParam={params[NEWS_PARAM]} />}>
      {/* Register: Editorial · Tier 1 — no outbound operator links */}
      <TopHeroSection />

      {/* Editorial · Tier 1 — the newsroom, directly beneath the h1 */}
      <div className="flex flex-col gap-5">
        <LatestNewsSection categoryParam={params[NEWS_PARAM]} />
        <BlogSection />
      </div>

      {/* Comparison · Tier 2/3 — CTA-bearing, one primary-domain entry per list.
          The methodology closes the group instead of splitting the two lists. */}
      <div className="flex flex-col gap-5">
        <RankedListSection
          title="Top-Rated Sportsbooks — July 2026"
          operators={mockRankedSportsbooks}
          action={{
            href: "/reviews/sportsbooks",
            label: "All sportsbook reviews",
          }}
        />
        <RankedListSection
          title="Top-Rated Online Casinos — July 2026"
          operators={mockRankedCasinos}
          action={{ href: "/reviews/casinos", label: "All casino reviews" }}
        />
        {/* TODO(cms): EditorialByline — the reviewer quote that sat here ran on a
            sample fixture; it needs a real Person record (photo, fullName,
            credential, quote) before it can go back on a live route. */}
        <ReviewCard />
      </div>

      <div className="flex flex-col gap-5">
        <FeaturedBonusesCard />
        <ComparisonCard />
      </div>

      {/* Context and navigation · Tier 1 — internal links only */}
      <div className="flex flex-col gap-5">
        {/* TODO(cms): SourcedStat[] — each figure needs a real named source and
            reporting period, or the strip collapses. */}
        <MarketCard />
        <ExploreSection />
        <BettingToolboxSection />
      </div>

      {/* TODO(cms): "As Featured In" media placements — omitted entirely; no logo
          placeholders and no "as seen in" strip until a real placement exists. */}
    </PageShell>
  );
}
