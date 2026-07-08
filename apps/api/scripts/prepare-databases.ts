import { config as loadEnv } from 'dotenv';
import { Client } from 'pg';

loadEnv();

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://justsow:justsow@127.0.0.1:5432/justsow_dev';
const testDatabaseName = process.env.POSTGRES_TEST_DB ?? 'justsow_test';

const createDatabaseIfMissing = async () => {
  const databaseUrl = new URL(connectionString);
  const targetDatabase = databaseUrl.pathname.replace(/^\//, '');

  if (!targetDatabase) {
    throw new Error('DATABASE_URL must include a database name');
  }

  databaseUrl.pathname = '/postgres';

  const client = new Client({
    connectionString: databaseUrl.toString(),
  });

  await client.connect();

  const databaseNames = [targetDatabase, testDatabaseName];

  for (const databaseName of databaseNames) {
    const result = await client.query<{ exists: boolean }>(
      'select exists(select 1 from pg_database where datname = $1) as exists',
      [databaseName]
    );

    if (result.rows[0]?.exists) {
      continue;
    }

    await client.query(`create database "${databaseName.replace(/"/g, '""')}"`);
  }

  await client.end();
};

void createDatabaseIfMissing();
