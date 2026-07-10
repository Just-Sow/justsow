import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { env } from '../src/config/env.js';
import { buildApp } from '../src/app.js';
import { clearContactSubmissions } from '../src/dev/contact-outbox.js';
import {
  clearDevelopmentEmails,
  listDevelopmentEmails,
} from '../src/dev/email-outbox.js';

const contactOutboxPath = resolve(process.cwd(), env.CONTACT_OUTBOX_PATH);

test.beforeEach(async () => {
  await clearContactSubmissions();
  await clearDevelopmentEmails();
});

test('POST /api/contact stores the submission and returns success', async () => {
  const app = buildApp();

  try {
    const response = await app.inject({
      method: 'POST',
      url: '/api/contact',
      payload: {
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        message: 'I would like to ask about the best way to submit a project idea.',
      },
    });

    assert.equal(response.statusCode, 201);

    const payload = response.json() as {
      status: boolean;
      submissionId: string;
    };
    assert.equal(payload.status, true);
    assert.ok(payload.submissionId);

    const file = await readFile(contactOutboxPath, 'utf8');
    const submissions = JSON.parse(file) as Array<{
      name: string;
      email: string;
      subject: string;
      message: string;
    }>;

    assert.equal(submissions.length, 1);
    const [submission] = submissions;
    assert.ok(submission);
    assert.equal(submission.name, 'Ada Lovelace');
    assert.equal(submission.email, 'ada@example.com');
    assert.equal(submission.subject, 'Contact enquiry from Ada Lovelace');
    assert.match(submission.message, /project idea/i);

    const emails = await listDevelopmentEmails();
    assert.equal(emails.length, 2);
    assert.equal(emails[0]?.kind, 'contact_notification');
    assert.equal(emails[0]?.email, 'gatekeeper@justsow.org');
    assert.deepEqual(emails[0]?.recipients, ['gatekeeper@justsow.org']);
    assert.equal(emails[0]?.replyTo, 'ada@example.com');
    assert.match(emails[0]?.text ?? '', /Ada Lovelace/);
    assert.equal(emails[1]?.kind, 'contact_acknowledgement');
    assert.equal(emails[1]?.email, 'ada@example.com');
    assert.equal(emails[1]?.replyTo, 'gatekeeper@justsow.org');
  } finally {
    await app.close();
  }
});

test('POST /api/contact rejects invalid submissions', async () => {
  const app = buildApp();

  try {
    const response = await app.inject({
      method: 'POST',
      url: '/api/contact',
      payload: {
        name: '',
        email: 'not-an-email',
        message: 'Too short',
      },
    });

    assert.equal(response.statusCode, 400);
    assert.match(response.json().message, /check the form fields/i);
  } finally {
    await app.close();
  }
});
