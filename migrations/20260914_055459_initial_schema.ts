import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_articles_type" AS ENUM('guide', 'analysis', 'research', 'blog');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_beat" AS ENUM('regulation', 'markets', 'business', 'product', 'esports', 'sports');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_reviews_status" AS ENUM('draft', 'published', 'needs-reverification');
  CREATE TYPE "public"."enum_reviews_primary_domain_link_rel_attribute" AS ENUM('nofollow', 'sponsored', 'dofollow');
  CREATE TYPE "public"."enum_bonus_offers_primary_domain_link_rel_attribute" AS ENUM('nofollow', 'sponsored', 'dofollow');
  CREATE TYPE "public"."enum_help_directory_entries_region" AS ENUM('north-america', 'uk-ireland', 'europe', 'asia-pacific', 'latin-america', 'middle-east-africa');
  CREATE TYPE "public"."enum_site_users_moderation_status" AS ENUM('normal', 'trusted', 'flagged', 'banned');
  CREATE TYPE "public"."enum_comments_target_type" AS ENUM('reviews', 'articles', 'news');
  CREATE TYPE "public"."enum_comments_status" AS ENUM('pending', 'approved', 'rejected', 'edited', 'spam');
  CREATE TYPE "public"."enum_comments_moderation_rejection_reason" AS ENUM('off-topic', 'promotional', 'harassment', 'duplicate', 'suspected-spam', 'responsible-gambling', 'other');
  CREATE TYPE "public"."enum_reader_reviews_status" AS ENUM('pending', 'approved', 'rejected', 'spam');
  CREATE TYPE "public"."enum_reader_reviews_moderation_rejection_reason" AS ENUM('off-topic', 'not-customer', 'promotional', 'harassment', 'suspected-spam', 'other');
  CREATE TYPE "public"."enum_forum_threads_status" AS ENUM('pending', 'open', 'locked', 'flagged', 'spam');
  CREATE TYPE "public"."enum_notifications_type" AS ENUM('comment-approved', 'comment-edited', 'comment-rejected', 'reader-review-approved', 'reader-review-rejected', 'comment-reply');
  CREATE TYPE "public"."enum_faq_entries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_legal_documents_documents_slug" AS ENUM('privacy-policy', 'terms-of-service', 'affiliate-disclosure', 'cookie-policy');
  CREATE TABLE "articles_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"takeaway" varchar NOT NULL
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_articles_type" NOT NULL,
  	"vertical_id" integer NOT NULL,
  	"author_id" integer NOT NULL,
  	"status" "enum_articles_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"hero_image_id" integer NOT NULL,
  	"hero_image_credit" varchar,
  	"seo_meta_title" varchar NOT NULL,
  	"seo_meta_description" varchar NOT NULL,
  	"seo_canonical_url" varchar,
  	"seo_og_image_id" integer,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer
  );
  
  CREATE TABLE "news_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"takeaway" varchar NOT NULL
  );
  
  CREATE TABLE "news_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"section_id" integer NOT NULL,
  	"beat" "enum_news_beat" NOT NULL,
  	"author_id" integer NOT NULL,
  	"status" "enum_news_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"excerpt" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"hero_image_id" integer NOT NULL,
  	"hero_image_credit" varchar,
  	"seo_meta_title" varchar NOT NULL,
  	"seo_meta_description" varchar NOT NULL,
  	"seo_canonical_url" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "news_sections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"order" numeric NOT NULL,
  	"seo_meta_title" varchar NOT NULL,
  	"seo_meta_description" varchar NOT NULL,
  	"seo_canonical_url" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reviews_category_scores" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"score" numeric NOT NULL
  );
  
  CREATE TABLE "reviews_advantages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"advantage" varchar NOT NULL
  );
  
  CREATE TABLE "reviews_pros" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pro" varchar NOT NULL
  );
  
  CREATE TABLE "reviews_cons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"con" varchar NOT NULL
  );
  
  CREATE TABLE "reviews_bonus_terms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"vertical_id" integer NOT NULL,
  	"author_id" integer NOT NULL,
  	"status" "enum_reviews_status" DEFAULT 'draft' NOT NULL,
  	"score" numeric NOT NULL,
  	"funded_account_confirmed" boolean DEFAULT false NOT NULL,
  	"last_verified" timestamp(3) with time zone NOT NULL,
  	"payout_speed_text" varchar,
  	"is_primary_domain" boolean DEFAULT false,
  	"primary_domain_link_anchor_text" varchar,
  	"primary_domain_link_url" varchar,
  	"primary_domain_link_rel_attribute" "enum_reviews_primary_domain_link_rel_attribute" DEFAULT 'nofollow',
  	"operator_link_anchor_text" varchar,
  	"operator_link_url" varchar,
  	"review_body" jsonb NOT NULL,
  	"seo_meta_title" varchar NOT NULL,
  	"seo_meta_description" varchar NOT NULL,
  	"seo_canonical_url" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "verticals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"noun" varchar NOT NULL,
  	"crumb" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"has_reviews" boolean DEFAULT false,
  	"order" numeric NOT NULL,
  	"seo_meta_title" varchar NOT NULL,
  	"seo_meta_description" varchar NOT NULL,
  	"seo_canonical_url" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "bonus_offers_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"benefit" varchar NOT NULL
  );
  
  CREATE TABLE "bonus_offers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"operator_id" integer,
  	"is_primary_domain" boolean DEFAULT false,
  	"headline" varchar NOT NULL,
  	"code" varchar,
  	"primary_domain_link_anchor_text" varchar,
  	"primary_domain_link_url" varchar,
  	"primary_domain_link_rel_attribute" "enum_bonus_offers_primary_domain_link_rel_attribute" DEFAULT 'nofollow',
  	"operator_link_anchor_text" varchar,
  	"operator_link_url" varchar,
  	"valid_from" timestamp(3) with time zone,
  	"valid_until" timestamp(3) with time zone,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "help_directory_entries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"region" "enum_help_directory_entries_region" NOT NULL,
  	"description" varchar NOT NULL,
  	"contacts_phone" varchar,
  	"contacts_website" varchar,
  	"contacts_chat" varchar,
  	"verified" boolean DEFAULT false NOT NULL,
  	"verified_at" timestamp(3) with time zone,
  	"is_crisis_line" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "authors_beats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"beat" varchar
  );
  
  CREATE TABLE "authors_standards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"standard" varchar
  );
  
  CREATE TABLE "authors_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"credential_line" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"bio" jsonb,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"username" varchar NOT NULL,
  	"name" varchar,
  	"moderation_status" "enum_site_users_moderation_status" DEFAULT 'normal' NOT NULL,
  	"moderation_history_comments_approved" numeric DEFAULT 0,
  	"moderation_history_comments_rejected" numeric DEFAULT 0,
  	"moderation_history_reader_reviews_approved" numeric DEFAULT 0,
  	"moderation_history_reader_reviews_rejected" numeric DEFAULT 0,
  	"external_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "comments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author_id" integer NOT NULL,
  	"target_type" "enum_comments_target_type" NOT NULL,
  	"target_id" varchar NOT NULL,
  	"parent_comment_id" integer,
  	"body" varchar NOT NULL,
  	"status" "enum_comments_status" DEFAULT 'pending' NOT NULL,
  	"edited_body" varchar,
  	"moderation_moderated_by_id" integer,
  	"moderation_moderated_at" timestamp(3) with time zone,
  	"moderation_rejection_reason" "enum_comments_moderation_rejection_reason",
  	"moderation_additional_context" varchar,
  	"moderation_internal_notes" varchar,
  	"notification_sent_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reader_reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author_id" integer NOT NULL,
  	"operator_id" integer NOT NULL,
  	"rating" numeric NOT NULL,
  	"body" varchar NOT NULL,
  	"status" "enum_reader_reviews_status" DEFAULT 'pending' NOT NULL,
  	"moderation_moderated_by_id" integer,
  	"moderation_moderated_at" timestamp(3) with time zone,
  	"moderation_rejection_reason" "enum_reader_reviews_moderation_rejection_reason",
  	"moderation_additional_context" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forum_threads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"author_id" integer NOT NULL,
  	"body" varchar NOT NULL,
  	"related_review_id" integer,
  	"status" "enum_forum_threads_status" DEFAULT 'pending' NOT NULL,
  	"reply_count" numeric DEFAULT 0,
  	"last_activity_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forum_replies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"thread_id" integer NOT NULL,
  	"author_id" integer NOT NULL,
  	"body" varchar NOT NULL,
  	"parent_reply_id" integer,
  	"flagged" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"recipient_id" integer NOT NULL,
  	"type" "enum_notifications_type" NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"related_comment_id" integer,
  	"related_reader_review_id" integer,
  	"read" boolean DEFAULT false,
  	"read_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"credit" varchar,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer,
  	"news_id" integer,
  	"news_sections_id" integer,
  	"reviews_id" integer,
  	"verticals_id" integer,
  	"bonus_offers_id" integer,
  	"help_directory_entries_id" integer,
  	"authors_id" integer,
  	"site_users_id" integer,
  	"comments_id" integer,
  	"reader_reviews_id" integer,
  	"forum_threads_id" integer,
  	"forum_replies_id" integer,
  	"notifications_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"status" "enum_faq_entries_status" DEFAULT 'draft' NOT NULL,
  	"source_link_label" varchar,
  	"source_link_href" varchar
  );
  
  CREATE TABLE "faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "legal_documents_documents_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" jsonb NOT NULL
  );
  
  CREATE TABLE "legal_documents_documents_revisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"version" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"summary" varchar NOT NULL
  );
  
  CREATE TABLE "legal_documents_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" "enum_legal_documents_documents_slug" NOT NULL,
  	"title" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"current_version" varchar NOT NULL,
  	"legal_review_reviewed_by" varchar,
  	"legal_review_reviewed_at" timestamp(3) with time zone,
  	"legal_review_notes" varchar
  );
  
  CREATE TABLE "legal_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "market_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"source" varchar NOT NULL,
  	"source_url" varchar,
  	"period" varchar NOT NULL
  );
  
  CREATE TABLE "market_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "articles_takeaways" ADD CONSTRAINT "articles_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_vertical_id_verticals_id_fk" FOREIGN KEY ("vertical_id") REFERENCES "public"."verticals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_takeaways" ADD CONSTRAINT "news_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_sources" ADD CONSTRAINT "news_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_section_id_news_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."news_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_sections" ADD CONSTRAINT "news_sections_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews_category_scores" ADD CONSTRAINT "reviews_category_scores_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews_advantages" ADD CONSTRAINT "reviews_advantages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews_pros" ADD CONSTRAINT "reviews_pros_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews_cons" ADD CONSTRAINT "reviews_cons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews_bonus_terms" ADD CONSTRAINT "reviews_bonus_terms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_vertical_id_verticals_id_fk" FOREIGN KEY ("vertical_id") REFERENCES "public"."verticals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "verticals" ADD CONSTRAINT "verticals_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bonus_offers_benefits" ADD CONSTRAINT "bonus_offers_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."bonus_offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "bonus_offers" ADD CONSTRAINT "bonus_offers_operator_id_reviews_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."reviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors_beats" ADD CONSTRAINT "authors_beats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors_standards" ADD CONSTRAINT "authors_standards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors_same_as" ADD CONSTRAINT "authors_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_site_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."site_users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_comment_id_comments_id_fk" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_moderation_moderated_by_id_site_users_id_fk" FOREIGN KEY ("moderation_moderated_by_id") REFERENCES "public"."site_users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reader_reviews" ADD CONSTRAINT "reader_reviews_author_id_site_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."site_users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reader_reviews" ADD CONSTRAINT "reader_reviews_operator_id_reviews_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."reviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reader_reviews" ADD CONSTRAINT "reader_reviews_moderation_moderated_by_id_site_users_id_fk" FOREIGN KEY ("moderation_moderated_by_id") REFERENCES "public"."site_users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forum_threads" ADD CONSTRAINT "forum_threads_author_id_site_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."site_users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forum_threads" ADD CONSTRAINT "forum_threads_related_review_id_reviews_id_fk" FOREIGN KEY ("related_review_id") REFERENCES "public"."reviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_thread_id_forum_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."forum_threads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_author_id_site_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."site_users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_parent_reply_id_forum_replies_id_fk" FOREIGN KEY ("parent_reply_id") REFERENCES "public"."forum_replies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_site_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."site_users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_comment_id_comments_id_fk" FOREIGN KEY ("related_comment_id") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_reader_review_id_reader_reviews_id_fk" FOREIGN KEY ("related_reader_review_id") REFERENCES "public"."reader_reviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_sections_fk" FOREIGN KEY ("news_sections_id") REFERENCES "public"."news_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_verticals_fk" FOREIGN KEY ("verticals_id") REFERENCES "public"."verticals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bonus_offers_fk" FOREIGN KEY ("bonus_offers_id") REFERENCES "public"."bonus_offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_help_directory_entries_fk" FOREIGN KEY ("help_directory_entries_id") REFERENCES "public"."help_directory_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_users_fk" FOREIGN KEY ("site_users_id") REFERENCES "public"."site_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_comments_fk" FOREIGN KEY ("comments_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reader_reviews_fk" FOREIGN KEY ("reader_reviews_id") REFERENCES "public"."reader_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forum_threads_fk" FOREIGN KEY ("forum_threads_id") REFERENCES "public"."forum_threads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forum_replies_fk" FOREIGN KEY ("forum_replies_id") REFERENCES "public"."forum_replies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notifications_fk" FOREIGN KEY ("notifications_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_entries" ADD CONSTRAINT "faq_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_documents_documents_sections" ADD CONSTRAINT "legal_documents_documents_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_documents_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_documents_documents_revisions" ADD CONSTRAINT "legal_documents_documents_revisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_documents_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_documents_documents" ADD CONSTRAINT "legal_documents_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "market_stats_stats" ADD CONSTRAINT "market_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."market_stats"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_takeaways_order_idx" ON "articles_takeaways" USING btree ("_order");
  CREATE INDEX "articles_takeaways_parent_id_idx" ON "articles_takeaways" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_vertical_idx" ON "articles" USING btree ("vertical_id");
  CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");
  CREATE INDEX "articles_hero_image_idx" ON "articles" USING btree ("hero_image_id");
  CREATE INDEX "articles_seo_seo_og_image_idx" ON "articles" USING btree ("seo_og_image_id");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_articles_id_idx" ON "articles_rels" USING btree ("articles_id");
  CREATE INDEX "news_takeaways_order_idx" ON "news_takeaways" USING btree ("_order");
  CREATE INDEX "news_takeaways_parent_id_idx" ON "news_takeaways" USING btree ("_parent_id");
  CREATE INDEX "news_sources_order_idx" ON "news_sources" USING btree ("_order");
  CREATE INDEX "news_sources_parent_id_idx" ON "news_sources" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_section_idx" ON "news" USING btree ("section_id");
  CREATE INDEX "news_author_idx" ON "news" USING btree ("author_id");
  CREATE INDEX "news_hero_image_idx" ON "news" USING btree ("hero_image_id");
  CREATE INDEX "news_seo_seo_og_image_idx" ON "news" USING btree ("seo_og_image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE UNIQUE INDEX "news_sections_slug_idx" ON "news_sections" USING btree ("slug");
  CREATE INDEX "news_sections_seo_seo_og_image_idx" ON "news_sections" USING btree ("seo_og_image_id");
  CREATE INDEX "news_sections_updated_at_idx" ON "news_sections" USING btree ("updated_at");
  CREATE INDEX "news_sections_created_at_idx" ON "news_sections" USING btree ("created_at");
  CREATE INDEX "reviews_category_scores_order_idx" ON "reviews_category_scores" USING btree ("_order");
  CREATE INDEX "reviews_category_scores_parent_id_idx" ON "reviews_category_scores" USING btree ("_parent_id");
  CREATE INDEX "reviews_advantages_order_idx" ON "reviews_advantages" USING btree ("_order");
  CREATE INDEX "reviews_advantages_parent_id_idx" ON "reviews_advantages" USING btree ("_parent_id");
  CREATE INDEX "reviews_pros_order_idx" ON "reviews_pros" USING btree ("_order");
  CREATE INDEX "reviews_pros_parent_id_idx" ON "reviews_pros" USING btree ("_parent_id");
  CREATE INDEX "reviews_cons_order_idx" ON "reviews_cons" USING btree ("_order");
  CREATE INDEX "reviews_cons_parent_id_idx" ON "reviews_cons" USING btree ("_parent_id");
  CREATE INDEX "reviews_bonus_terms_order_idx" ON "reviews_bonus_terms" USING btree ("_order");
  CREATE INDEX "reviews_bonus_terms_parent_id_idx" ON "reviews_bonus_terms" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "reviews_slug_idx" ON "reviews" USING btree ("slug");
  CREATE INDEX "reviews_vertical_idx" ON "reviews" USING btree ("vertical_id");
  CREATE INDEX "reviews_author_idx" ON "reviews" USING btree ("author_id");
  CREATE INDEX "reviews_seo_seo_og_image_idx" ON "reviews" USING btree ("seo_og_image_id");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE UNIQUE INDEX "verticals_slug_idx" ON "verticals" USING btree ("slug");
  CREATE INDEX "verticals_seo_seo_og_image_idx" ON "verticals" USING btree ("seo_og_image_id");
  CREATE INDEX "verticals_updated_at_idx" ON "verticals" USING btree ("updated_at");
  CREATE INDEX "verticals_created_at_idx" ON "verticals" USING btree ("created_at");
  CREATE INDEX "bonus_offers_benefits_order_idx" ON "bonus_offers_benefits" USING btree ("_order");
  CREATE INDEX "bonus_offers_benefits_parent_id_idx" ON "bonus_offers_benefits" USING btree ("_parent_id");
  CREATE INDEX "bonus_offers_operator_idx" ON "bonus_offers" USING btree ("operator_id");
  CREATE INDEX "bonus_offers_updated_at_idx" ON "bonus_offers" USING btree ("updated_at");
  CREATE INDEX "bonus_offers_created_at_idx" ON "bonus_offers" USING btree ("created_at");
  CREATE INDEX "help_directory_entries_updated_at_idx" ON "help_directory_entries" USING btree ("updated_at");
  CREATE INDEX "help_directory_entries_created_at_idx" ON "help_directory_entries" USING btree ("created_at");
  CREATE INDEX "authors_beats_order_idx" ON "authors_beats" USING btree ("_order");
  CREATE INDEX "authors_beats_parent_id_idx" ON "authors_beats" USING btree ("_parent_id");
  CREATE INDEX "authors_standards_order_idx" ON "authors_standards" USING btree ("_order");
  CREATE INDEX "authors_standards_parent_id_idx" ON "authors_standards" USING btree ("_parent_id");
  CREATE INDEX "authors_same_as_order_idx" ON "authors_same_as" USING btree ("_order");
  CREATE INDEX "authors_same_as_parent_id_idx" ON "authors_same_as" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");
  CREATE INDEX "authors_photo_idx" ON "authors" USING btree ("photo_id");
  CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
  CREATE UNIQUE INDEX "site_users_email_idx" ON "site_users" USING btree ("email");
  CREATE UNIQUE INDEX "site_users_username_idx" ON "site_users" USING btree ("username");
  CREATE UNIQUE INDEX "site_users_external_id_idx" ON "site_users" USING btree ("external_id");
  CREATE INDEX "site_users_updated_at_idx" ON "site_users" USING btree ("updated_at");
  CREATE INDEX "site_users_created_at_idx" ON "site_users" USING btree ("created_at");
  CREATE INDEX "comments_author_idx" ON "comments" USING btree ("author_id");
  CREATE INDEX "comments_target_id_idx" ON "comments" USING btree ("target_id");
  CREATE INDEX "comments_parent_comment_idx" ON "comments" USING btree ("parent_comment_id");
  CREATE INDEX "comments_moderation_moderation_moderated_by_idx" ON "comments" USING btree ("moderation_moderated_by_id");
  CREATE INDEX "comments_updated_at_idx" ON "comments" USING btree ("updated_at");
  CREATE INDEX "comments_created_at_idx" ON "comments" USING btree ("created_at");
  CREATE INDEX "reader_reviews_author_idx" ON "reader_reviews" USING btree ("author_id");
  CREATE INDEX "reader_reviews_operator_idx" ON "reader_reviews" USING btree ("operator_id");
  CREATE INDEX "reader_reviews_moderation_moderation_moderated_by_idx" ON "reader_reviews" USING btree ("moderation_moderated_by_id");
  CREATE INDEX "reader_reviews_updated_at_idx" ON "reader_reviews" USING btree ("updated_at");
  CREATE INDEX "reader_reviews_created_at_idx" ON "reader_reviews" USING btree ("created_at");
  CREATE UNIQUE INDEX "forum_threads_slug_idx" ON "forum_threads" USING btree ("slug");
  CREATE INDEX "forum_threads_author_idx" ON "forum_threads" USING btree ("author_id");
  CREATE INDEX "forum_threads_related_review_idx" ON "forum_threads" USING btree ("related_review_id");
  CREATE INDEX "forum_threads_updated_at_idx" ON "forum_threads" USING btree ("updated_at");
  CREATE INDEX "forum_threads_created_at_idx" ON "forum_threads" USING btree ("created_at");
  CREATE INDEX "forum_replies_thread_idx" ON "forum_replies" USING btree ("thread_id");
  CREATE INDEX "forum_replies_author_idx" ON "forum_replies" USING btree ("author_id");
  CREATE INDEX "forum_replies_parent_reply_idx" ON "forum_replies" USING btree ("parent_reply_id");
  CREATE INDEX "forum_replies_updated_at_idx" ON "forum_replies" USING btree ("updated_at");
  CREATE INDEX "forum_replies_created_at_idx" ON "forum_replies" USING btree ("created_at");
  CREATE INDEX "notifications_recipient_idx" ON "notifications" USING btree ("recipient_id");
  CREATE INDEX "notifications_related_comment_idx" ON "notifications" USING btree ("related_comment_id");
  CREATE INDEX "notifications_related_reader_review_idx" ON "notifications" USING btree ("related_reader_review_id");
  CREATE INDEX "notifications_updated_at_idx" ON "notifications" USING btree ("updated_at");
  CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_news_sections_id_idx" ON "payload_locked_documents_rels" USING btree ("news_sections_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_verticals_id_idx" ON "payload_locked_documents_rels" USING btree ("verticals_id");
  CREATE INDEX "payload_locked_documents_rels_bonus_offers_id_idx" ON "payload_locked_documents_rels" USING btree ("bonus_offers_id");
  CREATE INDEX "payload_locked_documents_rels_help_directory_entries_id_idx" ON "payload_locked_documents_rels" USING btree ("help_directory_entries_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_site_users_id_idx" ON "payload_locked_documents_rels" USING btree ("site_users_id");
  CREATE INDEX "payload_locked_documents_rels_comments_id_idx" ON "payload_locked_documents_rels" USING btree ("comments_id");
  CREATE INDEX "payload_locked_documents_rels_reader_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reader_reviews_id");
  CREATE INDEX "payload_locked_documents_rels_forum_threads_id_idx" ON "payload_locked_documents_rels" USING btree ("forum_threads_id");
  CREATE INDEX "payload_locked_documents_rels_forum_replies_id_idx" ON "payload_locked_documents_rels" USING btree ("forum_replies_id");
  CREATE INDEX "payload_locked_documents_rels_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("notifications_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "faq_entries_order_idx" ON "faq_entries" USING btree ("_order");
  CREATE INDEX "faq_entries_parent_id_idx" ON "faq_entries" USING btree ("_parent_id");
  CREATE INDEX "legal_documents_documents_sections_order_idx" ON "legal_documents_documents_sections" USING btree ("_order");
  CREATE INDEX "legal_documents_documents_sections_parent_id_idx" ON "legal_documents_documents_sections" USING btree ("_parent_id");
  CREATE INDEX "legal_documents_documents_revisions_order_idx" ON "legal_documents_documents_revisions" USING btree ("_order");
  CREATE INDEX "legal_documents_documents_revisions_parent_id_idx" ON "legal_documents_documents_revisions" USING btree ("_parent_id");
  CREATE INDEX "legal_documents_documents_order_idx" ON "legal_documents_documents" USING btree ("_order");
  CREATE INDEX "legal_documents_documents_parent_id_idx" ON "legal_documents_documents" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "legal_documents_documents_slug_idx" ON "legal_documents_documents" USING btree ("slug");
  CREATE INDEX "market_stats_stats_order_idx" ON "market_stats_stats" USING btree ("_order");
  CREATE INDEX "market_stats_stats_parent_id_idx" ON "market_stats_stats" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "articles_takeaways" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "news_takeaways" CASCADE;
  DROP TABLE "news_sources" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "news_sections" CASCADE;
  DROP TABLE "reviews_category_scores" CASCADE;
  DROP TABLE "reviews_advantages" CASCADE;
  DROP TABLE "reviews_pros" CASCADE;
  DROP TABLE "reviews_cons" CASCADE;
  DROP TABLE "reviews_bonus_terms" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "verticals" CASCADE;
  DROP TABLE "bonus_offers_benefits" CASCADE;
  DROP TABLE "bonus_offers" CASCADE;
  DROP TABLE "help_directory_entries" CASCADE;
  DROP TABLE "authors_beats" CASCADE;
  DROP TABLE "authors_standards" CASCADE;
  DROP TABLE "authors_same_as" CASCADE;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "site_users" CASCADE;
  DROP TABLE "comments" CASCADE;
  DROP TABLE "reader_reviews" CASCADE;
  DROP TABLE "forum_threads" CASCADE;
  DROP TABLE "forum_replies" CASCADE;
  DROP TABLE "notifications" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "faq_entries" CASCADE;
  DROP TABLE "faq" CASCADE;
  DROP TABLE "legal_documents_documents_sections" CASCADE;
  DROP TABLE "legal_documents_documents_revisions" CASCADE;
  DROP TABLE "legal_documents_documents" CASCADE;
  DROP TABLE "legal_documents" CASCADE;
  DROP TABLE "market_stats_stats" CASCADE;
  DROP TABLE "market_stats" CASCADE;
  DROP TYPE "public"."enum_articles_type";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum_news_beat";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum_reviews_status";
  DROP TYPE "public"."enum_reviews_primary_domain_link_rel_attribute";
  DROP TYPE "public"."enum_bonus_offers_primary_domain_link_rel_attribute";
  DROP TYPE "public"."enum_help_directory_entries_region";
  DROP TYPE "public"."enum_site_users_moderation_status";
  DROP TYPE "public"."enum_comments_target_type";
  DROP TYPE "public"."enum_comments_status";
  DROP TYPE "public"."enum_comments_moderation_rejection_reason";
  DROP TYPE "public"."enum_reader_reviews_status";
  DROP TYPE "public"."enum_reader_reviews_moderation_rejection_reason";
  DROP TYPE "public"."enum_forum_threads_status";
  DROP TYPE "public"."enum_notifications_type";
  DROP TYPE "public"."enum_faq_entries_status";
  DROP TYPE "public"."enum_legal_documents_documents_slug";`)
}
