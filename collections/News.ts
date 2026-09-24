import type { CollectionConfig } from 'payload'
import { seoFields } from './fields/seo'
import { revalidateSearch } from './hooks/revalidate-search'

// News stories. Distinct from Articles per the frontend evidence:
// separate routes (/news/, /news/[slug]/, /news/[slug]/[story]/),
// separate registry (scripts/fixtures/news.ts), separate search scope, separate
// sitemap presence. Section/story hierarchy matches the two-level route
// structure.
//
// "Beat" is a lightweight taxonomy for news specifically — kept as a
// simple text field with a suggested-options admin hint rather than a
// separate collection or relationship to Verticals. Newspaper beats
// (Regulation, Markets, Business, Product, Esports) don't map cleanly to
// gambling verticals (Sportsbooks, Casinos, etc.), and forcing that
// mapping would break the semantic. If beats grow into full records
// later, this becomes a relationship.

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    group: 'Editorial',
    useAsTitle: 'title',
    defaultColumns: ['title', 'section', 'beat', 'author', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: {
      autosave: false,
    },
  },
  hooks: {
    afterChange: revalidateSearch,
    afterDelete: revalidateSearch,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL segment for the story. Combined with section.slug at render: /news/[section-slug]/[story-slug].',
      },
    },
    {
      name: 'section',
      type: 'relationship',
      relationTo: 'news-sections',
      required: true,
      admin: {
        description: 'The parent section grouping. Maps to the /news/[section] route level.',
      },
    },
    {
      name: 'beat',
      type: 'select',
      required: true,
      options: [
        { label: 'Regulation', value: 'regulation' },
        { label: 'Markets', value: 'markets' },
        { label: 'Business', value: 'business' },
        { label: 'Product', value: 'product' },
        { label: 'Esports', value: 'esports' },
        { label: 'Sports', value: 'sports' },
      ],
      admin: {
        description:
          'News beat taxonomy — separate from Verticals. "Esports" here is a news beat; "Esports Betting" is a vertical. Similar names, deliberately different meanings.',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        description:
          'Real Date. sectionSummary() in news.ts derives "N stories · latest <date>" from array order — publishedAt as a real date makes that a query, not a positional guess.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 200,
      admin: {
        description: 'Standalone. Used as feed dek and story standfirst.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'heroImageCredit',
      type: 'text',
    },
    {
      name: 'takeaways',
      type: 'array',
      admin: {
        description:
          'Per-story takeaways. The current frontend has one shared newsStoryTakeaways array across all stories — this schema fixes that by making them per-record.',
      },
      fields: [
        {
          name: 'takeaway',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'sources',
      type: 'array',
      admin: {
        description:
          'External sources cited in the story. TODO at news/[slug]/[story]/page.tsx:148 flags this as required for the sources section — enforcing it at the schema level.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    seoFields,
  ],
}
