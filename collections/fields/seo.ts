import type { Field } from 'payload'

// Reusable SEO group. Attach to any public-facing collection that has its
// own indexable route. Making metaTitle and metaDescription required at
// the schema level prevents the "frontend silently falls back to a
// homepage-level default" failure mode that caused the review-page
// metadata bug in the earlier audit.
//
// Canonical is intentionally optional and left blank in almost all cases —
// the frontend should derive canonical from the record's slug at render.
// Only set canonicalUrl for deliberate cross-references (syndicated
// content, deliberate consolidation of duplicate variants).

export const seoFields: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      required: true,
      admin: {
        description:
          'Written specifically for this page. Do not leave empty and rely on a frontend default — that fallback pattern is exactly what produced the homepage-title bug on review pages.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      required: true,
      maxLength: 160,
      admin: {
        description:
          'A real summary of this specific page, not derived from a byline or excerpt string. Byline-as-description was one of the shipped bugs.',
      },
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      admin: {
        description:
          'Leave blank in almost all cases. Canonical URL is derived from the record\'s slug at render. Only set this for deliberate cross-references.',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
