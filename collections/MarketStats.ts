import type { GlobalConfig } from 'payload'

// Market statistics strip (SCHEMA-INVENTORY.md §15). The current
// frontend's TODO is explicit: "each figure needs a real source + period,
// or it is dropped from the strip entirely (never shown uncited)."
//
// Schema enforces that by making source and period required on every
// stat. A stat without both cannot exist as a record — the "dropped from
// the strip" behavior is a query filter (WHERE source IS NOT NULL), but
// starting from a schema where they can't be null prevents the class of
// bug entirely.

export const MarketStats: GlobalConfig = {
  slug: 'market-stats',
  admin: {
    group: 'Site',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'stats',
      type: 'array',
      admin: {
        description: 'Ordered list of stats shown in the market strip.',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'The stat value as displayed, e.g. "$12.3B", "47%", "180 operators".',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'source',
          type: 'text',
          required: true,
          admin: {
            description: 'The source citation. Required — no stat renders without one.',
          },
        },
        {
          name: 'sourceUrl',
          type: 'text',
          admin: {
            description: 'Optional URL to the source. If present, the source citation renders as a link.',
          },
        },
        {
          name: 'period',
          type: 'text',
          required: true,
          admin: {
            description: 'The time period the stat covers, e.g. "2025", "Q2 2026", "12 months ending June 2026".',
          },
        },
      ],
    },
  ],
}
