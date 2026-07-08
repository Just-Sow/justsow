import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const envSchema = z.object({
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
});

export const env = envSchema.parse(process.env);
