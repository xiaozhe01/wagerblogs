import type { CollectionConfig } from 'payload'
import { seoFields } from './fields/seo'

// Editorial content: blog posts, guides, analysis, research. One
// collection with a type field, per the decision to consolidate rather
// than split Blog/Guides into separate collections. The current frontend
// has no /guides route and "Guides" is a kicker value on blog records —
// this schema matches that reality.
//
// The article-type axis (blog/guide/analysis/research) is DISTINCT from
// the Vertical axis (which domain the content is about). An article has
// both — e.g. a Guide about Sportsbooks. Categorization on
// /categories/[vertical]/ pages filters articles by vertical; the "Filter
// by article type" chips on that page filter further by type.
//
// "News" is deliberately NOT one of the type values here — News is its
// own collection with its own routes. The current frontend has News as
// both a categoryFilters value AND a separate content type; this schema
// eliminates the collision by keeping only the News collection.

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    group: 'Editorial',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'vertical', 'author', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: {
      autosave: false,
    },
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
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Guide', value: 'guide' },
        { label: 'Analysis', value: 'analysis' },
        { label: 'Research', value: 'research' },
        { label: 'Blog', value: 'blog' },
      ],
      admin: {
        description:
          'Structural article-type taxonomy. Matches the FilterChips on /categories/[slug] pages. Fixed enum — not records, per the deliberate design note in site-data.ts:67.',
      },
    },
    {
      name: 'vertical',
      type: 'relationship',
      relationTo: 'verticals',
      required: true,
      admin: {
        description: 'The domain this article is about. Independent from type — an article has both a type (Guide) and a vertical (Sportsbooks).',
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
          'Real Date. Frontend formats for display. Only set when the document transitions to published — enforce with a beforeChange hook so publishedAt cannot be manually set to a future or fake date.',
      },
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Auto-maintained by Payload. Use for the "updated" line on the article page when it differs from publishedAt.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 200,
      admin: {
        description:
          'Standalone summary. Used in listings, search excerpts, and card previews. NEVER used as the SEO metaDescription — those are separate fields to prevent the byline-as-description bug.',
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
      admin: {
        description: 'Required. blog/[slug]/page.tsx:92 TODO flags the hero image as required with figcaption credit — this enforces it at the schema level.',
      },
    },
    {
      name: 'heroImageCredit',
      type: 'text',
      admin: {
        description: 'Figcaption/credit line for the hero image.',
      },
    },
    {
      name: 'takeaways',
      type: 'array',
      admin: {
        description: 'Optional. Short bullet takeaways rendered at the top of the article.',
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
      name: 'related',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      maxRows: 4,
      admin: {
        description:
          'Related articles for the sidebar/rail. Deliberate curation — not an auto-generated "you might also like." Manual selection is what makes the cluster-linking strategy work.',
      },
    },
    seoFields,
  ],
}
