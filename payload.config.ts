import sharp from "sharp";
import {
  BlockquoteFeature,
  BoldFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";

import { AdminUsers } from "./collections/AdminUsers";
import { Articles } from "./collections/Articles";
import { Authors } from "./collections/Authors";
import { BonusOffers } from "./collections/BonusOffers";
import { Comments } from "./collections/Comments";
import { FAQ } from "./collections/FAQ";
import { ForumReplies } from "./collections/ForumReplies";
import { ForumThreads } from "./collections/ForumThreads";
import { HelpDirectoryEntries } from "./collections/HelpDirectoryEntries";
import { LegalDocuments } from "./collections/LegalDocuments";
import { MarketStats } from "./collections/MarketStats";
import { Media } from "./collections/Media";
import { News } from "./collections/News";
import { NewsSections } from "./collections/NewsSections";
import { Notifications } from "./collections/Notifications";
import { ReaderReviews } from "./collections/ReaderReviews";
import { Reviews } from "./collections/Reviews";
import { Users } from "./collections/Users";
import { Verticals } from "./collections/Verticals";

// Relative imports, not "@/": Payload's CLI loads this config outside Next's
// resolver, where the tsconfig alias is not applied.
// Sitewide rich-text feature set. Passing an array REPLACES Payload's 20
// defaults rather than extending them, so everything wanted is named here —
// inheriting "whatever the defaults happen to include" breaks silently on a
// version bump.
//
// Deliberately dropped from the defaults, because the editor must not offer
// what the eventual renderer cannot produce: Align, Indent, Checklist,
// Strikethrough, Subscript, Superscript.
//
// To enable when the renderer supports them:
//   UploadFeature       — needs the frontend Image component wiring
//   BlocksFeature       — needs block-type definitions we do not have yet
//   RelationshipFeature — needs a decision on how inline refs render
const editorFeatures = [
  ParagraphFeature(),
  // h2-h4 only: h1 belongs to the page title, never to body content.
  HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
  BoldFeature(),
  ItalicFeature(),
  UnderlineFeature(),
  LinkFeature(),
  UnorderedListFeature(),
  OrderedListFeature(),
  BlockquoteFeature(),
  HorizontalRuleFeature(),
  InlineCodeFeature(),
  // UI only, produces no nodes — without it authors lose the selection toolbar.
  InlineToolbarFeature(),
];

export default buildConfig({
  // Authors.bio inherits this set. It intentionally excludes UploadFeature, so
  // bios cannot embed images — no per-field override needed to achieve that.
  editor: lexicalEditor({ features: editorFeatures }),
  collections: [
    Articles,
    News,
    NewsSections,
    Reviews,
    Verticals,
    BonusOffers,
    HelpDirectoryEntries,
    Authors,
    Users,
    Comments,
    ReaderReviews,
    ForumThreads,
    ForumReplies,
    Notifications,
    Media,
    AdminUsers,
  ],
  globals: [FAQ, LegalDocuments, MarketStats],
  plugins: [
    // forcePathStyle is required by Supabase Storage — without it the SDK builds
    // virtual-host URLs that the endpoint does not serve.
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET || "",
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || "" },
    push: false,
    migrationDir: "migrations",
  }),
  sharp,
});
