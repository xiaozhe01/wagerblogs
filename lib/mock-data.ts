import type {
  Author,
  AtAGlanceItem,
  BonusOffer,
  ComparisonOperator,
  NewsItem,
  Operator,
  Post,
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

export const authorBeats = [
  "Odds & pricing",
  "Regulation",
  "Esports betting",
  "Bonus terms",
  "Payout testing",
];

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

export const authorArticles: PostTeaser[] = [
  {
    kicker: "Guide",
    title: "[Placeholder] How moneylines actually work",
    meta: "Blog · 07/18/2026 · 9 min",
    href: "/blog/sample-1",
  },
  {
    kicker: "Analysis",
    title: "[Placeholder] What changed in state betting law this quarter",
    meta: "News · 07/16/2026 · 6 min",
    href: "/news",
  },
  {
    kicker: "Review",
    title: "[Placeholder] PeakWager Sportsbook review",
    meta: "Reviews · 07/12/2026 · 12 min",
    href: "/reviews/peakwager",
  },
  {
    kicker: "Guide",
    title: "[Placeholder] Bankroll management 101",
    meta: "Blog · 07/05/2026 · 7 min",
    href: "/blog/sample-2",
  },
];

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
      anchorText: "Visit",
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
      anchorText: "Visit",
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

// Shared operator record for both app/reviews/[slug] templates (the quick
// review and the full-review/comparison variant) — single source for the
// score breakdown, pros/cons, and outbound-link data both pages render.
export const mockPeakWagerReview: Operator = {
  id: "op-peakwager",
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

// "Other books compared" rail list — identical in both reviews templates.
export const otherBooksCompared: { name: string; score: string }[] = [
  { name: "BlueHorizon Bet", score: "9.1" },
  { name: "IronStake Sports", score: "8.9" },
  { name: "Vantage Play", score: "8.7" },
  { name: "Northline Bet", score: "8.5" },
];

// app/reviews/[slug]/page.tsx (quick review template) content.
export const reviewReaderReviews = [
  {
    username: "[@somename]",
    meta: "[12/02/2026] · verified member",
    text: "[Placeholder reader review — what they tested, how payouts went, moderated before publish.]",
  },
  {
    username: "[@somename]",
    meta: "[04/05/2026] · verified member",
    text: "[Placeholder reader review — one account per operator; edits create a new moderation pass.]",
  },
];

export const reviewRelated: PostTeaser[] = [
  {
    kicker: "Comparison",
    title: "BlueHorizon Bet review",
    meta: "Reviews · 9.1 / 10 editorial",
    href: "/reviews/bluehorizon",
  },
  {
    kicker: "Comparison",
    title: "IronStake Sports review",
    meta: "Reviews · 8.9 / 10 editorial",
    href: "/reviews/ironstake",
  },
  {
    kicker: "Guide",
    title: "[Placeholder] How we score payout speed",
    meta: "Blog · Tier 1 surface",
    href: "/blog/sample",
  },
];

export const reviewAtAGlance: AtAGlanceItem[] = [
  { label: "Editorial score", value: "9.4 / 10" },
  { label: "Reader average", value: "[x.x] / 5" },
  { label: "States live", value: "[26]" },
  { label: "Payout speed", value: "[1–3 days]" },
  { label: "Last verified", value: "[Jun 30, 2026]" },
];

export const reviewTrustIndex = [
  {
    num: "1/3",
    label: "Editorial score",
    note: "Our tested verdict, named reviewer, public methodology.",
  },
  {
    num: "2/3",
    label: "Reader reviews",
    note: "First-party member reviews, moderated, never blended into 1/3.",
  },
  { num: "3/3", label: "Trustpilot", note: "Third-party; shown only with real profile data." },
];

// app/reviews/[slug]/page.tsx "Bonus detail" + FAQ content (merged in from
// the retired full-review template).
export const reviewBonusTerms = [
  { label: "Minimum deposit", value: "[$10]" },
  { label: "Wagering requirement", value: "[1x]" },
  { label: "Expiry", value: "[7 days]" },
  { label: "Eligible states", value: "[list required]" },
];

export const reviewFaqs = [
  {
    q: "[Placeholder] Is it legal in my state?",
    a: "[Placeholder answer — points at our state-by-state category page rather than making a blanket claim.]",
  },
  {
    q: "[Placeholder] How fast are withdrawals?",
    a: "[Placeholder answer — cites our own tested figures and the date they were verified.]",
  },
  {
    q: "[Placeholder] Does the bonus apply to every market?",
    a: "[Placeholder answer — defers to the operator terms, linked in full above.]",
  },
];

// app/blog/[slug]/page.tsx (sample blog post) content.
// TODO(cms): becomes the post record fetched by slug — title/kicker/dates/author
// all flow from this one object into metadata, breadcrumbs, H1, and the byline
// (mirroring how the reviews templates consume mockPeakWagerReview).
export const mockBlogPost = {
  slug: "sample-post",
  kicker: "Guides",
  title: "[Placeholder] How moneylines actually work — and what the numbers are telling you",
  publishedAt: "[Jul 18, 2026]",
  updatedAt: "[Jul 24, 2026]",
  readTime: "9 min read",
  author: {
    name: "Jane Placeholder",
    credential: "Example Analyst, Example Credential Body",
    profileHref: "/authors/jane-placeholder",
  },
};

export const blogToc = [
  { label: "Reading the number", href: "#reading-the-number" },
  { label: "The worked example", href: "#the-worked-example" },
  { label: "Common mistakes", href: "#common-mistakes" },
  { label: "What this means for your bets", href: "#what-this-means" },
];

export const blogBodyList = [
  "[Placeholder list item — first step of the worked example]",
  "[Placeholder list item — second step]",
  "[Placeholder list item — third step]",
  "[Placeholder list item — the result, stated plainly]",
];

export const blogTakeaways = [
  "[Placeholder takeaway — the single most useful thing a reader should leave with]",
  "[Placeholder takeaway — the most common misreading, corrected]",
  "[Placeholder takeaway — what to check before acting on this]",
];

export const blogRelated: PostTeaser[] = [
  {
    kicker: "Guide",
    title: "[Placeholder] Reading odds formats",
    meta: "Blog · 8 min read",
    href: "/blog/sample-2",
  },
  {
    kicker: "Comparison",
    title: "[Placeholder] Sportsbook comparison tool",
    meta: "Reviews · Tier 2 surface",
    href: "/reviews",
  },
  {
    kicker: "Category",
    title: "[Placeholder] Legal betting by state",
    meta: "Categories · Tier 2 surface",
    href: "/categories",
  },
];

export const blogMoreInGuides = [
  "[Placeholder] Bankroll management 101",
  "[Placeholder] Parlays vs straight bets",
  "[Placeholder] Understanding closing line value",
  "[Placeholder] How books set their prices",
];

// app/categories/[slug]/page.tsx (sample category) content.
export const sampleCategoryName = "Esports betting";

export const categoryArticles: PostTeaser[] = [
  {
    kicker: "Guide",
    title: "[Placeholder] Reading esports odds before a major",
    meta: "07/20/2026 · 8 min · byline required",
  },
  {
    kicker: "Analysis",
    title: "[Placeholder] Why map handicaps price differently",
    meta: "07/18/2026 · 6 min · byline required",
  },
  {
    kicker: "Research",
    title: "[Placeholder] Which titles hold liquidity out of season",
    meta: "07/15/2026 · 12 min · byline required",
  },
  {
    kicker: "News",
    title: "[Placeholder] A regulator opens consultation on esports markets",
    meta: "07/12/2026 · 4 min · byline required",
  },
];

export const categorySubCategories = [
  { name: "CS2", count: "[n] pieces" },
  { name: "League of Legends", count: "[n] pieces" },
  { name: "Valorant", count: "[n] pieces" },
  { name: "Dota 2", count: "[n] pieces" },
  { name: "Rocket League", count: "[n] pieces" },
  { name: "Call of Duty", count: "[n] pieces" },
];

// Tier 1 → Tier 2/3 internal link surface — no operator links, scores, or CTAs on this route.
export const categoryCompareLinks: PostTeaser[] = [
  {
    kicker: "Tier 2 surface",
    title: "Esports sportsbook comparison",
    meta: "Side-by-side scores, payouts, and market depth.",
    href: "/reviews",
  },
  {
    kicker: "Tier 2 surface",
    title: "Operator reviews in this category",
    meta: "Individual reviews with tested figures and verified dates.",
    href: "/reviews/sample-operator",
  },
  {
    kicker: "Tier 1 surface",
    title: "How we score esports books",
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
      { title: "What cookies are", body: "[Placeholder section text — brief, plain definition.]" },
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
  "[Placeholder] Betting more than planned, more often than planned",
  "[Placeholder] Chasing losses with bigger stakes",
  "[Placeholder] Hiding betting activity from people close to you",
  "[Placeholder] Borrowing money or selling things to bet",
  "[Placeholder] Feeling restless or irritable when not betting",
  "[Placeholder] Betting to escape stress, low mood, or boredom",
];

// Screening questions moved to lib/self-assessment.ts — they are now the real,
// credited NODS instrument rather than placeholders, so they no longer belong in
// this file (see the DRY-4 split rule: this file is placeholder content only).

export const rgTools = [
  {
    title: "Deposit limits",
    body: "[Placeholder] Every licensed operator must offer daily, weekly, and monthly deposit caps. How to set them and why lower is easier than you think.",
  },
  {
    title: "Time-outs",
    body: "[Placeholder] Short breaks from 24 hours to 30 days, applied instantly in account settings. What happens to open bets and balances.",
  },
  {
    title: "Self-exclusion",
    body: "[Placeholder] Longer bars of one to five years, or permanent. How operator-level and state-level exclusion differ.",
  },
  {
    title: "Blocking software",
    body: "[Placeholder] Device-level blockers that remove gambling sites and apps entirely. What they cover and what they miss.",
  },
];

// TODO(cms): every contact detail here is a verification gate — do not publish a
// row until the number/URL is confirmed against the organization's own site.
export const rgResources = [
  {
    name: "[National problem gambling helpline]",
    desc: "[Placeholder — free, confidential, 24/7 phone and text support; connects to state resources.]",
    contact: "[phone — verify]",
  },
  {
    name: "[Peer support fellowship]",
    desc: "[Placeholder — local and online meetings for people who want to stop gambling.]",
    contact: "[URL — verify]",
  },
  {
    name: "[Crisis line]",
    desc: "[Placeholder — immediate support for anyone in crisis, gambling-related or not.]",
    contact: "[phone/text — verify]",
  },
];

export const rgCommitments = [
  "[Placeholder] Every page that lists an operator also carries a route to this page — no exceptions.",
  "[Placeholder] We never target promotions at readers who arrive via responsible-gambling content.",
  "[Placeholder] All content is written for readers 21+, and bonus copy always carries full terms.",
  "[Placeholder] Commission never changes a score, and no operator can pay to soften this page.",
];

export const rgToc = [
  { label: "Warning signs", href: "#warning-signs" },
  { label: "Self-check", href: "#self-check" },
  { label: "Limit-setting tools", href: "#tools" },
  { label: "Where to get help", href: "#get-help" },
  { label: "Self-exclusion by state", href: "#self-exclusion" },
];

// app/responsible-gambling/help-directory/page.tsx content.
// TODO(cms): DirectoryEntry requires orgName, country, region, ≥1 contact, and a
// verifiedAt stamp — an entry never ships without it. Re-verification cadence:
// [90 days]; expired stamps re-enter the pending state and unpublish. Trimmed to a
// few sample entries per region here; the full set covers more countries/regions.
export const helpDirectory = [
  {
    region: "North America",
    entries: [
      {
        name: "[National problem gambling helpline — US]",
        country: "US",
        desc: "[Placeholder — 24/7 phone and text support; routes callers to state-level resources.]",
        contacts: [
          { kind: "phone", value: "[number — verify]" },
          { kind: "site", value: "[URL — verify]" },
        ],
      },
      {
        name: "[Provincial helpline network — Canada]",
        country: "CA",
        desc: "[Placeholder — per-province helplines and self-exclusion programs.]",
        contacts: [
          { kind: "phone", value: "[number — verify]" },
          { kind: "site", value: "[URL — verify]" },
        ],
      },
    ],
  },
  {
    region: "UK & Ireland",
    entries: [
      {
        name: "[National gambling helpline — UK]",
        country: "UK",
        desc: "[Placeholder — free 24/7 helpline and live chat, plus structured treatment referral.]",
        contacts: [
          { kind: "phone", value: "[number — verify]" },
          { kind: "chat", value: "[URL — verify]" },
        ],
      },
      {
        name: "[Problem gambling service — Ireland]",
        country: "IE",
        desc: "[Placeholder — counselling and residential treatment, publicly funded.]",
        contacts: [{ kind: "phone", value: "[number — verify]" }],
      },
    ],
  },
  {
    region: "Europe",
    entries: [
      {
        name: "[Federal addiction support — Germany]",
        country: "DE",
        desc: "[Placeholder — federal helpline with multilingual counselling.]",
        contacts: [{ kind: "phone", value: "[number — verify]" }],
      },
      {
        name: "[Support line — Nordics]",
        country: "SE / NO / DK",
        desc: "[Placeholder — shared Nordic helpline network with online programs.]",
        contacts: [
          { kind: "phone", value: "[number — verify]" },
          { kind: "chat", value: "[URL — verify]" },
        ],
      },
    ],
  },
];

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
  { name: "BlueHorizon Bet", isPrimaryDomain: false },
  { name: "IronStake Sports", isPrimaryDomain: false },
];

export const compareRows = [
  { label: "Live Betting", values: ["Yes", "Yes", "Limited"] },
  { label: "Same-Game Parlay", values: ["Yes", "Yes", "Yes"] },
  { label: "Casino Cross-Sell", values: ["Yes", "No", "Yes"] },
  { label: "Payout Speed", values: ["1-3 days", "2-5 days", "1-3 days"] },
  { label: "Welcome Bonus", values: ["Bet $5/$200", "10x $100", "Bet $5/$150"] },
];

export const newsFeed: NewsItem[] = [
  {
    title: "[Placeholder headline — Football]",
    meta: "Football · 07/20/2026 · by [author] · 5 min",
    category: "Football",
  },
  {
    title: "[Placeholder headline — Basketball]",
    meta: "Basketball · 07/19/2026 · by [author] · 3 min",
    category: "Basketball",
  },
  {
    title: "[Placeholder headline — Soccer interview]",
    meta: "Soccer · 07/18/2026 · by [author] · 4 min",
    category: "Soccer",
  },
  {
    title: "[Placeholder headline — Esports]",
    meta: "Esports · 07/17/2026 · by [author] · 3 min",
    category: "Esports",
  },
];

export const blogPosts = [
  {
    title: "[Placeholder] How moneylines actually work",
    excerpt: "A beginner walkthrough of reading odds before your first bet.",
    byline: "by [author] · 07/18/2026",
  },
  {
    title: "[Placeholder] Bankroll management 101",
    excerpt: "Simple rules for staking that keep betting sustainable.",
    byline: "by [author] · 07/12/2026",
  },
  {
    title: "[Placeholder] Parlays vs straight bets",
    excerpt: "When each bet type makes sense and what the math says.",
    byline: "by [author] · 07/05/2026",
  },
];

export const toolboxItems = [
  {
    title: "Betting guides",
    desc: "Bet types, strategy, and state rules explained.",
    href: "/blog",
  },
  { title: "Market research", desc: "Team form, injuries, and matchup trend data.", href: "/blog" },
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
    meta: "[date] · [n] min · byline required",
    href: "/blog/sample-post-1",
  },
  {
    kicker: "Analysis",
    title: "[Dynamic — latest Tier 1 post 2]",
    meta: "[date] · [n] min · byline required",
    href: "/blog/sample-post-2",
  },
  {
    kicker: "Research",
    title: "[Dynamic — latest Tier 1 post 3]",
    meta: "[date] · [n] min · byline required",
    href: "/blog/sample-post-3",
  },
];

// TODO(cms): analytics-driven, Tier 1 only.
// TODO(cms): trending list must come from real editorial/analytics data —
// never ship unmarked realistic headlines.
export const trendingHeadlines = [
  "[Placeholder headline — NFL week 1 lines]",
  "[Placeholder headline — new sweepstakes casino launch]",
  "[Placeholder headline — same-game parlay boosts]",
  "[Placeholder headline — Editor's Pick update]",
];

export const popular = [
  "[Dynamic — popular Tier 1 post 1]",
  "[Dynamic — popular Tier 1 post 2]",
  "[Dynamic — popular Tier 1 post 3]",
  "[Dynamic — popular Tier 1 post 4]",
];

// TODO(cms): verify against a real, current helpline number before launch.
export const helplineNumber = "1-800-XXX-XXXX";
export const helplineText = `Helpline: [${helplineNumber}]`;
