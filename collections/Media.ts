import type { CollectionConfig } from "payload";

// Media upload collection. Referenced by News, Articles, Authors, and
// the shared seoFields group (hero images, author photos, OG images).
//
// Storage strategy: local disk for dev. Production storage adapter
// (Supabase Storage, S3, etc.) is a config-level change — swap the
// storage plugin in payload.config.ts, no schema migration needed.
// Deliberately not deciding storage here to keep this file adapter-
// agnostic.
//
// alt is required at the schema level because every consuming surface
// (Article hero, News hero, Author photo, OG image) needs it for
// accessibility and schema.org compliance. Enforcing it here means the
// consumer never renders an image without alt text.

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Reference",
    useAsTitle: "filename",
    defaultColumns: ["filename", "alt", "mimeType", "filesize"],
  },
  access: {
    read: () => true,
  },
  upload: {
    // Storage adapter is configured in payload.config.ts, not here.
    // For dev this defaults to local disk under /media at the project root.
    mimeTypes: ["image/*"],
    // 1200x630 is the slot every platform gives a large share card. It is
    // 1.91:1 and editorial photography is usually 3:2, so without a derivative
    // each platform crops to its own taste — we generate the crop instead.
    //
    // No `position`: with fit "cover" Payload crops around focalX/focalY
    // itself, and a position would only compete with the point the editor set.
    //
    // withoutEnlargement must be an explicit `false`, which is not the default.
    // Payload reads the three states differently: undefined omits the size
    // entirely for a source smaller than the target, true returns that source
    // uncropped at its own aspect ratio, and only false crops and scales to a
    // true 1200x630. A slightly soft 1.91:1 card beats one every platform
    // re-crops to its own taste.
    imageSizes: [
      { name: "og", width: 1200, height: 630, fit: "cover", withoutEnlargement: false },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "Required. Every rendered image must have alt text for accessibility and schema.org. Empty alt is a violation of both, not a UX choice — enforce at schema level so a content author cannot skip it.",
      },
    },
    {
      name: "credit",
      type: "text",
      admin: {
        description:
          "Optional photo credit / attribution. Rendered as figcaption on hero images per the blog/[slug]/page.tsx:92 TODO.",
      },
    },
    {
      name: "caption",
      type: "textarea",
      admin: {
        description: "Optional caption text, separate from the credit line.",
      },
    },
  ],
};
