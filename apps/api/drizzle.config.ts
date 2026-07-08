import { defineConfig } from 'drizzle-kit';

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://justsow:justsow@127.0.0.1:5432/justsow_dev';

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
