import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Review } from "@/payload-types";
import PageShell from "@/components/layout/PageShell";
import HomeRail from "@/components/rail/HomeRail";
import RankedListSection from "@/components/section/RankedListSection";
import type { RankedOperator } from "@/components/section/RankedList";
import ReviewCard from "@/components/section/ReviewCard";
import FeaturedBonusesCard from "@/components/section/FeaturedBonusesCard";
import type { BonusOfferCardData } from "@/components/cards/BonusOfferCard";
import ComparisonCard from "@/components/section/ComparisonCard";
import MarketCard from "@/components/section/MarketCard";
import ExploreSection from "@/components/section/ExploreSection";
import LatestNewsSection, { ALL_NEWS, NEWS_PARAM } from "@/components/section/LatestNewsSection";
import BlogSection, { type ArticleTeaser } from "@/components/section/BlogSection";
import BettingToolboxSection from "@/components/section/BettingToolboxSection";
import TopHeroSection from "@/components/section/TopHeroSection";
import { publishedFilter, resolvePreviewUser } from "@/lib/payload-queries";
import { storyRow } from "@/lib/news-rows";
import { readTime } from "@/lib/lexical";
import { formatDate, resolveChip } from "@/lib/utils";

export const metadata: Metadata = {
  title: "WagerBlogs — Compare Legal Sports Betting & Online Casino Sites",
  description: "Independent reviews, odds comparisons, and state-by-state legal betting guides.",
};

// No `revalidate`: this route reads searchParams for the news chip, so Next
// renders it per request and the ISR window would never apply.

const RANKED_LIMIT = 5;
const ARTICLE_TEASER_LIMIT = 3;
const NEWS_TEASER_LIMIT = 4;

/** Rule 5 is enforced by the data: only the one entry flagged isPrimaryDomain
 * carries an equity-passing link, and the rest render no CTA at all. */
function rankedRow(review: Review, verticalSlug: string): RankedOperator {
  const link = review.primaryDomainLink;
  return {
    id: review.id,
    name: review.name,
    score: review.score,
    advantages: (review.advantages ?? [])
      .map((entry) => entry.advantage)
      .filter((entry): entry is string => Boolean(entry)),
    href: `/reviews/${verticalSlug}/${review.slug}`,
    primaryDomainLink:
      review.isPrimaryDomain && link?.url && link.anchorText
        ? {
            anchorText: link.anchorText,
            url: link.url,
            relAttribute: link.relAttribute ?? "nofollow",
          }
        : undefined,
  };
}

// ---------------------------------------------------------------------------
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
  const { isEnabled: isDraft } = await draftMode();
  const previewUser = isDraft ? await resolvePreviewUser() : null;
  const payload = await getPayload({ config });

  // Sequential, never Promise.all: each await returns its client to the pool
  // before the next asks for one, which keeps this route's connection use flat
  // no matter how many sections it grows. See STRUCTURE.md.

  // 1. verticals — structural taxonomy, no _status. Serves the category tiles
  // and supplies the ids the two ranked lists filter on.
  const { docs: verticals } = await payload.find({
    collection: "verticals",
    sort: "order",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });
  const sportsbooks = verticals.find((vertical) => vertical.slug === "sportsbooks");
  const casinos = verticals.find((vertical) => vertical.slug === "online-casinos");

  // 2 & 3. reviews — editorial, _status filtered. One query per ranked list:
  // each is a separate top-N, not a slice of a shared result.
  const { docs: rankedSportsbooks } = sportsbooks
    ? await payload.find({
        collection: "reviews",
        ...publishedFilter(isDraft, { vertical: { equals: sportsbooks.id } }, previewUser),
        sort: "-score",
        limit: RANKED_LIMIT,
        depth: 0,
        overrideAccess: false,
      })
    : { docs: [] as Review[] };

  const { docs: rankedCasinos } = casinos
    ? await payload.find({
        collection: "reviews",
        ...publishedFilter(isDraft, { vertical: { equals: casinos.id } }, previewUser),
        sort: "-score",
        limit: RANKED_LIMIT,
        depth: 0,
        overrideAccess: false,
      })
    : { docs: [] as Review[] };

  // 4. bonus-offers — structural, no _status. `active` is the editor's switch.
  const { docs: offers } = await payload.find({
    collection: "bonus-offers",
    where: { active: { equals: true } },
    limit: 4,
    depth: 0,
    overrideAccess: false,
  });

  // 5. articles — editorial. depth 1 resolves the author for the byline.
  const { docs: articles } = await payload.find({
    collection: "articles",
    ...publishedFilter(isDraft, {}, previewUser),
    sort: "-publishedAt",
    limit: ARTICLE_TEASER_LIMIT,
    depth: 1,
    overrideAccess: false,
  });

  // 6. news-sections — structural. The chips come from the taxonomy, not from
  // whichever sections happen to have a story, so an empty one says so.
  const { docs: newsSections } = await payload.find({
    collection: "news-sections",
    sort: "order",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });
  const activeSection = resolveChip(
    [ALL_NEWS, ...newsSections.map((section) => section.slug)],
    params[NEWS_PARAM],
    ALL_NEWS,
  );
  const selected = newsSections.find((section) => section.slug === activeSection);

  // 7. news — editorial. The feed and the rail's "More headlines" split one
  // result so the two cannot show the same story twice.
  const { docs: stories } = await payload.find({
    collection: "news",
    ...publishedFilter(isDraft, selected ? { section: { equals: selected.id } } : {}, previewUser),
    sort: "-publishedAt",
    limit: 500,
    depth: 1,
    overrideAccess: false,
  });

  // 8. market-stats — a global, no drafts.
  const marketStats = await payload.findGlobal({
    slug: "market-stats",
    depth: 0,
    overrideAccess: false,
  });

  const sectionSlug = (story: (typeof stories)[number]) =>
    typeof story.section === "object" ? story.section.slug : (selected?.slug ?? "");
  const teasers = stories.slice(0, NEWS_TEASER_LIMIT);
  const rest = stories.slice(NEWS_TEASER_LIMIT);

  const newsRows = teasers.map((story) =>
    storyRow(story, sectionSlug(story), {
      kicker: typeof story.section === "object" ? story.section.name : undefined,
    }),
  );
  const trending = rest.map((story) => ({
    href: `/news/${sectionSlug(story)}/${story.slug}`,
    label: story.title,
    key: String(story.id),
  }));

  const articleTeasers: ArticleTeaser[] = articles.map((article) => {
    const author = typeof article.author === "object" ? article.author : undefined;
    const published = article.publishedAt ? formatDate(article.publishedAt) : undefined;
    return {
      slug: article.slug,
      href: `/articles/${article.slug}`,
      kicker: article.type,
      title: article.title,
      excerpt: article.excerpt,
      byline: [author ? `by ${author.name}` : undefined, published, readTime(article.body)]
        .filter(Boolean)
        .join(" · "),
      thumbnail: article.heroImage,
    };
  });

  const bonusOffers: BonusOfferCardData[] = offers.map((offer) => ({
    name: offer.name,
    headline: offer.headline,
    code: offer.code ?? undefined,
    benefits: (offer.benefits ?? [])
      .map((entry) => entry.benefit)
      .filter((entry): entry is string => Boolean(entry)),
    isPrimaryDomain: Boolean(offer.isPrimaryDomain),
    primaryDomainLink:
      offer.primaryDomainLink?.url && offer.primaryDomainLink.anchorText
        ? {
            anchorText: offer.primaryDomainLink.anchorText,
            url: offer.primaryDomainLink.url,
            relAttribute: offer.primaryDomainLink.relAttribute ?? "nofollow",
          }
        : undefined,
    operatorLink:
      offer.operatorLink?.url && offer.operatorLink.anchorText
        ? { anchorText: offer.operatorLink.anchorText, url: offer.operatorLink.url }
        : undefined,
  }));

  return (
    <PageShell activeNavId="home" rail={<HomeRail trending={trending} />}>
      {/* Register: Editorial · Tier 1 — no outbound operator links */}
      <TopHeroSection />

      {/* Editorial · Tier 1 — the newsroom, directly beneath the h1 */}
      <div className="flex flex-col gap-5">
        <LatestNewsSection
          sections={newsSections.map((section) => ({ slug: section.slug, name: section.name }))}
          stories={newsRows}
          activeSection={activeSection}
        />
        <BlogSection posts={articleTeasers} />
      </div>

      {/* Comparison · Tier 2/3 — CTA-bearing, one primary-domain entry per list.
          The methodology closes the group instead of splitting the two lists. */}
      <div className="flex flex-col gap-5">
        {sportsbooks && rankedSportsbooks.length > 0 && (
          <RankedListSection
            title={`Top-Rated ${sportsbooks.name}`}
            operators={rankedSportsbooks.map((review) => rankedRow(review, sportsbooks.slug))}
            action={{
              href: `/reviews/${sportsbooks.slug}`,
              label: `All ${sportsbooks.noun} reviews`,
            }}
          />
        )}
        {casinos && rankedCasinos.length > 0 && (
          <RankedListSection
            title={`Top-Rated ${casinos.name}`}
            operators={rankedCasinos.map((review) => rankedRow(review, casinos.slug))}
            action={{ href: `/reviews/${casinos.slug}`, label: `All ${casinos.noun} reviews` }}
          />
        )}
        {/* TODO(cms): EditorialByline — the reviewer quote that sat here ran on a
            sample fixture; it needs a real Person record (photo, fullName,
            credential, quote) before it can go back on a live route. */}
        <ReviewCard />
      </div>

      <div className="flex flex-col gap-5">
        <FeaturedBonusesCard offers={bonusOffers} />
        {/* TODO(cms): ComparisonCard reads lib fixtures — the operator-column
            keying half of MIGRATION.md D2 is not decided yet. */}
        <ComparisonCard />
      </div>

      {/* Context and navigation · Tier 1 — internal links only */}
      <div className="flex flex-col gap-5">
        <MarketCard stats={marketStats.stats ?? []} />
        <ExploreSection verticals={verticals} />
        {/* TODO(cms): toolboxItems has no Payload source — the tools are routes
            that do not exist yet, not records. */}
        <BettingToolboxSection />
      </div>

      {/* TODO(cms): "As Featured In" media placements — omitted entirely; no logo
          placeholders and no "as seen in" strip until a real placement exists. */}
    </PageShell>
  );
}
