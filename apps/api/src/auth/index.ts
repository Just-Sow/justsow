import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { betterAuth } from 'better-auth';
import { toNodeHandler } from 'better-auth/node';
import { authCapabilities } from '../../../../packages/shared/src/index.js';
import { env } from '../config/env.js';
import { db } from '../db/client.js';
import * as schema from '../db/schema/auth.js';

export const auth = betterAuth({
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
  user: {
    additionalFields: {
      roles: {
        type: 'string',
        required: false,
        input: false,
      },
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
});

export const authBasePath = '/api/auth';
export const authNodeHandler = toNodeHandler(auth);

export const authSetupSummary = {
  provider: 'better-auth',
  basePath: authBasePath,
  supportsEmailPassword: true,
  supportsSowerClaiming: authCapabilities.sowerClaiming.enabled,
};
