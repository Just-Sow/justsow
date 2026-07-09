import { config as loadEnv } from 'dotenv';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

loadEnv({ path: resolve(currentDirectory, '../../../.env') });
loadEnv({ path: resolve(currentDirectory, '../.env'), override: false });

if (process.env.DATABASE_TEST_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_TEST_URL;
}

const result = spawnSync(
  process.execPath,
  ['--import', 'tsx', '--test', '--test-concurrency=1', 'tests/*.test.ts'],
  {
    cwd: resolve(currentDirectory, '..'),
    stdio: 'inherit',
    env: process.env,
  }
);

process.exit(result.status ?? 1);
