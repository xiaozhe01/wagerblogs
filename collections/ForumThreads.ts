import type { CollectionConfig } from 'payload'

// Forum threads. Currently 0 frontend consumers (SCHEMA-INVENTORY.md
// §12). Designed now so the data model is ready when a forum route is
// added — Payload can hold thread data before the frontend renders it.
//
// A forum is a larger operational commitment than the other collections
// (moderation, spam, uptime). Do not enable public thread creation until
// moderation staffing exists.

export const ForumThreads: CollectionConfig = {
  slug: 'forum-threads',
  admin: {
    group: 'Community',
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'replyCount', 'lastActivityAt', 'status'],
  },
  access: {
    read: () => true,
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
      name: 'author',
      type: 'relationship',
      relationTo: 'site-users',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      maxLength: 10000,
      admin: {
        description: 'Plain text, same principle as Comments. No rich text on user-generated content.',
      },
    },
    {
      name: 'relatedReview',
      type: 'relationship',
      relationTo: 'reviews',
      admin: {
        description:
          'Optional — link a thread to the review it discusses. Lets review pages surface real reader pushback as a trust signal.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Open', value: 'open' },
        { label: 'Locked', value: 'locked' },
        { label: 'Flagged for review', value: 'flagged' },
        { label: 'Spam', value: 'spam' },
      ],
    },
    {
      name: 'replyCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Auto-maintained by an afterChange hook on ForumReplies.',
      },
    },
    {
      name: 'lastActivityAt',
      type: 'date',
      admin: { readOnly: true },
    },
  ],
}
