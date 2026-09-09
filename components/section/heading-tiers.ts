/** One vocabulary for section rank, shared by EditorialSection and
 * ReviewSection: major 28px (reading surface) · section 22px (comparison
 * register, denser — docs/02 §5) · supporting 19px (nav, methodology). */
export const TIER_CLASSNAME = {
  major: "heading text-h2 leading-heading",
  section: "heading text-3xl leading-heading",
  supporting: "heading text-2xl leading-heading",
} as const;

export type HeadingTier = keyof typeof TIER_CLASSNAME;
