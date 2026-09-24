import type { CollectionConfig } from 'payload'
import { readUnflagged } from './access/read-rules'

export const ForumReplies: CollectionConfig = {
  slug: 'forum-replies',
  admin: {
    group: 'Community',
    useAsTitle: 'id',
    defaultColumns: ['thread', 'author', 'createdAt', 'flagged'],
  },
  access: {
    read: readUnflagged,
  },
  fields: [
    {
      name: 'thread',
      type: 'relationship',
      relationTo: 'forum-threads',
      required: true,
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
      maxLength: 5000,
    },
    {
      name: 'parentReply',
      type: 'relationship',
      relationTo: 'forum-replies',
      admin: {
        description: 'For nested replies. Frontend enforces max depth at render.',
      },
    },
    {
      name: 'flagged',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  hooks: {
    afterChange: [
      // TODO: increment/decrement parent thread's replyCount and update
      // lastActivityAt whenever a reply is created, deleted, or flagged
      // status changes.
    ],
  },
}
