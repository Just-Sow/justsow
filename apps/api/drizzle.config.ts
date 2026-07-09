import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

loadEnv({ path: resolve(currentDirectory, '../../.env') });
loadEnv({ path: resolve(currentDirectory, '.env'), override: false });

const connectionString =
  process.env.DATABASE_URL ??
  'postgres://justsow:justsow@127.0.0.1:5432/justsow_dev';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
  verbose: true,
  strict: true,
});
