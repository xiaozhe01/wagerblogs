import type { CollectionConfig } from 'payload'

// Bonus offers. Currently in the frontend as a discriminated union
// (lib/types.ts:30) with the same primary-domain vs operator asymmetry
// as review outbound links — one shape carries a primaryDomainLink with
// editable rel, the other carries an operatorLink with no rel field.
//
// Same design principle as Reviews: structural asymmetry preserved.
// Primary-domain bonuses can have editable rel; operator bonuses cannot.
//
// The current frontend has a TODO at reviews/[group]/[slug]/page.tsx:194
// for making the offer per-operator. This schema supports that by relating
// each offer to a specific operator (Review) — the featured/sitewide
// offers are the ones with isPrimaryDomain: true.

export const BonusOffers: CollectionConfig = {
  slug: 'bonus-offers',
  admin: {
    group: 'Editorial',
    useAsTitle: 'name',
    defaultColumns: ['name', 'operator', 'isPrimaryDomain', 'active'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal name for the offer, e.g. "Peak Wager welcome bonus June 2026".',
      },
    },
    {
      name: 'operator',
      type: 'relationship',
      relationTo: 'reviews',
      admin: {
        description: 'The operator this offer belongs to. Optional only if isPrimaryDomain is true (sitewide primary domain offer).',
      },
    },
    {
      name: 'isPrimaryDomain',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'When true, this is the primary domain offer. Only one should be active at a time — enforce at render, not schema.',
      },
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      admin: {
        description: 'Short display headline for the offer, e.g. "100% match up to $500".',
      },
    },
    {
      name: 'code',
      type: 'text',
      admin: {
        description: 'Promo code, if any. Optional.',
      },
    },
    {
      name: 'benefits',
      type: 'array',
      admin: {
        description: 'Optional benefit bullets displayed under the offer.',
      },
      fields: [
        {
          name: 'benefit',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'primaryDomainLink',
      type: 'group',
      admin: {
        condition: (data) => data?.isPrimaryDomain === true,
      },
      fields: [
        {
          name: 'anchorText',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'relAttribute',
          type: 'select',
          required: true,
          defaultValue: 'nofollow',
          options: [
            { label: 'Nofollow', value: 'nofollow' },
            { label: 'Sponsored', value: 'sponsored' },
            { label: 'Dofollow (editorially earned)', value: 'dofollow' },
          ],
        },
      ],
    },
    {
      name: 'operatorLink',
      type: 'group',
      admin: {
        condition: (data) => data?.isPrimaryDomain !== true,
        description: 'No relAttribute — forced to nofollow sponsored at render. Structural safety, same as Reviews.',
      },
      fields: [
        {
          name: 'anchorText',
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
    {
      name: 'validFrom',
      type: 'date',
    },
    {
      name: 'validUntil',
      type: 'date',
      admin: {
        description: 'When the offer expires. Frontend should hide expired offers automatically — flag for the frontend audit.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Manual on/off. When false, the offer is hidden regardless of validUntil.',
      },
    },
  ],
}
