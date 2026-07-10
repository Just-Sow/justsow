import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { env } from '../config/env.js';

export interface ContactSubmissionRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  ipAddress: string | null;
  userAgent: string | null;
}

const outboxPath = resolve(process.cwd(), env.CONTACT_OUTBOX_PATH);

const readOutbox = async () => {
  try {
    const file = await readFile(outboxPath, 'utf8');
    return JSON.parse(file) as ContactSubmissionRecord[];
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

const writeOutbox = async (records: readonly ContactSubmissionRecord[]) => {
  await mkdir(dirname(outboxPath), { recursive: true });
  await writeFile(outboxPath, JSON.stringify(records, null, 2));
};

export const queueContactSubmission = async (
  input: Omit<ContactSubmissionRecord, 'id' | 'createdAt'>
) => {
  const records = await readOutbox();
  const record: ContactSubmissionRecord = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  records.unshift(record);
  await writeOutbox(records);

  return record;
};

export const listContactSubmissions = async () => {
  return readOutbox();
};

export const clearContactSubmissions = async () => {
  await writeOutbox([]);
};
