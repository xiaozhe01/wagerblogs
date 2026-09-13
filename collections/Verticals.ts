import type { CollectionConfig } from 'payload'
import { seoFields } from './fields/seo'

// The domain axis: what a piece of content is *about*. Sportsbooks,
// Online Casinos, Esports Betting, Fantasy Sports, Sweepstakes Casinos,
// Horse Racing, Electronic Games. Currently hardcoded in
// lib/site-data.ts:58 and referenced across the site via string matches
// that nothing enforces.
//
// Replaces both the hardcoded verticals array in site-data.ts AND the
// separate ReviewGroup structure — a review group is now `hasReviews:
// true` on the Vertical record, not a second list. Same concept,
// consolidated axis, resolves the "reviewGroups has 2 entries, categories
// has 6" divergent-naming problem.

export const Verticals: CollectionConfig = {
  slug: 'verticals',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'hasReviews', 'order'],
  },
  access: {
    // Placeholder — real group-based rules in a later security handoff.
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name, e.g. "Online Casinos", "Esports Betting". Used everywhere the vertical is rendered.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL segment. Used for both /categories/[slug] and — when hasReviews — /reviews/[slug]. Never store an href; derive at render.',
      },
    },
    {
      name: 'noun',
      type: 'text',
      required: true,
      admin: {
        description: 'Singular word used in running copy, e.g. "sportsbook", "casino", "operator". Carried over from ReviewGroup.noun.',
      },
    },
    {
      name: 'crumb',
      type: 'text',
      required: true,
      admin: {
        description: 'Short breadcrumb label. Often the same as name, but a longer name might get shortened here.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short body copy for the /categories/[slug] landing page — one or two sentences describing the vertical.',
      },
    },
    {
      name: 'hasReviews',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'When true, a /reviews/[slug] route is generated for this vertical. When false, only /categories/[slug] exists. This is the subset marker that replaces the separate ReviewGroup list.',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      admin: {
        description: 'Explicit ordering across verticals. Replaces the array-order dependency in site-data.ts.',
      },
    },
    seoFields,
  ],
}
