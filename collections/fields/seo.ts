import type { Field } from 'payload'

// Reusable SEO group. Attach to any public-facing collection that has its
// own indexable route. metaTitle and metaDescription are required, which
// prevents the "frontend silently falls back to a homepage-level default"
// failure mode that caused the review-page metadata bug in the earlier audit.
//
// Where that requirement is enforced changed when drafts were enabled: the
// drafts migration dropped NOT NULL from these columns, so the database no
// longer rejects an empty value. Payload validates them at publish time
// instead — a draft saves without them, a publish does not.
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
          'Required at publish time. Without this, the record cannot be published to production (draft saves are allowed). Written specifically for this page — do not leave it empty and rely on a frontend default, which is exactly the fallback pattern that produced the homepage-title bug on review pages.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      required: true,
      maxLength: 160,
      admin: {
        description:
          'Required at publish time. Without this, the record cannot be published to production (draft saves are allowed). A real summary of this specific page, not derived from a byline or excerpt string — byline-as-description was one of the shipped bugs.',
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
