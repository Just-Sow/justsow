import { sql } from 'drizzle-orm';
import { db } from '../src/db/client.js';
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

export const resetDatabaseState = async () => {
  await db.execute(
    sql.raw(
      `TRUNCATE TABLE ${trackedTables.join(', ')} RESTART IDENTITY CASCADE`
    )
  );
  await clearDevelopmentEmails();
};
