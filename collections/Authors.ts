import type { CollectionConfig } from 'payload'
import { seoFields } from './fields/seo'
import { revalidateSearch } from './hooks/revalidate-search'
import { readPublished } from './access/read-rules'
import { previewFor } from '../lib/preview'

// Real author records. The frontend currently has TWO separate author
// objects (mockAuthor at mock-data.ts:20 and newsStoryAuthor at :940) with
// different shapes, and byline is a pre-formatted display string
// ("by [author] · 07/18/2026" with the literal token [author] never
// replaced — MIGRATION.md §D5).
//
// Consolidates into one Author collection with all the fields needed for
// both an article byline AND a full /authors/[slug] page. Article,
// Review, and News all relate to this. Byline is derived at render from
// the relationship, never stored.

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    group: 'Editorial Team',
    useAsTitle: 'name',
    defaultColumns: ['name', 'credentialLine', 'active'],
    preview: previewFor('authors'),
  },
  access: {
    read: readPublished,
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
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name as it appears in bylines and on the author page.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL segment for /authors/[slug]. Never store an href; derive at render.',
      },
    },
    {
      name: 'credentialLine',
      type: 'text',
      required: true,
      admin: {
        description:
          'Short line describing the author\'s beat and credential, e.g. "Lead reviews analyst · covers withdrawal infrastructure". Appears in bylines and on the author page.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Author photo. Optional: the frontend renders a blank profile skeleton when it is absent, which is honest about a missing photo. Leaving it empty is better than attaching an unrelated image — schema.org Person wants a real likeness, not a stand-in. Add it before the author fronts published work.',
      },
    },
    {
      name: 'bio',
      type: 'richText',
      admin: {
        description: 'Long-form bio for the author page. Optional — the credentialLine covers the byline surface.',
      },
    },
    {
      name: 'beats',
      type: 'array',
      admin: {
        description: 'Topics this author covers. TODO in authors/[slug]/page.tsx:37 notes these become links once an author-filtered archive exists.',
      },
      fields: [
        {
          name: 'beat',
          type: 'text',
        },
      ],
    },
    {
      name: 'standards',
      type: 'array',
      admin: {
        description: 'Editorial standards this author holds themselves to. Rendered on the author page. Kept per-author rather than sitewide because different authors cover different beats with different applicable standards.',
      },
      fields: [
        {
          name: 'standard',
          type: 'text',
        },
      ],
    },
    {
      name: 'sameAs',
      type: 'array',
      admin: {
        description: 'External profile URLs for schema.org Person sameAs. LinkedIn, Twitter/X, personal site, etc. TODO at authors/[slug]/page.tsx:110 flags this as required for full Person JSON-LD.',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
        },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Uncheck instead of deleting when an author leaves — preserves attribution on their existing published work.',
      },
    },
    seoFields,
  ],
}
