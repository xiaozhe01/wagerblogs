import type { Author, Operator, Post } from "./types";

// Placeholder content only — nothing here is a real trust signal.
// Author bylines, operator identities, and scores below are fictional
// stand-ins for CMS content that doesn't exist yet (see
// docs/03-claude-design-handoff-prompt.md Message 1.5 for the same
// "obviously fictional" convention). Never promote this data onto a real
// launch without replacing every field with sourced, real content.

export const mockAuthor: Author = {
  id: "author-placeholder-1",
  slug: "jane-placeholder",
  name: "Jane Placeholder",
  credentialLine: "Example Analyst — placeholder author, not a real byline",
  photoUrl: "",
};

export const mockPosts: Post[] = [
  {
    id: "post-1",
    slug: "how-odds-boosts-actually-work",
    title: "How Odds Boosts Actually Work (And When They're Worth It)",
    excerpt:
      "A plain-language breakdown of boosted-odds promos and the math behind them — placeholder Tier 1 content, no outbound link.",
    linkTier: "tier1",
    author: mockAuthor,
    publishedAt: "2026-06-01",
    updatedAt: "2026-07-15",
  },
  {
    id: "post-2",
    slug: "reading-a-sportsbook-terms-page",
    title: "What to Actually Read on a Sportsbook's Terms Page",
    excerpt:
      "Placeholder Tier 1 explainer — pure editorial, deliberately has no primary-domain link.",
    linkTier: "tier1",
    author: mockAuthor,
    publishedAt: "2026-05-20",
    updatedAt: "2026-05-20",
  },
  {
    id: "post-3",
    slug: "examplebet-welcome-offer-breakdown",
    title: "ExampleBet's Welcome Offer, Broken Down",
    excerpt:
      "Placeholder Tier 2 comparison post — this is the shape a real embedded-link article would take.",
    linkTier: "tier2",
    primaryDomainLink: {
      anchorText: "ExampleBet welcome offer",
      url: "https://example.com",
      relAttribute: "sponsored",
    },
    author: mockAuthor,
    publishedAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
];

// Ranked Sportsbooks — one placeholder "primary domain" entry
// (ExampleBet, isPrimaryDomain: true) plus fictional competitors.
// example.com is the RFC 2606 reserved placeholder domain — never a real
// operator URL.
export const mockRankedSportsbooks: Operator[] = [
  {
    id: "op-examplebet",
    name: "ExampleBet",
    score: 9.1,
    categoryScores: [
      { label: "Odds", score: 9.3 },
      { label: "App", score: 9.0 },
      { label: "Payouts", score: 8.9 },
    ],
    advantages: [
      "Placeholder advantage copy — fast payouts",
      "Placeholder advantage copy — deep same-game parlay markets",
    ],
    lastVerified: "2026-08-01",
    terms: "Placeholder terms small print. 21+. Gambling problem? Call 1-800-GAMBLER.",
    isPrimaryDomain: true,
    primaryDomainLink: {
      anchorText: "Visit ExampleBet",
      url: "https://example.com",
      relAttribute: "sponsored",
    },
  },
  {
    id: "op-northline",
    name: "Northline Sports (placeholder competitor)",
    score: 8.7,
    categoryScores: [
      { label: "Odds", score: 8.6 },
      { label: "App", score: 8.9 },
      { label: "Payouts", score: 8.5 },
    ],
    advantages: [
      "Placeholder advantage copy — wide market coverage",
      "Placeholder advantage copy — strong live-betting UI",
    ],
    lastVerified: "2026-07-28",
    terms: "Placeholder terms small print. 21+. Gambling problem? Call 1-800-GAMBLER.",
    isPrimaryDomain: false,
  },
  {
    id: "op-harborbet",
    name: "Harbor Bet (placeholder competitor)",
    score: 8.4,
    categoryScores: [
      { label: "Odds", score: 8.2 },
      { label: "App", score: 8.3 },
      { label: "Payouts", score: 8.6 },
    ],
    advantages: [
      "Placeholder advantage copy — generous loyalty program",
      "Placeholder advantage copy — same-day withdrawals",
    ],
    lastVerified: "2026-07-30",
    terms: "Placeholder terms small print. 21+. Gambling problem? Call 1-800-GAMBLER.",
    isPrimaryDomain: false,
  },
  {
    id: "op-fieldhouse",
    name: "Fieldhouse Wager (placeholder competitor)",
    score: 8.1,
    categoryScores: [
      { label: "Odds", score: 7.9 },
      { label: "App", score: 8.2 },
      { label: "Payouts", score: 8.1 },
    ],
    advantages: [
      "Placeholder advantage copy — low min. deposit",
      "Placeholder advantage copy — clean prop-bet builder",
    ],
    lastVerified: "2026-07-22",
    terms: "Placeholder terms small print. 21+. Gambling problem? Call 1-800-GAMBLER.",
    isPrimaryDomain: false,
  },
  {
    id: "op-summitplay",
    name: "Summit Play (placeholder competitor)",
    score: 7.8,
    categoryScores: [
      { label: "Odds", score: 7.7 },
      { label: "App", score: 7.6 },
      { label: "Payouts", score: 8.0 },
    ],
    advantages: [
      "Placeholder advantage copy — simple onboarding",
      "Placeholder advantage copy — frequent odds boosts",
    ],
    lastVerified: "2026-07-10",
    terms: "Placeholder terms small print. 21+. Gambling problem? Call 1-800-GAMBLER.",
    isPrimaryDomain: false,
  },
];

// Comparison Table — 3 operators, first is the primary domain.
export const mockComparisonOperators: Operator[] = mockRankedSportsbooks.slice(0, 3);

// Ranked Casinos — same placeholder-domain convention as above, "Crownline
// Coins" as the placeholder primary-domain entry. Added to give the
// homepage's casino ranked list typed data of its own instead of an ad hoc
// local shape (see .claude/dry-audit.md DRY-7).
export const mockRankedCasinos: Operator[] = [
  {
    id: "op-crownline",
    name: "Crownline Coins",
    score: 9.6,
    categoryScores: [
      { label: "Game Variety", score: 9.7 },
      { label: "Redemptions", score: 9.5 },
      { label: "SC Offers", score: 9.6 },
    ],
    advantages: [
      "Placeholder advantage copy — top-rated sweeps casino",
      "Placeholder advantage copy — excellent free SC offers",
      "Placeholder advantage copy — fast redemptions",
    ],
    lastVerified: "2026-08-01",
    terms:
      "Placeholder terms small print. 18+/21+ where required. No purchase necessary, void where prohibited.",
    isPrimaryDomain: true,
    primaryDomainLink: {
      anchorText: "Visit Crownline Coins",
      url: "https://example.com",
      relAttribute: "sponsored",
    },
  },
  {
    id: "op-spinfrontier",
    name: "SpinFrontier (placeholder competitor)",
    score: 9.2,
    categoryScores: [
      { label: "Game Variety", score: 9.3 },
      { label: "Redemptions", score: 9.0 },
      { label: "SC Offers", score: 9.1 },
    ],
    advantages: [
      "Placeholder advantage copy — excellent average RTP",
      "Placeholder advantage copy — free-to-play games",
    ],
    lastVerified: "2026-07-28",
    terms:
      "Placeholder terms small print. 18+/21+ where required. No purchase necessary, void where prohibited.",
    isPrimaryDomain: false,
  },
  {
    id: "op-stakeharbor",
    name: "StakeHarbor (placeholder competitor)",
    score: 9.0,
    categoryScores: [
      { label: "Game Variety", score: 9.1 },
      { label: "Redemptions", score: 8.9 },
      { label: "SC Offers", score: 9.0 },
    ],
    advantages: [
      "Placeholder advantage copy — crypto-friendly casino",
      "Placeholder advantage copy — daily free coin claims",
    ],
    lastVerified: "2026-07-30",
    terms:
      "Placeholder terms small print. 18+/21+ where required. No purchase necessary, void where prohibited.",
    isPrimaryDomain: false,
  },
];
