import type { CollectionConfig } from "payload";

// External organisation records for the responsible-gambling help
// directory. Per SCHEMA-INVENTORY.md §9, this is neither articles nor
// navigation — it's a directory of real third-party organisations with
// contact routes, plus a verification flag.
//
// isCrisisLine (from lib/types.ts:153-157) carries a verification
// constraint: "set only alongside a verified entry." Schema encodes that
// as verified being required and isCrisisLine only settable when
// verified is true — validated by a beforeChange hook.

export const HelpDirectoryEntries: CollectionConfig = {
  slug: "help-directory-entries",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "country", "region", "verified", "isCrisisLine"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        description: "The organisation name.",
      },
    },
    {
      name: "country",
      type: "text",
      required: true,
      admin: {
        description: 'ISO 3166-1 alpha-2 code, e.g. "IE", "US", "GB".',
      },
    },
    {
      name: "region",
      type: "select",
      required: true,
      options: [
        { label: "North America", value: "north-america" },
        { label: "UK & Ireland", value: "uk-ireland" },
        { label: "Europe", value: "europe" },
        { label: "Asia Pacific", value: "asia-pacific" },
        { label: "Latin America", value: "latin-america" },
        { label: "Middle East and Africa", value: "middle-east-africa" },
      ],
      admin: {
        description:
          "Region grouping for the directory listing. Kept as enum rather than a separate Regions collection — regions rarely change and don't carry their own content.",
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "contacts",
      type: "group",
      admin: {
        description: "Contact routes. At least one must be present — enforced at hook level.",
      },
      fields: [
        {
          name: "phone",
          type: "text",
        },
        {
          name: "website",
          type: "text",
        },
        {
          name: "chat",
          type: "text",
          admin: {
            description: "URL to a chat/messaging service, e.g. text line, WhatsApp, live chat.",
          },
        },
      ],
    },
    {
      name: "verified",
      type: "checkbox",
      required: true,
      defaultValue: false,
      admin: {
        description:
          'Set to true only after manually verifying the organisation is real and its contact routes are current. CLAUDE.md rule 3: unverified entries render as "coming soon" placeholders, not as if they were real.',
      },
    },
    {
      name: "verifiedAt",
      type: "date",
      admin: {
        description:
          "When this entry was last verified. Should be re-verified periodically. If old, treat as suspect.",
      },
    },
    {
      name: "isCrisisLine",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Only settable when verified is true (enforced by hook). Crisis lines are treated specially — they must never render as a placeholder or unverified, because the surface promises real crisis support.",
      },
    },
  ],
};
