import { config as loadEnv } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildApp } from '../src/app.js';
import { assignUserRole } from '../src/auth/roles.js';
import { createManualSowerProfile } from '../src/auth/sowers.js';
import { listDevelopmentEmails } from '../src/dev/email-outbox.js';
import { resetDatabaseState } from './database-state.js';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

loadEnv({ path: resolve(currentDirectory, '../../../.env') });
loadEnv({ path: resolve(currentDirectory, '../.env'), override: false });

const seededAdmin = {
  firstName: 'Admin',
  lastName: 'Testing',
  email: 'admin-testing@justsow.local',
  password: 'testing-password-123!',
};

const seededUnclaimedSower = {
  displayName: 'Unclaimed Testing Sower',
  contactEmail: 'unclaimed-sower@justsow.local',
  notes:
    'Seeded as an unclaimed sower profile for local auth and claim testing.',
};

const authRequestHeaders = {
  'content-type': 'application/json',
  origin: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
};

const extractTokenFromUrl = (url: string) => {
  return new URL(url).searchParams.get('token');
};

const startServer = async () => {
  const app = buildApp();
  await app.listen({
    host: '127.0.0.1',
    port: 0,
  });

  const address = app.server.address();

  if (!address || typeof address === 'string') {
    throw new Error('Expected a TCP server address for seeded auth setup');
  }

  return {
    app,
    baseUrl: `http://127.0.0.1:${address.port}`,
  };
};

const seedAdminAccount = async (baseUrl: string) => {
  const signUp = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: authRequestHeaders,
    body: JSON.stringify({
      name: `${seededAdmin.firstName} ${seededAdmin.lastName}`,
      firstName: seededAdmin.firstName,
      lastName: seededAdmin.lastName,
      email: seededAdmin.email,
      password: seededAdmin.password,
      callbackURL: '/login',
    }),
  });

  if (!signUp.ok) {
    throw new Error(
      `Failed to create seeded admin account: ${signUp.status} ${await signUp.text()}`
    );
  }

  const signUpPayload = (await signUp.json()) as { user?: { id: string } };

  if (!signUpPayload.user?.id) {
    throw new Error('Seeded admin sign-up did not return a user id');
  }

  const emails = await listDevelopmentEmails();
  const verificationEmail = emails.find(
    (email) =>
      email.kind === 'verification' && email.email === seededAdmin.email
  );

  if (!verificationEmail) {
    throw new Error(
      'Expected a verification email for the seeded admin account'
    );
  }

  const verificationToken = extractTokenFromUrl(verificationEmail.url);

  if (!verificationToken) {
    throw new Error(
      'Expected a verification token for the seeded admin account'
    );
  }

  const verify = await fetch(
    `${baseUrl}/api/auth/verify-email?token=${verificationToken}&callbackURL=%2Flogin`,
    {
      method: 'GET',
      redirect: 'manual',
    }
  );

  if (verify.status !== 302) {
    throw new Error(`Failed to verify seeded admin account: ${verify.status}`);
  }

  await assignUserRole({
    userId: signUpPayload.user.id,
    role: 'admin',
    reason: 'Seeded local admin account for development testing.',
  });

  return signUpPayload.user.id;
};

const main = async () => {
  await resetDatabaseState();

  const { app, baseUrl } = await startServer();

  try {
    const adminUserId = await seedAdminAccount(baseUrl);
    const sowerProfile = await createManualSowerProfile(seededUnclaimedSower);

    console.log(
      JSON.stringify(
        {
          status: 'ok',
          database:
            process.env.DATABASE_URL ??
            'postgres://justsow:justsow@127.0.0.1:5432/justsow_dev',
          seededAdmin: {
            userId: adminUserId,
            email: seededAdmin.email,
            password: seededAdmin.password,
          },
          seededUnclaimedSower: {
            profileId: sowerProfile.id,
            email: sowerProfile.contactEmail,
            displayName: sowerProfile.displayName,
          },
        },
        null,
        2
      )
    );
  } finally {
    await app.close();
  }
};

void main();
