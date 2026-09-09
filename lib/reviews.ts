import { mockPeakWagerReview, mockRankedCasinos, mockRankedSportsbooks } from "@/lib/mock-data";
import type { Operator } from "@/lib/types";

export type ReviewGroup = {
  /** Its own route segment under /reviews — reserved, so no operator may take it. */
  slug: string;
  href: string;
  title: string;
  /** Breadcrumb label for the group segment. */
  crumb: string;
  /** What one entry is called in running copy on the review page. */
  noun: string;
  operators: Operator[];
};

// The hub directory and /reviews/[slug] resolve from the same records, so a
// tile can never link to a review that doesn't exist.
// TODO(cms): both groups come from the CMS operator collection, keyed by type.
export const reviewGroups: ReviewGroup[] = [
  {
    slug: "sportsbooks",
    href: "/reviews/sportsbooks",
    title: "Sportsbook reviews",
    crumb: "Sportsbooks",
    noun: "sportsbook",
    // PeakWager sits in the directory but not in the ranked list on /: a
    // directory passes no link equity, so rule 5's one-primary-domain limit
    // doesn't apply here.
    operators: [mockPeakWagerReview, ...mockRankedSportsbooks],
  },
  {
    slug: "casinos",
    href: "/reviews/casinos",
    title: "Casino reviews",
    crumb: "Casinos",
    noun: "casino",
    operators: mockRankedCasinos,
  },
];

export function findReviewGroup(slug: string) {
  return reviewGroups.find((group) => group.slug === slug);
}

export function findReview(groupSlug: string, operatorSlug: string) {
  const group = findReviewGroup(groupSlug);
  if (!group) return undefined;
  const operator = group.operators.find((entry) => entry.slug === operatorSlug);
  return operator ? { operator, group } : undefined;
}

export function reviewPath(operator: Operator) {
  const group = reviewGroups.find((entry) =>
    entry.operators.some((candidate) => candidate.slug === operator.slug),
  );
  return group ? `${group.href}/${operator.slug}` : "/reviews";
}

export const reviewParams = reviewGroups.flatMap((group) =>
  group.operators.map((operator) => ({
    group: group.slug,
    slug: operator.slug,
  })),
);
