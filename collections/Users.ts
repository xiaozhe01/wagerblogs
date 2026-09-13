import type { CollectionConfig } from 'payload'

// Site users. Referenced by Comments (§3), ReaderReviews (§2), and
// Notifications (§13). Currently the frontend stores author identity as
// a bare `username` string; this collection replaces that with a real
// record.
//
// Payload already has a built-in `users` collection for admin auth (1
// row today, the admin account). This collection is DIFFERENT — it's
// for site users, not admin users. The auth strategy (Clerk vs Payload
// built-in vs Supabase Auth) is still undecided per SCHEMA-INVENTORY.md
// §14; this collection is auth-agnostic, storing whatever fields are
// needed for identity display and moderation reputation. When auth is
// wired, an external ID field (clerkId, etc.) gets added alongside.

export const Users: CollectionConfig = {
  slug: 'site-users',
  admin: {
    group: 'People',
    useAsTitle: 'username',
    defaultColumns: ['username', 'name', 'email', 'moderationStatus'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Display name. Optional — username is required, name is the "as it appears in real life" version.',
      },
    },
    {
      name: 'moderationStatus',
      type: 'select',
      required: true,
      defaultValue: 'normal',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Trusted (auto-approve)', value: 'trusted' },
        { label: 'Flagged (extra scrutiny)', value: 'flagged' },
        { label: 'Banned', value: 'banned' },
      ],
      admin: {
        description:
          'Per-user commenting reputation. Trusted bypasses the moderation queue after enough clean history. Banned blocks new submissions.',
      },
    },
    {
      name: 'moderationHistory',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Auto-maintained by hooks on Comments and ReaderReviews.',
      },
      fields: [
        {
          name: 'commentsApproved',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'commentsRejected',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'readerReviewsApproved',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'readerReviewsRejected',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'externalId',
      type: 'text',
      unique: true,
      admin: {
        description:
          'Populated once auth is wired. When using Clerk, this is the Clerk user ID. When using Payload built-in auth, this stays null and Payload handles identity directly. Keeping this field means the auth decision does not require a schema migration later.',
      },
    },
  ],
}
