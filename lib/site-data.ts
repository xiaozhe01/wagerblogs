// Shared placeholder navigation/footer/legal data for the WagerBlogs scaffold.
// TODO(cms): every list here is a static stand-in. In the real build this comes from
// the CMS taxonomy / nav config — never hardcode routes that can drift from the CMS.
import type { PrimaryDomainLinkData } from "./types";

export type NavGroup = {
  id: string;
  label: string;
  href: string;
  glyph: string;
  subs: { label: string; href: string }[];
};

export const navGroups: NavGroup[] = [
  { id: "home", label: "Home", href: "/", glyph: "⌂", subs: [] },
  {
    id: "news",
    label: "News",
    href: "/news",
    glyph: "◷",
    subs: [
      { label: "Football", href: "/news" },
      { label: "Basketball", href: "/news" },
      { label: "Soccer", href: "/news" },
      { label: "Esports", href: "/news" },
      { label: "Industry", href: "/news" },
      { label: "All News →", href: "/news" },
    ],
  },
  {
    id: "reviews",
    label: "Reviews",
    href: "/reviews",
    glyph: "★",
    subs: [
      { label: "Sportsbooks", href: "/reviews" },
      { label: "Online Casinos", href: "/reviews" },
      { label: "Sweepstakes Casinos", href: "/reviews" },
      { label: "Bonuses & Offers", href: "/reviews" },
      { label: "All Reviews →", href: "/reviews" },
    ],
  },
  {
    id: "categories",
    label: "Categories",
    href: "/categories",
    glyph: "⊞",
    subs: [
      { label: "By Sport", href: "/categories" },
      { label: "By State", href: "/categories" },
      { label: "By Vertical", href: "/categories" },
      { label: "Market Search →", href: "/categories" },
    ],
  },
  {
    id: "blog",
    label: "Blog",
    href: "/blog",
    glyph: "✎",
    subs: [
      { label: "Guides", href: "/blog" },
      { label: "Strategy", href: "/blog" },
      { label: "Research", href: "/blog" },
      { label: "All Posts →", href: "/blog" },
    ],
  },
  {
    id: "more",
    label: "More",
    href: "/about",
    glyph: "⋯",
    subs: [
      { label: "About Us", href: "/about" },
      { label: "How We Review", href: "/about" },
      { label: "FAQ", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Responsible Gambling", href: "/responsible-gambling" },
      { label: "Disclaimer", href: "/legal/terms-of-service" },
    ],
  },
];

export const footerCols = [
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How We Review", href: "/about" },
      { label: "FAQ", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Content",
    links: [
      { label: "News", href: "/news" },
      { label: "Blog", href: "/blog" },
      { label: "Betting Site Reviews", href: "/reviews" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { label: "Categories", href: "/categories" },
      { label: "Compare by State", href: "/categories" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Responsible Gambling", href: "/responsible-gambling" },
      { label: "Help Directory", href: "/responsible-gambling/help-directory" },
      { label: "Disclaimer", href: "/legal/terms-of-service" },
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
    ],
  },
];

export const legalLinks = [
  { label: "Terms of Service", href: "/legal/terms-of-service" },
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Cookie Policy", href: "/legal/cookie-policy" },
  { label: "Affiliate Disclosure", href: "/legal/affiliate-disclosure" },
  { label: "Sitemap", href: "/legal/terms-of-service" },
];

export const legalParagraphs = [
  "Affiliate disclosure: [placeholder] WagerBlogs may receive compensation when readers sign up with operators listed on this site. Commission never affects our scores, rankings, or editorial verdicts.",
  "Age & eligibility: [placeholder] Content is intended for adults of legal gambling age in their jurisdiction. Availability of operators, bonuses, and markets varies by region and is subject to local law.",
  "Editorial independence: [placeholder] Ratings are produced by our review team using a published methodology. Operators cannot pay for placement, coverage, or a higher score.",
  "No guarantees: [placeholder] Odds, bonus terms, and payout times change frequently. Always confirm current terms on the operator site before wagering. Gambling involves financial risk and can be addictive.",
];

export const bonusOffers = [
  {
    name: "PeakWager",
    headline: "Bet $5 Get $200 in Bonus Bets",
    code: "PEAK200",
    isPrimaryDomain: true,
    primaryDomainLink: {
      anchorText: "Claim PeakWager Offer",
      url: "https://example.com",
      relAttribute: "sponsored",
    } as PrimaryDomainLinkData,
  },
  { name: "BlueHorizon Bet", headline: "10x $100 Bet Match Bonus", code: "BLUE100" },
  { name: "Crownline Coins", headline: "1.5M Coins + 75 Free SC", code: "CROWN75" },
  { name: "IronStake Sports", headline: "Double Your First 10 Wagers", code: "IRONX2" },
];

export const methodSteps = [
  "Hands-on testing with real deposits",
  "Same criteria for every operator",
  "Scores benchmarked to the market leader",
  "Re-verified when odds, apps, or payouts change",
];

export const operators = [
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

export const categories = [
  { name: "Sportsbooks", desc: "NFL, NBA, MLB & more" },
  { name: "Online Casinos", desc: "Slots & live dealer" },
  { name: "Esports Betting", desc: "CS2, LoL, Valorant" },
  { name: "Fantasy Sports", desc: "DFS platforms" },
  { name: "Sweepstakes Casinos", desc: "Social casino sites" },
  { name: "Horse Racing", desc: "Racebooks & odds" },
];

export const newsFeed = [
  {
    title: "[Placeholder headline — Football]",
    meta: "Football · 07/20/2026 · by [author] · 5 min",
  },
  {
    title: "[Placeholder headline — Basketball]",
    meta: "Basketball · 07/19/2026 · by [author] · 3 min",
  },
  {
    title: "[Placeholder headline — Soccer interview]",
    meta: "Soccer · 07/18/2026 · by [author] · 4 min",
  },
  { title: "[Placeholder headline — Esports]", meta: "Esports · 07/17/2026 · by [author] · 3 min" },
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

export const helplineText = "Helpline: [1-800-XXX-XXXX]"; // TODO(cms): verify against a real, current helpline number before launch.
