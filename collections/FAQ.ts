import type { GlobalConfig } from 'payload'

// One FAQ, sitewide, as a Payload global rather than a collection. There
// is exactly one /faq page (SCHEMA-INVENTORY.md §8) and the FAQ isn't
// per-record content — it's a curated sitewide list.
//
// The lib/faq.ts:12 TODO says "one FAQ collection, so answer and source
// cannot drift apart" — this global with a linked source content record
// per entry is the fix. faqPageJsonLd (lib/schema.tsx:96) filters
// bracketed placeholders — status: 'published' vs 'draft' makes that
// explicit.

export const FAQ: GlobalConfig = {
  slug: 'faq',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'entries',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'FAQ entries. Order here determines rendered order on /faq.',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
          admin: {
            description:
              'The answer text. Should summarise the source content, not duplicate it in full — the linked source is the canonical version.',
          },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          admin: {
            description: 'Only published entries appear in FAQPage JSON-LD.',
          },
        },
        {
          name: 'sourceLink',
          type: 'group',
          admin: {
            description:
              'Optional link to the full source content that this entry summarises. Prevents answer-vs-source drift by making the source explicit.',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
            },
            {
              name: 'href',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}
