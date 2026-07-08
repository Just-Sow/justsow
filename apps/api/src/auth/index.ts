import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { betterAuth } from 'better-auth';
import { toNodeHandler } from 'better-auth/node';
import { twoFactor } from 'better-auth/plugins/two-factor';
import {
  authCapabilities,
  authValidation,
  buildFullName,
  hasRequiredPasswordSymbols,
  isValidFirstName,
  isValidLastName,
  normalizeNamePart,
} from '../../../../packages/shared/src/index.js';
import { env } from '../config/env.js';
import { db } from '../db/client.js';
import * as schema from '../db/schema/auth.js';
import { queueDevelopmentEmail } from '../dev/email-outbox.js';

const trustedOrigins = [
  new URL(env.BETTER_AUTH_URL).origin,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

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
    url: data.url,
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
    url: data.url,
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
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email') {
        if (typeof ctx.body.firstName !== 'string' || !isValidFirstName(ctx.body.firstName)) {
          throw APIError.from('BAD_REQUEST', {
            code: 'INVALID_FIRST_NAME',
            message: 'Please enter your first name.',
          });
        }

        if (typeof ctx.body.lastName !== 'string' || !isValidLastName(ctx.body.lastName)) {
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

      if (ctx.path === '/reset-password' || ctx.path === '/change-password' || ctx.path === '/set-password') {
        validatePasswordStrength(ctx.body.newPassword);
      }
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
