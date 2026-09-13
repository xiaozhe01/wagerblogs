import type { CollectionConfig } from "payload";

// Threaded discussion comments. Distinct from ReaderReviews — comments
// are conversation about the content, reader reviews are evaluative.
//
// The current frontend's Comments.tsx takes no props, so it cannot know
// what it's attached to (SCHEMA-INVENTORY.md §3). Schema fixes this with
// polymorphic target — every comment carries the target content type
// and target ID.
//
// Currently only mounted on review pages (§3), but the polymorphic target
// design supports mounting on Articles and News later without a schema
// change.

export const Comments: CollectionConfig = {
  slug: "comments",
  admin: {
    group: "Community",
    useAsTitle: "id",
    defaultColumns: ["author", "targetType", "status", "createdAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "author",
      type: "relationship",
      relationTo: "site-users",
      required: true,
      admin: { readOnly: true },
    },
    {
      name: "targetType",
      type: "select",
      required: true,
      options: [
        { label: "Review", value: "reviews" },
        { label: "Article", value: "articles" },
        { label: "News", value: "news" },
      ],
    },
    {
      name: "targetId",
      type: "text",
      required: true,
      index: true,
      admin: {
        description:
          "ID of the target content. Stored as text + targetType (polymorphic) rather than a union relationship — cleaner than a Payload union field for this shape.",
      },
    },
    {
      name: "parentComment",
      type: "relationship",
      relationTo: "comments",
      admin: {
        description:
          "For threaded replies. Null for top-level comments. Frontend enforces max depth at render.",
      },
    },
    {
      name: "body",
      type: "textarea",
      required: true,
      maxLength: 2000,
      admin: {
        description:
          'Plain text only. URLs auto-linked at render with rel="nofollow noopener noreferrer" forced. Never render raw HTML from this field.',
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pending Review", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
        { label: "Approved with Edits", value: "edited" },
        { label: "Spam", value: "spam" },
      ],
      admin: {
        description:
          "beforeChange hook forces pending on create. Spam is a terminal silent state — no notification sent.",
      },
    },
    {
      name: "editedBody",
      type: "textarea",
      maxLength: 2000,
      admin: {
        condition: (data) => data?.status === "edited",
        description:
          "When a moderator approves-with-edits, the edited version goes here. Public render uses editedBody when present, falls back to body. Original body preserved for audit.",
      },
    },
    {
      name: "moderation",
      type: "group",
      admin: {
        condition: (data) => data?.status !== "pending",
      },
      fields: [
        {
          name: "moderatedBy",
          type: "relationship",
          relationTo: "site-users",
          admin: { readOnly: true },
        },
        {
          name: "moderatedAt",
          type: "date",
          admin: { readOnly: true },
        },
        {
          name: "rejectionReason",
          type: "select",
          admin: {
            condition: (_, siblingData) => ["rejected", "edited"].includes(siblingData?.status),
          },
          options: [
            { label: "Off-topic", value: "off-topic" },
            { label: "Contains promotional content or unrelated links", value: "promotional" },
            { label: "Personal attack or harassment", value: "harassment" },
            { label: "Duplicate", value: "duplicate" },
            { label: "Suspected spam", value: "suspected-spam" },
            { label: "Violates responsible-gambling guidelines", value: "responsible-gambling" },
            { label: "Other", value: "other" },
          ],
        },
        {
          name: "additionalContext",
          type: "textarea",
          maxLength: 500,
          admin: {
            condition: (_, siblingData) => ["rejected", "edited"].includes(siblingData?.status),
          },
        },
        {
          name: "internalNotes",
          type: "textarea",
          admin: {
            description:
              "Moderator-only notes. Never rendered publicly — enforce at the API/render layer, not just by convention.",
          },
        },
      ],
    },
    {
      name: "notificationSentAt",
      type: "date",
      admin: { readOnly: true },
    },
  ],
};
