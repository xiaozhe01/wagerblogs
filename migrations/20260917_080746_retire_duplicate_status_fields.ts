import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reviews" ADD COLUMN "needs_reverification" boolean DEFAULT false NOT NULL;
  ALTER TABLE "articles" DROP COLUMN "status";
  ALTER TABLE "news" DROP COLUMN "status";
  ALTER TABLE "reviews" DROP COLUMN "status";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum_reviews_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_reviews_status" AS ENUM('draft', 'published', 'needs-reverification');
  ALTER TABLE "articles" ADD COLUMN "status" "enum_articles_status" DEFAULT 'draft' NOT NULL;
  ALTER TABLE "news" ADD COLUMN "status" "enum_news_status" DEFAULT 'draft' NOT NULL;
  ALTER TABLE "reviews" ADD COLUMN "status" "enum_reviews_status" DEFAULT 'draft' NOT NULL;
  ALTER TABLE "reviews" DROP COLUMN "needs_reverification";`)
}
