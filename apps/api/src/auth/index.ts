import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { betterAuth } from 'better-auth';
import { toNodeHandler } from 'better-auth/node';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { eq } from 'drizzle-orm';
import {
  authCapabilities,
  authValidation,
  buildFullName,
  hasRequiredPasswordSymbols,
  isValidFirstName,
  isValidLastName,
  isValidPhoneNumber,
  normalizePhoneNumber,
  normalizeNamePart,
} from '../../../../packages/shared/src/index.js';
import { env } from '../config/env.js';
import { createAuditEvent } from '../audit/events.js';
import { assignUserRole } from './roles.js';
import { db } from '../db/client.js';
import * as schema from '../db/schema/auth.js';
import { queueDevelopmentEmail } from '../dev/email-outbox.js';
import {
  claimSowerProfileForUser,
  findUnclaimedSowerProfileByEmail,
} from './sowers.js';

const trustedOrigins = [
  new URL(env.BETTER_AUTH_URL).origin,
  env.JUSTSOW_APP_ORIGIN,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const buildAppUrl = (path: string, searchParams?: URLSearchParams) => {
  const url = new URL(path, env.JUSTSOW_APP_ORIGIN);

  if (searchParams) {
    url.search = searchParams.toString();
  }

  return url.toString();
};

const toFrontendVerificationUrl = (url: string, token: string) => {
  const source = new URL(url);
  const callbackURL = source.searchParams.get('callbackURL') ?? '/login';
  const searchParams = new URLSearchParams({
    token,
    callbackURL,
  });

  return buildAppUrl('/verify-email', searchParams);
};

const toFrontendPasswordResetUrl = (token: string) => {
  return buildAppUrl(`/reset-password/${token}`);
};

const queueVerificationEmail = async (data: {
  user: {
    email: string;
  };
  url: string;
  token: string;
}) => {
  await queueDevelopmentEmail({
    kind: 'verification',
    email: data.user.email,
    url: toFrontendVerificationUrl(data.url, data.token),
    token: data.token,
  });
};

const validatePasswordStrength = (password: unknown) => {
  if (typeof password !== 'string') {
    return;
  }

  if (!hasRequiredPasswordSymbols(password)) {
    throw APIError.from('BAD_REQUEST', {
      code: 'WEAK_PASSWORD',
      message: `Password must include at least ${authValidation.passwordMinSymbols} symbol.`,
    });
  }
};

const validatePhoneNumberInput = (phoneNumber: unknown) => {
  if (phoneNumber === null || phoneNumber === undefined) {
    return null;
  }

  if (typeof phoneNumber !== 'string') {
    throw APIError.from('BAD_REQUEST', {
      code: 'INVALID_PHONE_NUMBER',
      message: 'Enter a valid phone number.',
    });
  }

  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

  if (!normalizedPhoneNumber) {
    return null;
  }

  if (!isValidPhoneNumber(normalizedPhoneNumber)) {
    throw APIError.from('BAD_REQUEST', {
      code: 'INVALID_PHONE_NUMBER',
      message: 'Enter a valid phone number.',
    });
  }

  return normalizedPhoneNumber;
};

const passwordTimestampPaths = new Set([
  '/change-password',
  '/reset-password',
  '/set-password',
]);

const updatePasswordChangedAt = async (userId: string) => {
  await db
    .update(schema.user)
    .set({
      passwordChangedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(schema.user.id, userId));
};

const queuePasswordResetEmail = async (data: {
  user: {
    email: string;
  };
  url: string;
  token: string;
}) => {
  await queueDevelopmentEmail({
    kind: 'password_reset',
    email: data.user.email,
    url: toFrontendPasswordResetUrl(data.token),
    token: data.token,
  });
};

export const auth = betterAuth({
  appName: 'JustSow',
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  user: {
    additionalFields: {
      firstName: {
        type: 'string',
        required: true,
      },
      lastName: {
        type: 'string',
        required: true,
      },
      phoneNumber: {
        type: 'string',
        required: false,
      },
      twoFactorEnabledAt: {
        type: 'date',
        input: false,
        required: false,
      },
      passwordChangedAt: {
        type: 'date',
        input: false,
        required: false,
      },
    },
    changeEmail: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: authValidation.passwordMinLength,
    maxPasswordLength: authValidation.passwordMaxLength,
    requireEmailVerification: true,
    sendResetPassword: queuePasswordResetEmail,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: queueVerificationEmail,
  },
  plugins: [
    twoFactor({
      issuer: 'JustSow',
      trustDeviceMaxAge: 60 * 60 * 24 * 30,
      totpOptions: {
        digits: 6,
        period: 30,
      },
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const matchedSowerProfile = await findUnclaimedSowerProfileByEmail(
            user.email
          );

          if (!matchedSowerProfile) {
            return;
          }

          const claimedProfile = await claimSowerProfileForUser({
            profileId: matchedSowerProfile.id,
            userId: user.id,
          });

          if (!claimedProfile) {
            return;
          }

          await assignUserRole({
            userId: user.id,
            role: 'sower',
            reason:
              'Auto-assigned after matching a manual sower profile by email during sign-up.',
          });

          await createAuditEvent({
            actorType: 'system',
            action: 'sower_profile.auto_claimed_on_signup',
            targetType: 'sower_profile',
            targetId: claimedProfile.id,
            metadata: {
              userId: user.id,
              matchedEmail: user.email,
            },
          });
        },
      },
      update: {
        before: async (user, context) => {
          const updates = { ...user } as Record<string, unknown>;

          if ('phoneNumber' in updates) {
            updates.phoneNumber = validatePhoneNumberInput(updates.phoneNumber);
          }

          if (
            context?.path === '/two-factor/verify-totp' &&
            updates.twoFactorEnabled === true
          ) {
            updates.twoFactorEnabledAt = new Date();
          }

          if (
            context?.path === '/two-factor/disable' &&
            updates.twoFactorEnabled === false
          ) {
            updates.twoFactorEnabledAt = null;
          }

          return {
            data: updates,
          };
        },
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email') {
        if (
          typeof ctx.body.firstName !== 'string' ||
          !isValidFirstName(ctx.body.firstName)
        ) {
          throw APIError.from('BAD_REQUEST', {
            code: 'INVALID_FIRST_NAME',
            message: 'Please enter your first name.',
          });
        }

        if (
          typeof ctx.body.lastName !== 'string' ||
          !isValidLastName(ctx.body.lastName)
        ) {
          throw APIError.from('BAD_REQUEST', {
            code: 'INVALID_LAST_NAME',
            message: 'Please enter your last name.',
          });
        }

        const normalizedFirstName = normalizeNamePart(ctx.body.firstName);
        const normalizedLastName = normalizeNamePart(ctx.body.lastName);

        ctx.body.firstName = normalizedFirstName;
        ctx.body.lastName = normalizedLastName;
        ctx.body.name = buildFullName(normalizedFirstName, normalizedLastName);
        validatePasswordStrength(ctx.body.password);
        return;
      }

      if (
        ctx.path === '/update-user' &&
        typeof ctx.body === 'object' &&
        ctx.body !== null &&
        ('firstName' in ctx.body || 'lastName' in ctx.body)
      ) {
        if (
          typeof ctx.body.firstName !== 'string' ||
          !isValidFirstName(ctx.body.firstName)
        ) {
          throw APIError.from('BAD_REQUEST', {
            code: 'INVALID_FIRST_NAME',
            message: 'Please enter your first name.',
          });
        }

        if (
          typeof ctx.body.lastName !== 'string' ||
          !isValidLastName(ctx.body.lastName)
        ) {
          throw APIError.from('BAD_REQUEST', {
            code: 'INVALID_LAST_NAME',
            message: 'Please enter your last name.',
          });
        }

        const normalizedFirstName = normalizeNamePart(ctx.body.firstName);
        const normalizedLastName = normalizeNamePart(ctx.body.lastName);

        ctx.body.firstName = normalizedFirstName;
        ctx.body.lastName = normalizedLastName;
        ctx.body.name = buildFullName(normalizedFirstName, normalizedLastName);
        return;
      }

      if (
        ctx.path === '/update-user' &&
        typeof ctx.body === 'object' &&
        ctx.body !== null &&
        'phoneNumber' in ctx.body
      ) {
        ctx.body.phoneNumber = validatePhoneNumberInput(ctx.body.phoneNumber);
        return;
      }

      if (
        ctx.path === '/reset-password' ||
        ctx.path === '/change-password' ||
        ctx.path === '/set-password'
      ) {
        validatePasswordStrength(ctx.body.newPassword);
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (!passwordTimestampPaths.has(ctx.path)) {
        return;
      }

      const userId =
        ctx.context.session?.user.id ?? ctx.context.newSession?.user.id;

      if (!userId) {
        return;
      }

      await updatePasswordChangedAt(userId);
    }),
  },
});

export const authBasePath = '/api/auth';
export const authNodeHandler = toNodeHandler(auth);

export const authSetupSummary = {
  provider: 'better-auth',
  basePath: authBasePath,
  supportsEmailPassword: true,
  supportsEmailVerification: true,
  supportsPasswordReset: true,
  supportsSowerClaiming: authCapabilities.sowerClaiming.enabled,
  twoFactor: 'totp_with_backup_codes',
  usesDevelopmentEmailOutbox: env.NODE_ENV !== 'production',
  trustedOrigins,
};
