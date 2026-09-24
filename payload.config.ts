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
import { previewBaseUrl, previewPath, toPreviewUrl } from "./lib/preview";

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
  admin: {
    // Breakpoints are this site's own layout states, not generic device sizes.
    // 1280 earns its place: lg: has fired but --breakpoint-wide (1370px) has
    // not, so the rail is still hidden — a layout the other three never show.
    livePreview: {
      breakpoints: [
        { name: "mobile", label: "Mobile", width: 375, height: 667 },
        { name: "tablet", label: "Tablet", width: 834, height: 1112 },
        { name: "laptop", label: "Laptop", width: 1280, height: 800 },
        { name: "desktop", label: "Desktop", width: 1440, height: 900 },
      ],
      collections: ["reviews", "articles", "news", "authors"],
      url: async ({ data, collectionConfig, req }) => {
        const path = collectionConfig
          ? await previewPath(collectionConfig.slug, data, req)
          : undefined;
        return path ? toPreviewUrl(path) : previewBaseUrl();
      },
    },
  },
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
    // max caps the pool PER PROCESS, so the right value follows the process
    // COUNT, not NODE_ENV — `next build` and `next start` are both production
    // and want opposite caps.
    // Build: 4 worker processes (experimental.cpus), each with its own pool,
    // against a session pooler capped at 15 clients — 4 x 2 = 8, seven spare.
    // Serve: one process handling every request at once. A cap of 2 starves it
    // exactly as it starves dev, and pg then fails on connectionTimeoutMillis.
    // Dev: one process serving the admin panel, route renders and ad-hoc
    // queries at once; a cap of 2 there deadlocks on one stuck client.
    // Only the build workers set NEXT_PHASE, so it is the discriminator.
    // The timeouts make exhaustion fail loudly instead of hanging forever.
    // See STRUCTURE.md "Postgres connection budget".
    pool: {
      connectionString: process.env.DATABASE_URL || "",
      max: process.env.NEXT_PHASE === "phase-production-build" ? 2 : 10,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
    },
    push: false,
    migrationDir: "migrations",
  }),
  sharp,
});
