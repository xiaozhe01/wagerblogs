import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reviews" ADD COLUMN "logo_id" integer;
  ALTER TABLE "_reviews_v" ADD COLUMN "version_logo_id" integer;
  ALTER TABLE "bonus_offers" ADD COLUMN "logo_id" integer;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bonus_offers" ADD CONSTRAINT "bonus_offers_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "reviews_logo_idx" ON "reviews" USING btree ("logo_id");
  CREATE INDEX "_reviews_v_version_version_logo_idx" ON "_reviews_v" USING btree ("version_logo_id");
  CREATE INDEX "bonus_offers_logo_idx" ON "bonus_offers" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reviews" DROP CONSTRAINT "reviews_logo_id_media_id_fk";
  
  ALTER TABLE "_reviews_v" DROP CONSTRAINT "_reviews_v_version_logo_id_media_id_fk";
  
  ALTER TABLE "bonus_offers" DROP CONSTRAINT "bonus_offers_logo_id_media_id_fk";
  
  DROP INDEX "reviews_logo_idx";
  DROP INDEX "_reviews_v_version_version_logo_idx";
  DROP INDEX "bonus_offers_logo_idx";
  ALTER TABLE "reviews" DROP COLUMN "logo_id";
  ALTER TABLE "_reviews_v" DROP COLUMN "version_logo_id";
  ALTER TABLE "bonus_offers" DROP COLUMN "logo_id";`)
}
