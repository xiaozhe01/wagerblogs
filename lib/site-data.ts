// Shared placeholder navigation/footer/legal data for the WagerBlogs scaffold.
// TODO(cms): every list here is a static stand-in. In the real build this comes from
// the CMS taxonomy / nav config — never hardcode routes that can drift from the CMS.
// Structure/taxonomy only — content (operator data, post lists, stats, etc.)
// lives in lib/mock-data.ts (see the DRY-4 split rule there).

export type NavGroup = {
  id: string;
  label: string;
  href: string;
  /** `icon` is a key, not a component — SideNav maps it to the lucide icon.
   * Required so a new sub-item cannot ship without one. */
  subs: { label: string; href: string; icon: string; trailingIcon?: boolean }[];
};

export const navGroups: NavGroup[] = [
  { id: "home", label: "Home", href: "/", subs: [] },
  {
    id: "news",
    label: "News",
    href: "/news",
    subs: [
      { label: "Football", href: "/news", icon: "shield" },
      { label: "Basketball", href: "/news", icon: "circle-dot" },
      { label: "Soccer", href: "/news", icon: "volleyball" },
      { label: "Esports", href: "/news", icon: "gamepad" },
      { label: "Industry", href: "/news", icon: "building" },
      { label: "All News", href: "/news", icon: "newspaper", trailingIcon: true },
    ],
  },
  {
    id: "reviews",
    label: "Reviews",
    href: "/reviews",
    subs: [
      { label: "Sportsbooks", href: "/reviews", icon: "trophy" },
      { label: "Online Casinos", href: "/reviews", icon: "dice" },
      { label: "Sweepstakes", href: "/reviews", icon: "ticket" },
      { label: "Bonuses & Offers", href: "/reviews", icon: "gift" },
      { label: "All Reviews", href: "/reviews", icon: "star", trailingIcon: true },
    ],
  },
  {
    id: "categories",
    label: "Categories",
    href: "/categories",
    subs: [
      { label: "By Sport", href: "/categories", icon: "medal" },
      { label: "By State", href: "/categories", icon: "map-pin" },
      { label: "By Vertical", href: "/categories", icon: "layers" },
      { label: "Market Search", href: "/categories", icon: "search", trailingIcon: true },
    ],
  },
  {
    id: "blog",
    label: "Blog",
    href: "/blog",
    subs: [
      { label: "Guides", href: "/blog", icon: "book" },
      { label: "Strategy", href: "/blog", icon: "target" },
      { label: "Research", href: "/blog", icon: "flask" },
      { label: "All Posts", href: "/blog", icon: "scroll", trailingIcon: true },
    ],
  },
  {
    id: "more",
    label: "More",
    href: "/about",
    subs: [
      { label: "About Us", href: "/about", icon: "users" },
      { label: "How We Review", href: "/about", icon: "badge-check" },
      { label: "FAQ", href: "/about", icon: "info" },
      { label: "Contact", href: "/contact", icon: "mail" },
      { label: "Responsible Gambling", href: "/responsible-gambling", icon: "life-buoy" },
      { label: "Disclaimer", href: "/legal/terms-of-service", icon: "scale" },
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

export const categories = [
  { name: "Sportsbooks", desc: "NFL, NBA, MLB & more" },
  { name: "Online Casinos", desc: "Slots & live dealer" },
  { name: "Esports Betting", desc: "CS2, LoL, Valorant" },
  { name: "Fantasy Sports", desc: "DFS platforms" },
  { name: "Sweepstakes Casinos", desc: "Social casino sites" },
  { name: "Horse Racing", desc: "Racebooks & odds" },
];

// Content-type filter chips on a category page — structural taxonomy, not per-category content.
export const categoryFilters = ["All", "Guides", "Analysis", "Research", "News"];

// Region filter chips on the gambling-help directory — structural taxonomy.
export const regions = ["All regions", "North America", "UK & Ireland", "Europe", "Asia-Pacific"];

// Query-string contract for the filter chips. The "all" values are the first
// entry of their own list rather than repeated literals, so a rename cannot
// leave a route filtering on a string the chips no longer emit.
export const TYPE_PARAM = "type";
export const ALL_TYPES = categoryFilters[0];
export const REGION_PARAM = "region";
export const ALL_REGIONS = regions[0];

// Sport filter chips on the latest-news rail — structural taxonomy.
export const newsCategories = ["All", "Football", "Basketball", "Soccer", "Esports"];
