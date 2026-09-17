import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_type" AS ENUM('guide', 'analysis', 'research', 'blog');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_beat" AS ENUM('regulation', 'markets', 'business', 'product', 'esports', 'sports');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_reviews_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reviews_v_version_primary_domain_link_rel_attribute" AS ENUM('nofollow', 'sponsored', 'dofollow');
  CREATE TYPE "public"."enum__reviews_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "_articles_v_version_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"takeaway" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_type" "enum__articles_v_version_type",
  	"version_vertical_id" integer,
  	"version_author_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_hero_image_id" integer,
  	"version_hero_image_credit" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_canonical_url" varchar,
  	"version_seo_og_image_id" integer,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer
  );
  
  CREATE TABLE "_news_v_version_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"takeaway" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_news_v_version_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_section_id" integer,
  	"version_beat" "enum__news_v_version_beat",
  	"version_author_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_hero_image_id" integer,
  	"version_hero_image_credit" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_canonical_url" varchar,
  	"version_seo_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_reviews_v_version_category_scores" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"score" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reviews_v_version_advantages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"advantage" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reviews_v_version_pros" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"pro" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reviews_v_version_cons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"con" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reviews_v_version_bonus_terms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reviews_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_vertical_id" integer,
  	"version_author_id" integer,
  	"version_needs_reverification" boolean DEFAULT false,
  	"version_score" numeric,
  	"version_funded_account_confirmed" boolean DEFAULT false,
  	"version_last_verified" timestamp(3) with time zone,
  	"version_payout_speed_text" varchar,
  	"version_is_primary_domain" boolean DEFAULT false,
  	"version_primary_domain_link_anchor_text" varchar,
  	"version_primary_domain_link_url" varchar,
  	"version_primary_domain_link_rel_attribute" "enum__reviews_v_version_primary_domain_link_rel_attribute" DEFAULT 'nofollow',
  	"version_operator_link_anchor_text" varchar,
  	"version_operator_link_url" varchar,
  	"version_review_body" jsonb,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_canonical_url" varchar,
  	"version_seo_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__reviews_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "articles_takeaways" ALTER COLUMN "takeaway" DROP NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "type" DROP NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "vertical_id" DROP NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "author_id" DROP NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "excerpt" DROP NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "body" DROP NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "hero_image_id" DROP NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "seo_meta_title" DROP NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "seo_meta_description" DROP NOT NULL;
  ALTER TABLE "news_takeaways" ALTER COLUMN "takeaway" DROP NOT NULL;
  ALTER TABLE "news_sources" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "news_sources" ALTER COLUMN "url" DROP NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "section_id" DROP NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "beat" DROP NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "author_id" DROP NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "excerpt" DROP NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "body" DROP NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "hero_image_id" DROP NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "seo_meta_title" DROP NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "seo_meta_description" DROP NOT NULL;
  ALTER TABLE "reviews_category_scores" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "reviews_category_scores" ALTER COLUMN "score" DROP NOT NULL;
  ALTER TABLE "reviews_advantages" ALTER COLUMN "advantage" DROP NOT NULL;
  ALTER TABLE "reviews_pros" ALTER COLUMN "pro" DROP NOT NULL;
  ALTER TABLE "reviews_cons" ALTER COLUMN "con" DROP NOT NULL;
  ALTER TABLE "reviews_bonus_terms" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "reviews_bonus_terms" ALTER COLUMN "value" DROP NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "vertical_id" DROP NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "author_id" DROP NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "needs_reverification" DROP NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "score" DROP NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "funded_account_confirmed" DROP NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "last_verified" DROP NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "review_body" DROP NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "seo_meta_title" DROP NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "seo_meta_description" DROP NOT NULL;
  ALTER TABLE "articles" ADD COLUMN "_status" "enum_articles_status" DEFAULT 'draft';
  ALTER TABLE "news" ADD COLUMN "_status" "enum_news_status" DEFAULT 'draft';
  ALTER TABLE "reviews" ADD COLUMN "_status" "enum_reviews_status" DEFAULT 'draft';
  ALTER TABLE "_articles_v_version_takeaways" ADD CONSTRAINT "_articles_v_version_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_vertical_id_verticals_id_fk" FOREIGN KEY ("version_vertical_id") REFERENCES "public"."verticals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_author_id_authors_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_version_takeaways" ADD CONSTRAINT "_news_v_version_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_version_sources" ADD CONSTRAINT "_news_v_version_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_section_id_news_sections_id_fk" FOREIGN KEY ("version_section_id") REFERENCES "public"."news_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_author_id_authors_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reviews_v_version_category_scores" ADD CONSTRAINT "_reviews_v_version_category_scores_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reviews_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reviews_v_version_advantages" ADD CONSTRAINT "_reviews_v_version_advantages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reviews_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reviews_v_version_pros" ADD CONSTRAINT "_reviews_v_version_pros_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reviews_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reviews_v_version_cons" ADD CONSTRAINT "_reviews_v_version_cons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reviews_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reviews_v_version_bonus_terms" ADD CONSTRAINT "_reviews_v_version_bonus_terms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reviews_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_parent_id_reviews_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_version_vertical_id_verticals_id_fk" FOREIGN KEY ("version_vertical_id") REFERENCES "public"."verticals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_version_author_id_authors_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_articles_v_version_takeaways_order_idx" ON "_articles_v_version_takeaways" USING btree ("_order");
  CREATE INDEX "_articles_v_version_takeaways_parent_id_idx" ON "_articles_v_version_takeaways" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_vertical_idx" ON "_articles_v" USING btree ("version_vertical_id");
  CREATE INDEX "_articles_v_version_version_author_idx" ON "_articles_v" USING btree ("version_author_id");
  CREATE INDEX "_articles_v_version_version_hero_image_idx" ON "_articles_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_articles_v_version_seo_version_seo_og_image_idx" ON "_articles_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_articles_id_idx" ON "_articles_v_rels" USING btree ("articles_id");
  CREATE INDEX "_news_v_version_takeaways_order_idx" ON "_news_v_version_takeaways" USING btree ("_order");
  CREATE INDEX "_news_v_version_takeaways_parent_id_idx" ON "_news_v_version_takeaways" USING btree ("_parent_id");
  CREATE INDEX "_news_v_version_sources_order_idx" ON "_news_v_version_sources" USING btree ("_order");
  CREATE INDEX "_news_v_version_sources_parent_id_idx" ON "_news_v_version_sources" USING btree ("_parent_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_section_idx" ON "_news_v" USING btree ("version_section_id");
  CREATE INDEX "_news_v_version_version_author_idx" ON "_news_v" USING btree ("version_author_id");
  CREATE INDEX "_news_v_version_version_hero_image_idx" ON "_news_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_news_v_version_seo_version_seo_og_image_idx" ON "_news_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_reviews_v_version_category_scores_order_idx" ON "_reviews_v_version_category_scores" USING btree ("_order");
  CREATE INDEX "_reviews_v_version_category_scores_parent_id_idx" ON "_reviews_v_version_category_scores" USING btree ("_parent_id");
  CREATE INDEX "_reviews_v_version_advantages_order_idx" ON "_reviews_v_version_advantages" USING btree ("_order");
  CREATE INDEX "_reviews_v_version_advantages_parent_id_idx" ON "_reviews_v_version_advantages" USING btree ("_parent_id");
  CREATE INDEX "_reviews_v_version_pros_order_idx" ON "_reviews_v_version_pros" USING btree ("_order");
  CREATE INDEX "_reviews_v_version_pros_parent_id_idx" ON "_reviews_v_version_pros" USING btree ("_parent_id");
  CREATE INDEX "_reviews_v_version_cons_order_idx" ON "_reviews_v_version_cons" USING btree ("_order");
  CREATE INDEX "_reviews_v_version_cons_parent_id_idx" ON "_reviews_v_version_cons" USING btree ("_parent_id");
  CREATE INDEX "_reviews_v_version_bonus_terms_order_idx" ON "_reviews_v_version_bonus_terms" USING btree ("_order");
  CREATE INDEX "_reviews_v_version_bonus_terms_parent_id_idx" ON "_reviews_v_version_bonus_terms" USING btree ("_parent_id");
  CREATE INDEX "_reviews_v_parent_idx" ON "_reviews_v" USING btree ("parent_id");
  CREATE INDEX "_reviews_v_version_version_slug_idx" ON "_reviews_v" USING btree ("version_slug");
  CREATE INDEX "_reviews_v_version_version_vertical_idx" ON "_reviews_v" USING btree ("version_vertical_id");
  CREATE INDEX "_reviews_v_version_version_author_idx" ON "_reviews_v" USING btree ("version_author_id");
  CREATE INDEX "_reviews_v_version_seo_version_seo_og_image_idx" ON "_reviews_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_reviews_v_version_version_updated_at_idx" ON "_reviews_v" USING btree ("version_updated_at");
  CREATE INDEX "_reviews_v_version_version_created_at_idx" ON "_reviews_v" USING btree ("version_created_at");
  CREATE INDEX "_reviews_v_version_version__status_idx" ON "_reviews_v" USING btree ("version__status");
  CREATE INDEX "_reviews_v_created_at_idx" ON "_reviews_v" USING btree ("created_at");
  CREATE INDEX "_reviews_v_updated_at_idx" ON "_reviews_v" USING btree ("updated_at");
  CREATE INDEX "_reviews_v_latest_idx" ON "_reviews_v" USING btree ("latest");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "reviews__status_idx" ON "reviews" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_articles_v_version_takeaways" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_version_takeaways" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_version_sources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reviews_v_version_category_scores" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reviews_v_version_advantages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reviews_v_version_pros" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reviews_v_version_cons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reviews_v_version_bonus_terms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reviews_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_articles_v_version_takeaways" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  DROP TABLE "_news_v_version_takeaways" CASCADE;
  DROP TABLE "_news_v_version_sources" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "_reviews_v_version_category_scores" CASCADE;
  DROP TABLE "_reviews_v_version_advantages" CASCADE;
  DROP TABLE "_reviews_v_version_pros" CASCADE;
  DROP TABLE "_reviews_v_version_cons" CASCADE;
  DROP TABLE "_reviews_v_version_bonus_terms" CASCADE;
  DROP TABLE "_reviews_v" CASCADE;
  DROP INDEX "articles__status_idx";
  DROP INDEX "news__status_idx";
  DROP INDEX "reviews__status_idx";
  ALTER TABLE "articles_takeaways" ALTER COLUMN "takeaway" SET NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "type" SET NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "vertical_id" SET NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "author_id" SET NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "excerpt" SET NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "body" SET NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "hero_image_id" SET NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "seo_meta_title" SET NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "seo_meta_description" SET NOT NULL;
  ALTER TABLE "news_takeaways" ALTER COLUMN "takeaway" SET NOT NULL;
  ALTER TABLE "news_sources" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "news_sources" ALTER COLUMN "url" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "section_id" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "beat" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "author_id" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "excerpt" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "body" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "hero_image_id" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "seo_meta_title" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "seo_meta_description" SET NOT NULL;
  ALTER TABLE "reviews_category_scores" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "reviews_category_scores" ALTER COLUMN "score" SET NOT NULL;
  ALTER TABLE "reviews_advantages" ALTER COLUMN "advantage" SET NOT NULL;
  ALTER TABLE "reviews_pros" ALTER COLUMN "pro" SET NOT NULL;
  ALTER TABLE "reviews_cons" ALTER COLUMN "con" SET NOT NULL;
  ALTER TABLE "reviews_bonus_terms" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "reviews_bonus_terms" ALTER COLUMN "value" SET NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "vertical_id" SET NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "author_id" SET NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "needs_reverification" SET NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "score" SET NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "funded_account_confirmed" SET NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "last_verified" SET NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "review_body" SET NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "seo_meta_title" SET NOT NULL;
  ALTER TABLE "reviews" ALTER COLUMN "seo_meta_description" SET NOT NULL;
  ALTER TABLE "articles" DROP COLUMN "_status";
  ALTER TABLE "news" DROP COLUMN "_status";
  ALTER TABLE "reviews" DROP COLUMN "_status";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_type";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_beat";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_reviews_status";
  DROP TYPE "public"."enum__reviews_v_version_primary_domain_link_rel_attribute";
  DROP TYPE "public"."enum__reviews_v_version_status";`)
}
