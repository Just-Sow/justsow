import { config as loadEnv } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

loadEnv({ path: resolve(currentDirectory, '../../../.env') });
loadEnv({ path: resolve(currentDirectory, '../../.env'), override: false });

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z
    .url()
    .default('postgres://justsow:justsow@127.0.0.1:5432/justsow_dev'),
  DATABASE_TEST_URL: z
    .url()
    .default('postgres://justsow:justsow@127.0.0.1:5432/justsow_test'),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32)
    .default('replace-this-with-a-real-development-secret'),
  BETTER_AUTH_URL: z.url().default('http://localhost:3000'),
  DEV_EMAIL_OUTBOX_PATH: z.string().default('apps/api/.data/dev-email-outbox.json'),
});

export const env = envSchema.parse(process.env);
