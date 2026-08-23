// Route list for the accessibility suite, built from the routes actually
// implemented under app/ (there is no literal enumerated "route list" in
// docs/ — 00-six-layer-map.md names individual trust pages by intent, e.g.
// Layer 6's "/privacy, /responsible-gaming, /affiliate-disclosure", but not
// under an indexed list, and their real paths have since diverged: the legal
// pages live under /legal/[doc], and "/responsible-gaming" is implemented as
// /responsible-gambling). This file is the reconciled, current source of
// truth for what a11y actually gets tested against.
//
// Dynamic routes ([slug]/[doc]) don't yet read their param — every page.tsx
// in app/ renders the same static mock content regardless of slug (see
// TODO(cms) markers in each route). Real-looking slugs are used anyway for
// route/URL correctness, except /legal/[doc], which already has
// generateStaticParams() over lib/mock-data.ts's legalDocs and is tested for
// all four real doc slugs.

export type Register = "editorial" | "comparison" | "mixed" | "utility";

export type RouteUnderTest = {
  path: string;
  label: string;
  /** Editorial = Tier 1 long-form reading. Comparison = Tier 2/3 ranked/CTA-bearing.
   * Mixed = both registers on one page. Utility = legal/trust boilerplate. */
  register: Register;
};

export const routes: RouteUnderTest[] = [
  { path: "/", label: "Home", register: "mixed" },
  { path: "/blog/how-odds-boosts-actually-work", label: "Blog post", register: "editorial" },
  { path: "/reviews/peakwager", label: "Operator review", register: "comparison" },
  { path: "/categories/esports-betting", label: "Category directory", register: "editorial" },
  { path: "/authors/jane-placeholder", label: "Author bio", register: "editorial" },
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
