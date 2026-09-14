import * as migration_20260914_055459_initial_schema from './20260914_055459_initial_schema';

export const migrations = [
  {
    up: migration_20260914_055459_initial_schema.up,
    down: migration_20260914_055459_initial_schema.down,
    name: '20260914_055459_initial_schema'
  },
];
