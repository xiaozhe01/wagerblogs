import * as migration_20260914_055459_initial_schema from './20260914_055459_initial_schema';
import * as migration_20260917_080746_retire_duplicate_status_fields from './20260917_080746_retire_duplicate_status_fields';

export const migrations = [
  {
    up: migration_20260914_055459_initial_schema.up,
    down: migration_20260914_055459_initial_schema.down,
    name: '20260914_055459_initial_schema',
  },
  {
    up: migration_20260917_080746_retire_duplicate_status_fields.up,
    down: migration_20260917_080746_retire_duplicate_status_fields.down,
    name: '20260917_080746_retire_duplicate_status_fields'
  },
];
