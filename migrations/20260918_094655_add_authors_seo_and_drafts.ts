import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_authors_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__authors_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "_authors_v_version_beats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"beat" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_authors_v_version_standards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"standard" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_authors_v_version_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_authors_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_credential_line" varchar,
  	"version_photo_id" integer,
  	"version_bio" jsonb,
  	"version_active" boolean DEFAULT true,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_canonical_url" varchar,
  	"version_seo_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__authors_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "authors_same_as" ALTER COLUMN "url" DROP NOT NULL;
  ALTER TABLE "authors" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "authors" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "authors" ALTER COLUMN "credential_line" DROP NOT NULL;
  ALTER TABLE "authors" ALTER COLUMN "photo_id" DROP NOT NULL;
  ALTER TABLE "authors" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "authors" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "authors" ADD COLUMN "seo_canonical_url" varchar;
  ALTER TABLE "authors" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "authors" ADD COLUMN "_status" "enum_authors_status" DEFAULT 'draft';
  ALTER TABLE "_authors_v_version_beats" ADD CONSTRAINT "_authors_v_version_beats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_authors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_authors_v_version_standards" ADD CONSTRAINT "_authors_v_version_standards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_authors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_authors_v_version_same_as" ADD CONSTRAINT "_authors_v_version_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_authors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_parent_id_authors_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_authors_v_version_beats_order_idx" ON "_authors_v_version_beats" USING btree ("_order");
  CREATE INDEX "_authors_v_version_beats_parent_id_idx" ON "_authors_v_version_beats" USING btree ("_parent_id");
  CREATE INDEX "_authors_v_version_standards_order_idx" ON "_authors_v_version_standards" USING btree ("_order");
  CREATE INDEX "_authors_v_version_standards_parent_id_idx" ON "_authors_v_version_standards" USING btree ("_parent_id");
  CREATE INDEX "_authors_v_version_same_as_order_idx" ON "_authors_v_version_same_as" USING btree ("_order");
  CREATE INDEX "_authors_v_version_same_as_parent_id_idx" ON "_authors_v_version_same_as" USING btree ("_parent_id");
  CREATE INDEX "_authors_v_parent_idx" ON "_authors_v" USING btree ("parent_id");
  CREATE INDEX "_authors_v_version_version_slug_idx" ON "_authors_v" USING btree ("version_slug");
  CREATE INDEX "_authors_v_version_version_photo_idx" ON "_authors_v" USING btree ("version_photo_id");
  CREATE INDEX "_authors_v_version_seo_version_seo_og_image_idx" ON "_authors_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_authors_v_version_version_updated_at_idx" ON "_authors_v" USING btree ("version_updated_at");
  CREATE INDEX "_authors_v_version_version_created_at_idx" ON "_authors_v" USING btree ("version_created_at");
  CREATE INDEX "_authors_v_version_version__status_idx" ON "_authors_v" USING btree ("version__status");
  CREATE INDEX "_authors_v_created_at_idx" ON "_authors_v" USING btree ("created_at");
  CREATE INDEX "_authors_v_updated_at_idx" ON "_authors_v" USING btree ("updated_at");
  CREATE INDEX "_authors_v_latest_idx" ON "_authors_v" USING btree ("latest");
  ALTER TABLE "authors" ADD CONSTRAINT "authors_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "authors_seo_seo_og_image_idx" ON "authors" USING btree ("seo_og_image_id");
  CREATE INDEX "authors__status_idx" ON "authors" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_authors_v_version_beats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_authors_v_version_standards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_authors_v_version_same_as" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_authors_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_authors_v_version_beats" CASCADE;
  DROP TABLE "_authors_v_version_standards" CASCADE;
  DROP TABLE "_authors_v_version_same_as" CASCADE;
  DROP TABLE "_authors_v" CASCADE;
  ALTER TABLE "authors" DROP CONSTRAINT "authors_seo_og_image_id_media_id_fk";
  
  DROP INDEX "authors_seo_seo_og_image_idx";
  DROP INDEX "authors__status_idx";
  ALTER TABLE "authors_same_as" ALTER COLUMN "url" SET NOT NULL;
  ALTER TABLE "authors" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "authors" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "authors" ALTER COLUMN "credential_line" SET NOT NULL;
  ALTER TABLE "authors" ALTER COLUMN "photo_id" SET NOT NULL;
  ALTER TABLE "authors" DROP COLUMN "seo_meta_title";
  ALTER TABLE "authors" DROP COLUMN "seo_meta_description";
  ALTER TABLE "authors" DROP COLUMN "seo_canonical_url";
  ALTER TABLE "authors" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "authors" DROP COLUMN "_status";
  DROP TYPE "public"."enum_authors_status";
  DROP TYPE "public"."enum__authors_v_version_status";`)
}
