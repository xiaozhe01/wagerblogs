import type { CollectionConfig } from "payload";
import { readApproved } from './access/read-rules'

// Reader-submitted reviews of operators. Distinct from Comments (which
// are threaded discussion on the review page) — reader reviews are
// evaluative and carry a rating value that eventually rolls up into an
// AggregateRating.
//
// Current frontend renders reader reviews and comments on the same page
// with similar (username/text) shapes, which makes conflation easy.
// Keeping them as separate collections with different fields makes the
// distinction structural rather than convention.
//
// Three properties from the frontend placeholder copy that this schema
// encodes as data:
//
// 1. "Verified member" — the reader must have a real User record.
// 2. "Moderated before publish" — status field with a beforeChange hook
//    forcing pending on create.
// 3. "One account per operator" — enforced by a beforeChange hook, not
//    the schema alone; a unique index on (author, operator) is the
//    right database-level enforcement.

export const ReaderReviews: CollectionConfig = {
  slug: "reader-reviews",
  admin: {
    group: "Community",
    useAsTitle: "id",
    defaultColumns: ["author", "operator", "rating", "status", "createdAt"],
  },
  access: {
    read: readApproved,
  },
  fields: [
    {
      name: "author",
      type: "relationship",
      relationTo: "site-users",
      required: true,
      admin: {
        readOnly: true,
        description:
          "The reader submitting the review. Never editable — changing authorship silently is a moderation-integrity issue.",
      },
    },
    {
      name: "operator",
      type: "relationship",
      relationTo: "reviews",
      required: true,
      admin: {
        description:
          "The operator being reviewed. Combined with author, forms the uniqueness constraint — one reader-review per user per operator.",
      },
    },
    {
      name: "rating",
      type: "number",
      required: true,
      min: 1,
      max: 5,
      admin: {
        description:
          "Rating value that feeds AggregateRating. Making this required and bounded is what makes CLAUDE.md rule 4 possible — AggregateRating can only be computed from real moderated reviews with a rating value, so the value has to actually exist on the record.",
      },
    },
    {
      name: "body",
      type: "textarea",
      required: true,
      maxLength: 2000,
      admin: {
        description: "Plain text. Same principle as Comments — no HTML surface.",
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
        { label: "Spam", value: "spam" },
      ],
      admin: {
        description:
          "Forced to pending on create by a beforeChange hook. Only approved reader-reviews contribute to AggregateRating.",
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
            condition: (_, siblingData) => siblingData?.status === "rejected",
          },
          options: [
            { label: "Off-topic", value: "off-topic" },
            { label: "Not a real customer of this operator", value: "not-customer" },
            { label: "Contains promotional content", value: "promotional" },
            { label: "Personal attack or harassment", value: "harassment" },
            { label: "Suspected spam", value: "suspected-spam" },
            { label: "Other", value: "other" },
          ],
        },
        {
          name: "additionalContext",
          type: "textarea",
          maxLength: 500,
          admin: {
            condition: (_, siblingData) => siblingData?.status === "rejected",
          },
        },
      ],
    },
  ],
};
