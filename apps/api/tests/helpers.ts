import { sql } from 'drizzle-orm';
import { db, pool } from '../src/db/client.js';
import { clearDevelopmentEmails } from '../src/dev/email-outbox.js';

const trackedTables = [
  'audit_event',
  'sower_claim',
  'sower_profile',
  'user_role_assignment',
  'two_factor',
  'session',
  'account',
  'verification',
  '"user"',
] as const;

export const resetTestState = async () => {
  await db.execute(sql.raw(`TRUNCATE TABLE ${trackedTables.join(', ')} RESTART IDENTITY CASCADE`));
  await clearDevelopmentEmails();
};

export const getSetCookieHeader = (setCookie: string | string[] | undefined) => {
  if (!setCookie) {
    return '';
  }

  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];

  return cookies
    .map((cookie) => cookie.split(';', 1)[0])
    .join('; ');
};

export const extractTokenFromUrl = (url: string) => {
  return new URL(url).searchParams.get('token');
};
