// Route list for the accessibility suite, built from the routes actually
// implemented under app/ (there is no literal enumerated "route list" in
// docs/ — 00-six-layer-map.md names individual trust pages by intent, e.g.
// Layer 6's "/privacy, /responsible-gaming, /affiliate-disclosure", but not
// under an indexed list, and their real paths have since diverged: the legal
// pages live under /legal/[doc], and "/responsible-gaming" is implemented as
// /responsible-gambling). This file is the reconciled, current source of
// truth for what a11y actually gets tested against.
//
// Slugs listed here are real records in Payload, not stand-ins: the dynamic
// routes resolve their param against the database and 404 on a miss, so a
// renamed or unpublished record fails this suite until the list follows it.

export type Register = "editorial" | "comparison" | "mixed" | "utility";

export type RouteUnderTest = {
  path: string;
  label: string;
  /** Editorial = Tier 1 long-form reading. Comparison = Tier 2/3 ranked/CTA-bearing.
   * Mixed = both registers on one page. Utility = legal/trust boilerplate. */
  register: Register;
  /** Set to the reason a route is not yet reachable. The entry stays listed so
   * a URL rename is recorded in one place, but it is excluded from the suite
   * until the route resolves. */
  pending?: string;
};

const allRoutes: RouteUnderTest[] = [
  { path: "/", label: "Home", register: "mixed" },
  { path: "/about", label: "About", register: "editorial" },
  { path: "/contact", label: "Contact", register: "editorial" },
  { path: "/faq", label: "FAQ", register: "editorial" },
  { path: "/search", label: "Search — empty", register: "editorial" },
  { path: "/search?q=review", label: "Search — results", register: "editorial" },
  { path: "/news", label: "News index", register: "editorial" },
  { path: "/news/football", label: "News section", register: "editorial" },
  {
    path: "/news/football/wisconsin-penn-state-score-comeback-fickell",
    label: "News story",
    register: "editorial",
  },
  { path: "/articles", label: "Articles index", register: "editorial" },
  // No article detail route: all three articles were reverted to draft on
  // 2026-09-29 for carrying bracketed titles, so the collection has nothing
  // published to sample. The template is still covered structurally by the news
  // story above, which shares it. Restore a route here when a real article
  // publishes — don't point this at a draft slug, it 404s anonymously.
  { path: "/reviews", label: "Reviews hub", register: "comparison" },
  { path: "/reviews/sportsbooks/examplebet", label: "Operator review", register: "comparison" },
  { path: "/reviews/sportsbooks", label: "Review group", register: "comparison" },
  {
    path: "/reviews/online-casinos/crownline-coins",
    label: "Casino review",
    register: "comparison",
  },
  { path: "/categories/esports-betting", label: "Category directory", register: "editorial" },
  { path: "/reviews/sportsbooks?page=2", label: "Paged review group", register: "comparison" },
  { path: "/authors/jane", label: "Author bio", register: "editorial" },
  { path: "/legal/privacy-policy", label: "Legal — Privacy Policy", register: "utility" },
  { path: "/legal/terms-of-service", label: "Legal — Terms of Service", register: "utility" },
  {
    path: "/legal/affiliate-disclosure",
    label: "Legal — Affiliate Disclosure",
    register: "utility",
  },
  { path: "/legal/cookie-policy", label: "Legal — Cookie Policy", register: "utility" },
  { path: "/responsible-gambling", label: "Responsible Gambling", register: "editorial" },
  {
    path: "/responsible-gambling/help-directory",
    label: "Responsible Gambling — Help Directory",
    register: "editorial",
  },
];

export const routes = allRoutes.filter((route) => !route.pending);
