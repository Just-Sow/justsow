import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { env } from '../config/env.js';

export interface DevelopmentEmailRecord {
  id: string;
  kind:
    | 'verification'
    | 'password_reset'
    | 'contact_acknowledgement'
    | 'contact_notification';
  email: string;
  recipients?: string[];
  subject?: string;
  text?: string;
  replyTo?: string | null;
  url?: string;
  token?: string;
  createdAt: string;
}

const outboxPath = resolve(process.cwd(), env.DEV_EMAIL_OUTBOX_PATH);

const readOutbox = async () => {
  try {
    const file = await readFile(outboxPath, 'utf8');
    return JSON.parse(file) as DevelopmentEmailRecord[];
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      return [];
    }

    throw error;
  }
};

const writeOutbox = async (records: readonly DevelopmentEmailRecord[]) => {
  await mkdir(dirname(outboxPath), { recursive: true });
  await writeFile(outboxPath, JSON.stringify(records, null, 2));
};

export const queueDevelopmentEmail = async (
  input: Omit<DevelopmentEmailRecord, 'id' | 'createdAt'>
) => {
  const records = await readOutbox();
  const record: DevelopmentEmailRecord = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  records.unshift(record);
  await writeOutbox(records);

  return record;
};

export const listDevelopmentEmails = async () => {
  return readOutbox();
};

export const clearDevelopmentEmails = async () => {
  await writeOutbox([]);
};
