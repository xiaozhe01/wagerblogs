import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" ADD COLUMN "crumb" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_crumb" varchar;
  ALTER TABLE "news" ADD COLUMN "crumb" varchar;
  ALTER TABLE "_news_v" ADD COLUMN "version_crumb" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DROP COLUMN "crumb";
  ALTER TABLE "_articles_v" DROP COLUMN "version_crumb";
  ALTER TABLE "news" DROP COLUMN "crumb";
  ALTER TABLE "_news_v" DROP COLUMN "version_crumb";`)
}
