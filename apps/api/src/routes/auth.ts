import type { FastifyPluginAsync } from 'fastify';
import { authCapabilities } from '../../../../packages/shared/src/index.js';
import { authBasePath, authNodeHandler, authSetupSummary } from '../auth/index.js';
import { env } from '../config/env.js';
import {
  clearDevelopmentEmails,
  listDevelopmentEmails,
} from '../dev/email-outbox.js';

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.all(`${authBasePath}/*`, async (request, reply) => {
    reply.hijack();
    const rawRequest = request.raw as typeof request.raw & {
      body?: unknown;
      originalUrl?: string;
    };

    Object.assign(rawRequest, {
      body: request.body,
      originalUrl: rawRequest.originalUrl ?? request.url,
    });
    await authNodeHandler(rawRequest, reply.raw);
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
        devEmailOutboxPath: env.DEV_EMAIL_OUTBOX_PATH,
        usesDevelopmentSecret:
          env.BETTER_AUTH_SECRET === 'replace-this-with-a-real-development-secret',
      },
    };
  });

  app.get('/auth/dev/emails', async (request, reply) => {
    if (env.NODE_ENV === 'production') {
      return reply.code(404).send({
        error: 'NOT_FOUND',
      });
    }

    return {
      emails: await listDevelopmentEmails(),
    };
  });

  app.delete('/auth/dev/emails', async (request, reply) => {
    if (env.NODE_ENV === 'production') {
      return reply.code(404).send({
        error: 'NOT_FOUND',
      });
    }

    await clearDevelopmentEmails();

    return {
      status: true,
    };
  });
};
