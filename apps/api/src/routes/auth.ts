import type { FastifyPluginAsync } from 'fastify';
import { authCapabilities } from '../../../../packages/shared/src/index.js';
import { authBasePath, authNodeHandler, authSetupSummary } from '../auth/index.js';
import { env } from '../config/env.js';

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.all(`${authBasePath}/*`, async (request, reply) => {
    reply.hijack();
    await authNodeHandler(request.raw, reply.raw);
  });

  app.get('/auth/capabilities', async () => {
    return authCapabilities;
  });

  app.get('/auth/setup', async () => {
    return {
      ...authSetupSummary,
      configured: {
        databaseUrl: env.DATABASE_URL,
        authUrl: env.BETTER_AUTH_URL,
        usesDevelopmentSecret:
          env.BETTER_AUTH_SECRET === 'replace-this-with-a-real-development-secret',
      },
    };
  });
};
