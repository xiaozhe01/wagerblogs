import type {
  Author,
  BonusOffer,
  ComparisonOperator,
  HelpDirectoryRegion,
  NewsItem,
  Operator,
  PostTeaser,
  PrimaryDomainLinkData,
} from "./types";

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
  credentialLine: "Example Analyst, Example Credential Body",
  photoUrl: "",
  bio: "[Placeholder short bio — what this author covers and why they are qualified to cover it.]",
};

export const authorStandards = [
  {
    title: "Tested, not summarised",
    body: "Operator claims are checked against our own deposits, wagers, and withdrawals before they appear in a score.",
  },
  {
    title: "Sources named",
    body: "Every figure carries a named source and the period it covers, or it does not run.",
  },
  {
    title: "Corrections published",
    body: "Errors are corrected in the open with a dated note, not silently edited away.",
  },
];

// Ranked Sportsbooks — one placeholder "primary domain" entry
// (ExampleBet, isPrimaryDomain: true) plus fictional competitors.
// example.com is the RFC 2606 reserved placeholder domain — never a real
// operator URL.
export const mockRankedSportsbooks: Operator[] = [
  {
    id: "op-examplebet",
    slug: "examplebet",
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
      anchorText: "Visit",
      url: "https://example.com",
      relAttribute: "sponsored",
    },
  },
  {
    id: "op-northline",
    slug: "northline-sports",
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
    slug: "harbor-bet",
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
    slug: "fieldhouse-wager",
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
    slug: "summit-play",
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

// Ranked Casinos — same placeholder-domain convention as above, "Crownline
// Coins" as the placeholder primary-domain entry.
export const mockRankedCasinos: Operator[] = [
  {
    id: "op-crownline",
    slug: "crownline-coins",
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
      anchorText: "Visit",
      url: "https://example.com",
      relAttribute: "sponsored",
    },
  },
  {
    id: "op-spinfrontier",
    slug: "spinfrontier",
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
    slug: "stakeharbor",
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

// Single source for the score breakdown, pros/cons and outbound-link data the
// operator review renders. Reachable at /reviews/sportsbooks/peakwager but kept
// out of the ranked list, which already has its one primary-domain entry.
export const mockPeakWagerReview: Operator = {
  id: "op-peakwager",
  slug: "peakwager",
  name: "PeakWager Sportsbook",
  score: 9.4,
  categoryScores: [
    { label: "Odds", score: 9.2 },
    { label: "App", score: 9.4 },
    { label: "Payouts", score: 9.0 },
    { label: "Markets", score: 9.5 },
    { label: "Support", score: 8.9 },
    { label: "Trust", score: 9.3 },
  ],
  advantages: [],
  lastVerified: "2026-06-30",
  terms: "Placeholder terms small print. 21+. Gambling problem? Call 1-800-GAMBLER.",
  isPrimaryDomain: true,
  primaryDomainLink: {
    anchorText: "Visit PeakWager",
    url: "https://example.com",
    relAttribute: "sponsored",
  },
  pros: [
    "[Placeholder] Deepest same-game parlay market of the three",
    "[Placeholder] Withdrawals cleared in 1–3 days in testing",
    "[Placeholder] Live betting stays available late in games",
    "[Placeholder] Live in 26 states",
  ],
  cons: [
    "[Placeholder] Odds boosts are thinner than the category average",
    "[Placeholder] No casino product in several states",
    "[Placeholder] Support is chat-only after 10pm ET",
    "[Placeholder] Bonus wagering terms are stricter than average",
  ],
};

export const reviewRelated: PostTeaser[] = [
  {
    kicker: "Comparison",
    title: "Northline Sports review",
    meta: "Reviews · 8.7 / 10 editorial",
    href: "/reviews/sportsbooks/northline-sports",
  },
  {
    kicker: "Comparison",
    title: "Harbor Bet review",
    meta: "Reviews · 8.4 / 10 editorial",
    href: "/reviews/sportsbooks/harbor-bet",
  },
  {
    kicker: "Guide",
    title: "How we score payout speed",
    meta: "Article · Tier 1 surface",
    href: "/articles/parlays-vs-straight-bets",
  },
];

// app/articles/[slug]/page.tsx (sample article) content.
// TODO(cms): becomes the post record fetched by slug — title/kicker/dates/author
// all flow from this one object into metadata, breadcrumbs, H1, and the byline
// (mirroring how the reviews templates consume mockPeakWagerReview).
export const blogToc = [
  { label: "Reading the number", href: "#reading-the-number" },
  { label: "The worked example", href: "#the-worked-example" },
  { label: "Common mistakes", href: "#common-mistakes" },
  { label: "What this means for your bets", href: "#what-this-means" },
];

// Tier 1 → Tier 2/3 internal link surface — no operator links, scores, or CTAs on this route.
export const categoryCompareLinks: PostTeaser[] = [
  {
    kicker: "Tier 2 surface",
    title: "Side-by-side operator comparison",
    meta: "Side-by-side scores, payouts, and market depth.",
    href: "/reviews/sportsbooks",
  },
  {
    kicker: "Tier 2 surface",
    title: "Operator reviews in this category",
    meta: "Individual reviews with tested figures and verified dates.",
    href: "/reviews",
  },
  {
    kicker: "Tier 1 surface",
    title: "How we score operators",
    meta: "The criteria behind every number we publish.",
    href: "/about",
  },
];

// app/legal/[doc]/page.tsx content. TODO(cms): counsel-reviewed copy required before
// publish — every section body below is placeholder text; each document must stay in
// draft until a LegalReview record exists (reviewerName, firmOrBar, reviewedAt,
// documentVersion).
export const legalDocs = {
  "privacy-policy": {
    title: "Privacy Policy",
    intro:
      "[Placeholder intro — what data this site collects, why, and the rights readers have over it. Written to be readable before it is legal.]",
    summary:
      "[Placeholder plain-language summary — we collect little, we sell nothing, analytics are aggregate, and you can ask for deletion at any time.]",
    sections: [
      {
        title: "What we collect",
        body: "[Placeholder section text — categories of data, collection methods, and what is never collected.]",
      },
      {
        title: "How we use it",
        body: "[Placeholder section text — purposes, legal bases, and retention periods.]",
      },
      {
        title: "Cookies & analytics",
        body: "[Placeholder section text — what runs, what it records, and how to opt out; cross-links the Cookie Policy.]",
      },
      {
        title: "Sharing & processors",
        body: "[Placeholder section text — who receives data, under what agreements, and where it is stored.]",
      },
      {
        title: "Your rights",
        body: "[Placeholder section text — access, correction, deletion, portability, and how to exercise each.]",
      },
      {
        title: "Changes to this policy",
        body: "[Placeholder section text — how changes are announced and where the change log lives.]",
      },
    ],
  },
  "terms-of-service": {
    title: "Terms of Service",
    intro: "[Placeholder intro — the agreement covering use of this site and its content.]",
    summary:
      "[Placeholder plain-language summary — the site is editorial information for adults 21+, not betting advice; content accuracy is best-effort.]",
    sections: [
      {
        title: "Who may use this site",
        body: "[Placeholder section text — age and jurisdiction requirements.]",
      },
      {
        title: "Nature of the content",
        body: "[Placeholder section text — editorial information, not professional or financial advice; odds and terms change.]",
      },
      {
        title: "Intellectual property",
        body: "[Placeholder section text — ownership of content and permitted use.]",
      },
      {
        title: "Third-party sites",
        body: "[Placeholder section text — operator sites are governed by their own terms; we are not a party to any wager.]",
      },
      {
        title: "Limitation of liability",
        body: "[Placeholder section text — the standard limitation clause, counsel-drafted.]",
      },
      {
        title: "Governing law & disputes",
        body: "[Placeholder section text — jurisdiction and dispute process.]",
      },
    ],
  },
  "affiliate-disclosure": {
    title: "Affiliate Disclosure",
    intro:
      "[Placeholder intro — exactly how this site makes money, stated before anything else on the page.]",
    summary:
      "[Placeholder plain-language summary — operators pay us commission when readers sign up through our links; they cannot pay for placement, scores, or coverage; every paid link is marked.]",
    sections: [
      {
        title: "How commission works",
        body: "[Placeholder section text — the affiliate model, in one paragraph a reader can repeat back.]",
      },
      {
        title: "What money cannot buy",
        body: "[Placeholder section text — placement, scores, verdicts, and coverage decisions are not for sale.]",
      },
      {
        title: "How paid links are marked",
        body: "[Placeholder section text — rel attributes, visible disclosure lines, and where they appear.]",
      },
      {
        title: "How rankings are produced",
        body: "[Placeholder section text — cross-links the public methodology page.]",
      },
      {
        title: "Conflicts of interest",
        body: "[Placeholder section text — ownership interests, if any, and how they are disclosed.]",
      },
    ],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    intro:
      "[Placeholder intro — what is stored on your device by this site and how to control it.]",
    summary:
      "[Placeholder plain-language summary — a short list of cookies, what each does, and a one-click way to refuse the optional ones.]",
    sections: [
      {
        title: "What cookies are",
        body: "[Placeholder section text — brief, plain definition.]",
      },
      {
        title: "Cookies we set",
        body: "[Placeholder section text — table of first-party cookies: name, purpose, lifetime.]",
      },
      {
        title: "Third-party cookies",
        body: "[Placeholder section text — analytics and affiliate-attribution cookies, with links to each provider's policy.]",
      },
      {
        title: "Managing preferences",
        body: "[Placeholder section text — the consent banner, browser settings, and what breaks without each cookie.]",
      },
    ],
  },
} as const;

// app/responsible-gambling/page.tsx content.
export const rgWarningSigns = [
  "Betting more than you planned, more often than you planned",
  "Chasing losses with bigger stakes",
  "Hiding how much you bet from people close to you",
  "Borrowing money or selling things to keep betting",
  "Feeling restless or irritable when you cut back",
  "Betting to escape stress, low mood or boredom",
];

// Screening questions moved to lib/self-assessment.ts — they are now the real,
// credited NODS instrument rather than placeholders, so they no longer belong in
// this file (see the DRY-4 split rule: this file is placeholder content only).

export const rgTools = [
  {
    title: "Deposit limits",
    body: "A cap on what you can pay in per day, week or month. Every licensed operator has to offer them, and they take effect immediately. Increases are the ones that wait.",
  },
  {
    title: "Time-outs",
    body: "A short break, usually 24 hours to 30 days, set from your account settings. Open bets stand and your balance stays put — you just can't stake again until it lifts.",
  },
  {
    title: "Self-exclusion",
    body: "A longer bar, from one year to permanent. At operator level it covers one account; through the state register it covers every licensed site at once.",
  },
  {
    title: "Blocking software",
    body: "Blockers that remove gambling sites and apps at the device level. They catch far more than willpower does, but they don't cover a phone you haven't installed them on.",
  },
];

export const rgCommitments = [
  "Every page that lists an operator carries a route to this one. No exceptions.",
  "We don't target promotions at anyone who arrives through responsible-gambling content.",
  "Everything here is written for readers of legal gambling age, and bonus copy always carries the full terms.",
  "Commission never changes a score, and no operator can pay to soften this page.",
];

export const rgToc = [
  { label: "Warning signs", href: "#warning-signs" },
  { label: "Self-check", href: "#self-check" },
  { label: "Limit-setting tools", href: "#tools" },
  { label: "Where to get help", href: "#get-help" },
  { label: "Self-exclusion by state", href: "#self-exclusion" },
];

// Seed input for help-directory-entries, and nothing else reads it — the page
// itself is Payload-backed.
//
// Deliberately empty since 2026-09-28. It held six bracketed placeholders which
// an editor had already replaced, in the admin, with the six real organisations
// now in the database. The seed keys "already exists" on name + country, could
// not match them under their real names, and recreated all six on every run —
// the rename-defeats-idempotency failure CONTENT-BACKLOG.md describes. Emptying
// it makes the seed a no-op for this collection, which is what keeps the
// deletion from coming back.
//
// The cost: the seed can no longer rebuild this collection from scratch. That is
// the accepted trade until `seedSource` lands. Do not repopulate this with
// placeholder organisations — a bracketed helpline is the one placeholder class
// that must never reach a live route.
//
// Coverage note: the six real records cover north-america, uk-ireland and
// europe, two each. asia-pacific, latin-america and middle-east-africa are
// options on the collection with no entry at all — a real gap, and one the
// deleted placeholders never filled either.
export const helpDirectory: HelpDirectoryRegion[] = [];

// components/Comments.tsx sample comments.
// TODO(cms): Tier 3 review routes only — in production this component should return
// null on Tier 1 (editorial) templates, and live routes should start in the
// signed-out/empty state. The populated sample below is static placeholder content
// for visual reference only — not wired to auth, moderation, or a comments API.
export const sampleComments = [
  {
    username: "Sample User One",
    date: "[MM/DD/YYYY]",
    text: "[Fictional example comment — reference only. Payout timing matched the review in my case.]",
  },
  {
    username: "Sample User Two",
    date: "[MM/DD/YYYY]",
    text: "[Fictional example comment — reference only. Would add that the app slows during live games.]",
  },
  {
    username: "Sample User Three",
    date: "[MM/DD/YYYY]",
    text: "[Fictional example comment — reference only. Moderation declined my first draft for an operator link.]",
  },
];

// Moved from lib/site-data.ts (DRY-4): site-data.ts is structure/taxonomy
// only (nav, footer, legal links, category/region/filter lists); everything
// below is content and belongs here instead.

export const bonusOffers: BonusOffer[] = [
  {
    name: "PeakWager",
    headline: "Bet $5 Get $200 in Bonus Bets",
    code: "PEAK200",
    benefits: [
      "[Placeholder benefit copy — fast payouts]",
      "[Placeholder benefit copy — deep same-game parlay markets]",
    ],
    isPrimaryDomain: true,
    primaryDomainLink: {
      anchorText: "Claim Offer",
      url: "https://example.com",
      relAttribute: "sponsored",
    },
  },
  {
    name: "BlueHorizon Bet",
    headline: "10x $100 Bet Match Bonus",
    code: "BLUE100",
    benefits: [
      "[Placeholder benefit copy — wide market coverage]",
      "[Placeholder benefit copy — strong live-betting UI]",
    ],
    isPrimaryDomain: false,
    operatorLink: { anchorText: "Claim Offer", url: "https://example.com" },
  },
  {
    name: "Crownline Coins",
    headline: "1.5M Coins + 75 Free SC",
    code: "CROWN75",
    benefits: [
      "[Placeholder benefit copy — free-to-play sweepstakes games]",
      "[Placeholder benefit copy — fast SC redemptions]",
    ],
    isPrimaryDomain: false,
    operatorLink: { anchorText: "Claim Offer", url: "https://example.com" },
  },
  {
    name: "IronStake Sports",
    headline: "Double Your First 10 Wagers",
    code: "IRONX2",
    benefits: [
      "[Placeholder benefit copy — low minimum deposit]",
      "[Placeholder benefit copy — frequent odds boosts]",
    ],
    isPrimaryDomain: false,
    operatorLink: { anchorText: "Claim Offer", url: "https://example.com" },
  },
];

export const methodSteps = [
  "Hands-on testing with real deposits",
  "Same criteria for every operator",
  "Scores benchmarked to the market leader",
  "Re-verified when odds, apps, or payouts change",
];

export const operators: ComparisonOperator[] = [
  {
    name: "PeakWager",
    isPrimaryDomain: true,
    primaryDomainLink: {
      anchorText: "Visit PeakWager",
      url: "https://example.com",
      relAttribute: "sponsored",
    } as PrimaryDomainLinkData,
  },
  {
    name: "Northline Sports",
    isPrimaryDomain: false,
    operatorLink: {
      anchorText: "Visit Northline Sports",
      url: "https://example.com",
    },
  },
  {
    name: "Harbor Bet",
    isPrimaryDomain: false,
    operatorLink: {
      anchorText: "Visit Harbor Bet",
      url: "https://example.com",
    },
  },
];

export const compareRows = [
  { id: "live-betting", label: "Live Betting", values: ["Yes", "Yes", "Limited"] },
  { id: "same-game-parlay", label: "Same-Game Parlay", values: ["Yes", "Yes", "Yes"] },
  { id: "casino-cross-sell", label: "Casino Cross-Sell", values: ["Yes", "No", "Yes"] },
  { id: "payout-speed", label: "Payout Speed", values: ["1-3 days", "2-5 days", "1-3 days"] },
  {
    id: "welcome-bonus",
    label: "Welcome Bonus",
    values: ["Bet $5/$200", "10x $100", "Bet $5/$150"],
  },
];

export const newsFeed: NewsItem[] = [
  {
    title: "[Placeholder headline — Football]",
    excerpt:
      "[Placeholder dek — two lines summarising the story, written to work on its own in a feed row, in search, and in a social preview.]",
    meta: "Football · 07/20/2026 · by [author] · 5 min",
    category: "Football",
    publishedAt: "[Jul 20, 2026]",
    readTime: "5 min read",
  },
  {
    title: "[Placeholder headline — Basketball]",
    excerpt:
      "[Placeholder dek — what happened and why a bettor should care, in two lines that stand without the headline.]",
    meta: "Basketball · 07/19/2026 · by [author] · 3 min",
    category: "Basketball",
    publishedAt: "[Jul 19, 2026]",
    readTime: "3 min read",
  },
  {
    title: "[Placeholder headline — Soccer interview]",
    excerpt:
      "[Placeholder dek — who was interviewed, on what, and the line worth reading the piece for.]",
    meta: "Soccer · 07/18/2026 · by [author] · 4 min",
    category: "Soccer",
    publishedAt: "[Jul 18, 2026]",
    readTime: "4 min read",
  },
  {
    title: "[Placeholder headline — Esports]",
    excerpt:
      "[Placeholder dek — the roster, patch, or market move behind the story, summarised in two lines.]",
    meta: "Esports · 07/17/2026 · by [author] · 3 min",
    category: "Esports",
    publishedAt: "[Jul 17, 2026]",
    readTime: "3 min read",
  },
  {
    title: "[Placeholder headline — Football injury report]",
    excerpt:
      "[Placeholder dek — who is out, who is questionable, and how the lines have moved since the report landed.]",
    meta: "Football · 07/14/2026 · by [author] · 4 min",
    category: "Football",
    publishedAt: "[Jul 14, 2026]",
    readTime: "4 min read",
  },
  {
    title: "[Placeholder headline — Basketball trade deadline]",
    excerpt:
      "[Placeholder dek — the move, the roster it reshapes, and what the futures market did next.]",
    meta: "Basketball · 07/13/2026 · by [author] · 6 min",
    category: "Basketball",
    publishedAt: "[Jul 13, 2026]",
    readTime: "6 min read",
  },
  {
    title: "[Placeholder headline — Soccer transfer window]",
    excerpt: "[Placeholder dek — the signing, the fee, and the title-odds shift that followed it.]",
    meta: "Soccer · 07/12/2026 · by [author] · 5 min",
    category: "Soccer",
    publishedAt: "[Jul 12, 2026]",
    readTime: "5 min read",
  },
  {
    title: "[Placeholder headline — Esports patch notes]",
    excerpt:
      "[Placeholder dek — the balance change, the teams it favours, and where the map handicaps repriced.]",
    meta: "Esports · 07/11/2026 · by [author] · 4 min",
    category: "Esports",
    publishedAt: "[Jul 11, 2026]",
    readTime: "4 min read",
  },
  {
    title: "[Placeholder headline — Industry regulation]",
    excerpt:
      "[Placeholder dek — the ruling, which operators it binds, and what changes for bettors in the affected states.]",
    meta: "Industry · 07/16/2026 · by [author] · 6 min",
    category: "Industry",
    publishedAt: "[Jul 16, 2026]",
    readTime: "6 min read",
  },
  {
    title: "[Placeholder headline — Industry market entry]",
    excerpt:
      "[Placeholder dek — who launched where, under whose licence, and how the competitive field shifts.]",
    meta: "Industry · 07/10/2026 · by [author] · 4 min",
    category: "Industry",
    publishedAt: "[Jul 10, 2026]",
    readTime: "4 min read",
  },
];

// TODO(cms): a per-story Person record (photo, fullName, credential, authorUrl);
// Article schema needs author.name + author.url before a story can publish.
export const newsStoryAuthor = {
  name: "Jane Placeholder",
  credential: "Example Reporter, Example Credential Body",
  // Derived: the author route 404s on an unknown slug, so a literal path here
  // would break on a rename.
  profileHref: `/authors/${mockAuthor.slug}`,
};

export const toolboxItems = [
  {
    title: "Betting guides",
    desc: "Bet types, strategy, and state rules explained.",
    href: "/articles",
  },
  {
    title: "Market research",
    desc: "Team form, injuries, and matchup trend data.",
    href: "/articles",
  },
  {
    title: "State statistics",
    desc: "Handle, revenue, and tax data by market.",
    href: "/categories",
  },
  {
    title: "Compare sites",
    desc: "Side-by-side operator and bonus comparisons.",
    href: "/reviews",
  },
];

// From Component-Reference-Filled-States.dc.html — fictional-by-design fixtures.
// TODO(cms): SourcedStat[] — each figure needs a real source + period, or it is
// dropped from the strip entirely (never shown uncited).
export const marketStats = [
  {
    value: "$00.0B",
    label: "Example annual handle metric",
    source: "Source: [Example State Commission]",
    period: "Period: [FY 0000]",
  },
  {
    value: "00",
    label: "Example count of legal markets",
    source: "Source: [Example Industry Tracker]",
    period: "As of: [month 0000]",
  },
  {
    value: "+0%",
    label: "Example year-over-year change",
    source: "Source: [Example Regulator Report]",
    period: "Period: [0000 vs 0000]",
  },
  {
    value: "00%",
    label: "Example average rate metric",
    source: "Source: [Example Tax Filing Data]",
    period: "As of: [month 0000]",
  },
];

// TODO(cms): query latest Tier 1 posts, limit 3, ISR-revalidated — never hardcoded.
// Tier 2/3 entries must be excluded by filter so no ranked lists or operator links
// can surface on a 404.
export const recentPosts: PostTeaser[] = [
  {
    kicker: "Guide",
    title: "[Dynamic — latest Tier 1 post 1]",
    excerpt: "[Dynamic — the post's own dek, two lines, from the CMS excerpt field.]",
    meta: "[date] · [n] min · byline required",
    metaItems: ["[n] min read", "[date]", "byline required"],
    href: "/articles/how-odds-boosts-actually-work",
  },
  {
    kicker: "Analysis",
    title: "[Dynamic — latest Tier 1 post 2]",
    excerpt: "[Dynamic — the post's own dek, two lines, from the CMS excerpt field.]",
    meta: "[date] · [n] min · byline required",
    metaItems: ["[n] min read", "[date]", "byline required"],
    href: "/articles/bankroll-management-101",
  },
  {
    kicker: "Research",
    title: "[Dynamic — latest Tier 1 post 3]",
    excerpt: "[Dynamic — the post's own dek, two lines, from the CMS excerpt field.]",
    meta: "[date] · [n] min · byline required",
    metaItems: ["[n] min read", "[date]", "byline required"],
    href: "/articles/parlays-vs-straight-bets",
  },
];

// TODO(cms): verify against a real, current helpline number before launch.
// TODO(cms): a verified helpline number, rendered as an explicit tel: link —
// which also stops iOS Safari's data detectors from linkifying it themselves.
// Deliberately not digit-shaped until then: anything phone-like here is rewritten
// before hydration, which fails hydration and regenerates the tree on the client.
export const helplineNumber = "[helpline number — verify before launch]";
