import { config as loadEnv } from 'dotenv';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

loadEnv({ path: resolve(currentDirectory, '../../../.env') });
loadEnv({ path: resolve(currentDirectory, '../.env'), override: false });

const testDatabaseUrl = process.env.DATABASE_TEST_URL;

if (!testDatabaseUrl) {
  throw new Error(
    'DATABASE_TEST_URL must be set before running test migrations'
  );
}

const result = spawnSync(
  process.execPath,
  [
    './node_modules/drizzle-kit/bin.cjs',
    'migrate',
    '--config=drizzle.config.ts',
  ],
  {
    cwd: resolve(currentDirectory, '..'),
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: testDatabaseUrl,
    },
  }
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
