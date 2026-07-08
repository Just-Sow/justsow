import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { betterAuth } from 'better-auth';
import { toNodeHandler } from 'better-auth/node';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { authCapabilities } from '../../../../packages/shared/src/index.js';
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
  emailAndPassword: {
    enabled: true,
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
