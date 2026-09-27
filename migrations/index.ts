import * as migration_20260914_055459_initial_schema from './20260914_055459_initial_schema';
import * as migration_20260917_080746_retire_duplicate_status_fields from './20260917_080746_retire_duplicate_status_fields';
import * as migration_20260917_080929_enable_drafts from './20260917_080929_enable_drafts';
import * as migration_20260918_094655_add_authors_seo_and_drafts from './20260918_094655_add_authors_seo_and_drafts';
import * as migration_20260926_105732_add_review_and_bonus_logo from './20260926_105732_add_review_and_bonus_logo';

export const migrations = [
  {
    up: migration_20260914_055459_initial_schema.up,
    down: migration_20260914_055459_initial_schema.down,
    name: '20260914_055459_initial_schema',
  },
  {
    up: migration_20260917_080746_retire_duplicate_status_fields.up,
    down: migration_20260917_080746_retire_duplicate_status_fields.down,
    name: '20260917_080746_retire_duplicate_status_fields',
  },
  {
    up: migration_20260917_080929_enable_drafts.up,
    down: migration_20260917_080929_enable_drafts.down,
    name: '20260917_080929_enable_drafts',
  },
  {
    up: migration_20260918_094655_add_authors_seo_and_drafts.up,
    down: migration_20260918_094655_add_authors_seo_and_drafts.down,
    name: '20260918_094655_add_authors_seo_and_drafts',
  },
  {
    up: migration_20260926_105732_add_review_and_bonus_logo.up,
    down: migration_20260926_105732_add_review_and_bonus_logo.down,
    name: '20260926_105732_add_review_and_bonus_logo'
  },
];
