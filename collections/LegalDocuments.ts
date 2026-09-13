import type { GlobalConfig } from 'payload'
import {
  BoldFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

// Legal documents (privacy policy, terms of service, affiliate
// disclosure, cookie policy). There are exactly four per
// SCHEMA-INVENTORY.md §10, they're versioned, and they need sign-off
// tracking. Payload global with an array of documents fits better than
// a collection — the set is bounded and stable.
//
// legal/[doc]/page.tsx:65 TODO calls for a revisions array; :139 TODO
// calls for LegalReview counsel sign-off. This schema encodes both.

export const LegalDocuments: GlobalConfig = {
  slug: 'legal-documents',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'documents',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'The four legal documents.',
      },
      fields: [
        {
          name: 'slug',
          type: 'select',
          required: true,
          unique: true,
          options: [
            { label: 'Privacy Policy', value: 'privacy-policy' },
            { label: 'Terms of Service', value: 'terms-of-service' },
            { label: 'Affiliate Disclosure', value: 'affiliate-disclosure' },
            { label: 'Cookie Policy', value: 'cookie-policy' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'intro',
          type: 'textarea',
          required: true,
        },
        {
          name: 'summary',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Also used as the search excerpt for this legal doc.',
          },
        },
        {
          name: 'sections',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
            },
            {
              name: 'body',
              type: 'richText',
              required: true,
              // Narrower than the sitewide set: legal copy is prose and lists.
              // No blockquote, horizontal rule or inline code.
              editor: lexicalEditor({
                features: [
                  ParagraphFeature(),
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  BoldFeature(),
                  ItalicFeature(),
                  UnorderedListFeature(),
                  OrderedListFeature(),
                  LinkFeature(),
                  InlineToolbarFeature(),
                ],
              }),
            },
          ],
        },
        {
          name: 'currentVersion',
          type: 'text',
          required: true,
          admin: {
            description: 'Semantic-ish version identifier (e.g. "2026-07-19" or "v3.1"). Displayed on the doc page.',
          },
        },
        {
          name: 'revisions',
          type: 'array',
          admin: {
            description: 'Every published change appends a dated entry here. Enforced by a beforeChange hook when currentVersion is updated.',
          },
          fields: [
            {
              name: 'version',
              type: 'text',
              required: true,
            },
            {
              name: 'date',
              type: 'date',
              required: true,
            },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              admin: {
                description: 'What changed in this revision, for the changelog view.',
              },
            },
          ],
        },
        {
          name: 'legalReview',
          type: 'group',
          admin: {
            description: 'Counsel sign-off. The current frontend TODO flags this as unconnected — this schema makes it explicit.',
          },
          fields: [
            {
              name: 'reviewedBy',
              type: 'text',
              admin: {
                description: 'Name of counsel or reviewing firm.',
              },
            },
            {
              name: 'reviewedAt',
              type: 'date',
            },
            {
              name: 'notes',
              type: 'textarea',
              admin: {
                description: 'Internal notes on the review. Not rendered publicly.',
              },
            },
          ],
        },
      ],
    },
  ],
}
