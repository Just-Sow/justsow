import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
});

export const env = envSchema.parse(process.env);
