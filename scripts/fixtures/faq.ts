export type FaqEntry = {
  q: string;
  a: string;
  /** Where the full answer lives — every entry summarises a section that
   * already exists somewhere else, and links back to it rather than
   * becoming a second source of truth. */
  link?: { href: string; label: string };
};

// Summarised from /about. Answers drawn from methodSteps and authorStandards
// are real copy; the rest stay bracketed until those sections are written.
// TODO(cms): one FAQ collection, so answer and source cannot drift apart.
export const siteFaqs: FaqEntry[] = [
  {
    q: "How do you review an operator?",
    a: "Every operator goes through the same four steps: hands-on testing with real deposits, the same criteria applied to each site, scores benchmarked to the market leader, and re-verification when odds, apps, or payouts change.",
    link: { href: "/about#how-we-review", label: "Full methodology" },
  },
  {
    q: "Do operators pay for a better score?",
    a: "No. We earn commission when readers sign up through some links, but commission never affects a score, a ranking position, or an editorial verdict. Which links pay us is disclosed in full.",
    link: {
      href: "/legal/affiliate-disclosure",
      label: "Affiliate disclosure",
    },
  },
  {
    q: "How does WagerBlogs make money?",
    a: "[Placeholder — affiliate commission explained plainly: which links pay us, and how the separation between commercial and editorial decisions is enforced.]",
    link: { href: "/about#how-we-make-money", label: "How we make money" },
  },
  {
    q: "Where do your numbers come from?",
    a: "Every figure carries a named source and the period it covers, or it does not run. Operator claims are checked against our own deposits, wagers, and withdrawals before they reach a score.",
  },
  {
    q: "What happens when you get something wrong?",
    a: "Errors are corrected in the open with a dated note, not silently edited away. The correction is recorded on the page it affects.",
    link: { href: "/contact", label: "Report an issue" },
  },
  {
    q: "How often are reviews updated?",
    a: "[Placeholder — the review cadence.] A review is re-verified whenever odds, apps, or payouts change, and each one carries the date it was last checked.",
  },
  {
    q: "Who writes for WagerBlogs?",
    a: "[Placeholder — the publisher, when it started, and the editorial remit.] Named staff and their credentials appear only once real people are attached to real records.",
    link: { href: "/about#who-we-are", label: "About us" },
  },
];
