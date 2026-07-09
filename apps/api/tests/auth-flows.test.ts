import test from 'node:test';
import assert from 'node:assert/strict';
import { eq } from 'drizzle-orm';
import { buildApp } from '../src/app.js';
import { db } from '../src/db/client.js';
import { user } from '../src/db/schema/auth.js';
import { createManualSowerProfile } from '../src/auth/sowers.js';
import { userRoleAssignment } from '../src/db/schema/app.js';
import { extractTokenFromUrl, resetTestState } from './helpers.js';

const jsonHeaders = {
  'content-type': 'application/json',
};

const authRequestHeaders = {
  ...jsonHeaders,
  origin: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
};

const startServer = async () => {
  const app = buildApp();
  await app.listen({
    host: '127.0.0.1',
    port: 0,
  });

  const address = app.server.address();

  if (!address || typeof address === 'string') {
    throw new Error('Expected TCP server address for auth flow tests');
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;

  return {
    app,
    baseUrl,
    close: async () => {
      await app.close();
    },
  };
};

const getCookieHeader = (response: Response) => {
  return response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(';', 1)[0])
    .join('; ');
};

test.beforeEach(async () => {
  await resetTestState();
});

test('sign-up queues verification email and dev outbox endpoints expose it', async () => {
  const server = await startServer();

  try {
    const signUp = await fetch(`${server.baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: authRequestHeaders,
      body: JSON.stringify({
        name: 'Auth Test User',
        firstName: 'Auth',
        lastName: 'User',
        email: 'auth-flow@example.com',
        password: 'test-password-123',
      }),
    });

    assert.equal(signUp.status, 200);
    const signUpPayload = await signUp.json();
    assert.equal(signUpPayload.user.email, 'auth-flow@example.com');

    const emails = await fetch(`${server.baseUrl}/auth/dev/emails`);
    assert.equal(emails.status, 200);
    const emailPayload = await emails.json();

    assert.equal(emailPayload.emails.length, 1);
    assert.equal(emailPayload.emails[0].kind, 'verification');
    assert.equal(emailPayload.emails[0].email, 'auth-flow@example.com');
    assert.ok(extractTokenFromUrl(emailPayload.emails[0].url));
  } finally {
    await server.close();
  }
});

test('manual sower profiles are auto-claimed on sign-up by matching email', async () => {
  const server = await startServer();

  try {
    const profile = await createManualSowerProfile({
      displayName: 'Claimable Sower',
      contactEmail: 'claimable-sower@example.com',
      notes: 'Created directly for claim flow testing.',
    });

    assert.equal(profile.contactEmail, 'claimable-sower@example.com');
    assert.equal(profile.linkedUserId, null);

    const signUp = await fetch(`${server.baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: authRequestHeaders,
      body: JSON.stringify({
        name: 'Claimable Sower',
        firstName: 'Claimable',
        lastName: 'Sower',
        email: 'claimable-sower@example.com',
        password: 'claimable-password-123!',
      }),
    });

    assert.equal(signUp.status, 200);

    const queuedEmails = await fetch(`${server.baseUrl}/auth/dev/emails`);
    const emailPayload = await queuedEmails.json();
    const verificationToken = extractTokenFromUrl(emailPayload.emails[0].url);

    assert.ok(verificationToken);

    await fetch(
      `${server.baseUrl}/api/auth/verify-email?token=${verificationToken}&callbackURL=%2F`,
      {
        redirect: 'manual',
      }
    );

    const signIn = await fetch(`${server.baseUrl}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: authRequestHeaders,
      body: JSON.stringify({
        email: 'claimable-sower@example.com',
        password: 'claimable-password-123!',
      }),
    });

    assert.equal(signIn.status, 200);
    const cookieHeader = getCookieHeader(signIn);

    const me = await fetch(`${server.baseUrl}/auth/me`, {
      headers: {
        cookie: cookieHeader,
      },
    });

    assert.equal(me.status, 200);
    const mePayload = await me.json();

    assert.equal(mePayload.sowerProfile.displayName, 'Claimable Sower');
    assert.equal(
      mePayload.sowerProfile.contactEmail,
      'claimable-sower@example.com'
    );
    assert.equal(mePayload.sowerProfile.linkedUserId, mePayload.user.id);
    assert.ok(mePayload.sowerProfile.claimedAt);
    assert.deepEqual(mePayload.roles, ['sower']);
  } finally {
    await server.close();
  }
});

test('sign-up requires both first and last names', async () => {
  const server = await startServer();

  try {
    const signUp = await fetch(`${server.baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: authRequestHeaders,
      body: JSON.stringify({
        name: 'Singleword Placeholder',
        firstName: 'Singleword',
        lastName: '',
        email: 'invalid-name@example.com',
        password: 'test-password-123',
      }),
    });

    assert.equal(signUp.status, 400);
    const payload = await signUp.json();
    assert.equal(payload.code, 'INVALID_LAST_NAME');
    assert.match(payload.message, /last name/i);
  } finally {
    await server.close();
  }
});

test('sign-up does not create a second account for a duplicate email address', async () => {
  const server = await startServer();

  try {
    const firstSignUp = await fetch(
      `${server.baseUrl}/api/auth/sign-up/email`,
      {
        method: 'POST',
        headers: authRequestHeaders,
        body: JSON.stringify({
          name: 'Duplicate User',
          firstName: 'Duplicate',
          lastName: 'User',
          email: 'duplicate-user@example.com',
          password: 'test-password-123!',
        }),
      }
    );

    assert.equal(firstSignUp.status, 200);

    const secondSignUp = await fetch(
      `${server.baseUrl}/api/auth/sign-up/email`,
      {
        method: 'POST',
        headers: authRequestHeaders,
        body: JSON.stringify({
          name: 'Another User',
          firstName: 'Another',
          lastName: 'User',
          email: 'duplicate-user@example.com',
          password: 'test-password-123!',
        }),
      }
    );

    assert.equal(secondSignUp.status, 200);

    const users = await db
      .select()
      .from(user)
      .where(eq(user.email, 'duplicate-user@example.com'));

    assert.equal(users.length, 1);
    const existingUser = users[0];

    assert.ok(existingUser);
    assert.equal(existingUser.firstName, 'Duplicate');
    assert.equal(existingUser.lastName, 'User');
    assert.equal(existingUser.name, 'Duplicate User');
  } finally {
    await server.close();
  }
});

test('sign-up rejects passwords without a symbol', async () => {
  const server = await startServer();

  try {
    const signUp = await fetch(`${server.baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: authRequestHeaders,
      body: JSON.stringify({
        name: 'Symbol Missing',
        firstName: 'Symbol',
        lastName: 'Missing',
        email: 'weak-password@example.com',
        password: 'testpassword123',
      }),
    });

    assert.equal(signUp.status, 400);
    const payload = await signUp.json();
    assert.equal(payload.code, 'WEAK_PASSWORD');
    assert.match(payload.message, /symbol/i);
  } finally {
    await server.close();
  }
});

test('email verification gates sign-in until verified, then exposes authenticated auth state', async () => {
  const server = await startServer();

  try {
    await fetch(`${server.baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: authRequestHeaders,
      body: JSON.stringify({
        name: 'Verified User',
        firstName: 'Verified',
        lastName: 'User',
        email: 'verified-user@example.com',
        password: 'test-password-123',
      }),
    });

    const blockedSignIn = await fetch(
      `${server.baseUrl}/api/auth/sign-in/email`,
      {
        method: 'POST',
        headers: authRequestHeaders,
        body: JSON.stringify({
          email: 'verified-user@example.com',
          password: 'test-password-123',
        }),
      }
    );

    assert.equal(blockedSignIn.status, 403);

    const queuedEmails = await fetch(`${server.baseUrl}/auth/dev/emails`);
    const emailPayload = await queuedEmails.json();
    const verificationEmail = emailPayload.emails.find(
      (email: { kind: string }) => email.kind === 'verification'
    );

    assert.ok(verificationEmail);

    const verificationToken = extractTokenFromUrl(verificationEmail.url);

    assert.ok(verificationToken);

    const verify = await fetch(
      `${server.baseUrl}/api/auth/verify-email?token=${verificationToken}&callbackURL=%2F`,
      {
        redirect: 'manual',
      }
    );

    assert.equal(verify.status, 302);

    const signIn = await fetch(`${server.baseUrl}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: authRequestHeaders,
      body: JSON.stringify({
        email: 'verified-user@example.com',
        password: 'test-password-123',
      }),
    });

    assert.equal(signIn.status, 200);
    const signInPayload = await signIn.json();
    assert.equal(signInPayload.user.email, 'verified-user@example.com');

    const cookieHeader = getCookieHeader(signIn);

    const me = await fetch(`${server.baseUrl}/auth/me`, {
      headers: {
        cookie: cookieHeader,
      },
    });

    assert.equal(me.status, 200);
    const mePayload = await me.json();

    assert.deepEqual(mePayload.roles, []);
    assert.deepEqual(mePayload.security.twoFactor, {
      enabled: false,
      enabledAt: null,
      required: false,
      requiredForRoles: [],
      satisfied: true,
    });

    const security = await fetch(`${server.baseUrl}/auth/security`, {
      headers: {
        cookie: cookieHeader,
      },
    });

    assert.equal(security.status, 200);
    const securityPayload = await security.json();
    assert.equal(
      securityPayload.routes.manage.enable,
      '/api/auth/two-factor/enable'
    );
  } finally {
    await server.close();
  }
});

test('password reset queues a reset email and the new password becomes usable', async () => {
  const server = await startServer();

  try {
    await fetch(`${server.baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: authRequestHeaders,
      body: JSON.stringify({
        name: 'Reset User',
        firstName: 'Reset',
        lastName: 'User',
        email: 'reset-user@example.com',
        password: 'original-password-123',
      }),
    });

    const clearOutbox = await fetch(`${server.baseUrl}/auth/dev/emails`, {
      method: 'DELETE',
    });

    assert.equal(clearOutbox.status, 200);

    const resetRequest = await fetch(
      `${server.baseUrl}/api/auth/request-password-reset`,
      {
        method: 'POST',
        headers: authRequestHeaders,
        body: JSON.stringify({
          email: 'reset-user@example.com',
          redirectTo: '/reset-password',
        }),
      }
    );

    assert.equal(resetRequest.status, 200);

    const queuedEmails = await fetch(`${server.baseUrl}/auth/dev/emails`);
    const emailPayload = await queuedEmails.json();
    const resetEmail = emailPayload.emails.find(
      (email: { kind: string }) => email.kind === 'password_reset'
    );

    assert.ok(resetEmail);
    assert.ok(resetEmail.token);

    const resetPassword = await fetch(
      `${server.baseUrl}/api/auth/reset-password?token=${resetEmail.token}`,
      {
        method: 'POST',
        headers: authRequestHeaders,
        body: JSON.stringify({
          newPassword: 'updated-password-123',
        }),
      }
    );

    assert.equal(resetPassword.status, 200);
    assert.equal((await resetPassword.json()).status, true);

    const oldPasswordSignIn = await fetch(
      `${server.baseUrl}/api/auth/sign-in/email`,
      {
        method: 'POST',
        headers: authRequestHeaders,
        body: JSON.stringify({
          email: 'reset-user@example.com',
          password: 'original-password-123',
        }),
      }
    );

    assert.equal(oldPasswordSignIn.status, 401);

    const newPasswordSignIn = await fetch(
      `${server.baseUrl}/api/auth/sign-in/email`,
      {
        method: 'POST',
        headers: authRequestHeaders,
        body: JSON.stringify({
          email: 'reset-user@example.com',
          password: 'updated-password-123',
        }),
      }
    );

    assert.equal(newPasswordSignIn.status, 403);
  } finally {
    await server.close();
  }
});

test('required-role users are blocked from privileged routes until two-factor is enabled', async () => {
  const server = await startServer();

  try {
    await fetch(`${server.baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: authRequestHeaders,
      body: JSON.stringify({
        name: 'Admin User',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin-user@example.com',
        password: 'admin-password-123',
      }),
    });

    const emails = await fetch(`${server.baseUrl}/auth/dev/emails`);
    const emailPayload = await emails.json();
    const verificationToken = extractTokenFromUrl(emailPayload.emails[0].url);

    assert.ok(verificationToken);

    await fetch(
      `${server.baseUrl}/api/auth/verify-email?token=${verificationToken}&callbackURL=%2F`,
      {
        redirect: 'manual',
      }
    );

    const signIn = await fetch(`${server.baseUrl}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: authRequestHeaders,
      body: JSON.stringify({
        email: 'admin-user@example.com',
        password: 'admin-password-123',
      }),
    });

    const signInPayload = await signIn.json();
    const cookieHeader = getCookieHeader(signIn);
    const userId = signInPayload.user.id;

    await db.insert(userRoleAssignment).values({
      userId,
      role: 'admin',
    });

    const rolesResponse = await fetch(`${server.baseUrl}/auth/roles`, {
      headers: {
        cookie: cookieHeader,
      },
    });

    assert.equal(rolesResponse.status, 200);
    assert.deepEqual((await rolesResponse.json()).security.twoFactor, {
      enabled: false,
      enabledAt: null,
      required: true,
      requiredForRoles: ['admin'],
      satisfied: false,
    });

    const blockedRoute = await fetch(
      `${server.baseUrl}/auth/admin/sower-profiles`,
      {
        method: 'POST',
        headers: {
          ...jsonHeaders,
          cookie: cookieHeader,
        },
        body: JSON.stringify({
          displayName: 'Blocked Without 2FA',
        }),
      }
    );

    assert.equal(blockedRoute.status, 403);
    assert.deepEqual(await blockedRoute.json(), {
      error: 'TWO_FACTOR_REQUIRED',
      requiredForRoles: ['admin'],
    });

    const assignment = await db
      .select()
      .from(userRoleAssignment)
      .where(eq(userRoleAssignment.userId, userId));

    assert.equal(assignment.length, 1);
    assert.equal(assignment[0]?.role, 'admin');
  } finally {
    await server.close();
  }
});

test('authenticated users can update their phone number and changing a password records a timestamp', async () => {
  const server = await startServer();

  try {
    await fetch(`${server.baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: authRequestHeaders,
      body: JSON.stringify({
        name: 'Settings User',
        firstName: 'Settings',
        lastName: 'User',
        email: 'settings-user@example.com',
        password: 'settings-password-123!',
      }),
    });

    const emails = await fetch(`${server.baseUrl}/auth/dev/emails`);
    const emailPayload = await emails.json();
    const verificationToken = extractTokenFromUrl(emailPayload.emails[0].url);

    assert.ok(verificationToken);

    await fetch(
      `${server.baseUrl}/api/auth/verify-email?token=${verificationToken}&callbackURL=%2F`,
      {
        redirect: 'manual',
      }
    );

    const signIn = await fetch(`${server.baseUrl}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: authRequestHeaders,
      body: JSON.stringify({
        email: 'settings-user@example.com',
        password: 'settings-password-123!',
      }),
    });

    assert.equal(signIn.status, 200);
    const cookieHeader = getCookieHeader(signIn);

    const updatePhone = await fetch(`${server.baseUrl}/api/auth/update-user`, {
      method: 'POST',
      headers: {
        ...authRequestHeaders,
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        phoneNumber: '+61 400 000 000',
      }),
    });

    assert.equal(updatePhone.status, 200);

    const changePassword = await fetch(
      `${server.baseUrl}/api/auth/change-password`,
      {
        method: 'POST',
        headers: {
          ...authRequestHeaders,
          cookie: cookieHeader,
        },
        body: JSON.stringify({
          currentPassword: 'settings-password-123!',
          newPassword: 'updated-settings-password-123!',
          revokeOtherSessions: false,
        }),
      }
    );

    assert.equal(changePassword.status, 200);

    const me = await fetch(`${server.baseUrl}/auth/me`, {
      headers: {
        cookie: cookieHeader,
      },
    });

    assert.equal(me.status, 200);
    const mePayload = await me.json();

    assert.equal(mePayload.user.phoneNumber, '+61 400 000 000');
    assert.ok(mePayload.user.passwordChangedAt);
    assert.equal(mePayload.security.twoFactor.enabledAt, null);

    const users = await db
      .select()
      .from(user)
      .where(eq(user.email, 'settings-user@example.com'));

    assert.equal(users.length, 1);
    assert.equal(users[0]?.phoneNumber, '+61 400 000 000');
    assert.ok(users[0]?.passwordChangedAt);
  } finally {
    await server.close();
  }
});
