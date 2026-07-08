import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { betterAuth } from 'better-auth';
import { toNodeHandler } from 'better-auth/node';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { authCapabilities } from '../../../../packages/shared/src/index.js';
import { env } from '../config/env.js';
import { db } from '../db/client.js';
import * as schema from '../db/schema/auth.js';

export const auth = betterAuth({
  appName: 'JustSow',
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  advanced: {
    database: {
      generateId: false,
    },
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
  supportsSowerClaiming: authCapabilities.sowerClaiming.enabled,
  twoFactor: 'totp_with_backup_codes',
};
