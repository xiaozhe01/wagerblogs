import type { CollectionConfig } from 'payload'

// In-app notification inbox. One doc per notification per user.
// Currently 0 frontend consumers (SCHEMA-INVENTORY.md §13) — designed
// now so the moderation flow's notification side is ready when the
// notification bell/inbox UI is built.
//
// Sources: Comments moderation, ReaderReviews moderation. Spam is a
// terminal silent state — no notification for spam-marked content
// (deliberate: rejection reasons are training signal for spammers).

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['recipient', 'type', 'title', 'read', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'site-users',
      required: true,
      index: true,
      admin: { readOnly: true },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Comment Approved', value: 'comment-approved' },
        { label: 'Comment Approved with Edits', value: 'comment-edited' },
        { label: 'Comment Rejected', value: 'comment-rejected' },
        { label: 'Reader Review Approved', value: 'reader-review-approved' },
        { label: 'Reader Review Rejected', value: 'reader-review-rejected' },
        { label: 'Reply to your Comment', value: 'comment-reply' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'relatedComment',
      type: 'relationship',
      relationTo: 'comments',
      admin: { readOnly: true },
    },
    {
      name: 'relatedReaderReview',
      type: 'relationship',
      relationTo: 'reader-reviews',
      admin: { readOnly: true },
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Recipient can flip this. Verify session ownership on write — never let a user mark someone else\'s notification.',
      },
    },
    {
      name: 'readAt',
      type: 'date',
      admin: { readOnly: true },
    },
  ],
}
