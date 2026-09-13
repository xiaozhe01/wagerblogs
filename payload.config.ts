import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";

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
export default buildConfig({
  editor: lexicalEditor(),
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
  }),
  sharp,
});
