import { z } from 'zod';
import type { FastifyPluginAsync } from 'fastify';
import { authCapabilities } from '../../../../packages/shared/src/index.js';
import {
  authBasePath,
  authNodeHandler,
  authSetupSummary,
} from '../auth/index.js';
import { createManualSowerProfile, listSowerProfiles } from '../auth/sowers.js';
import { env } from '../config/env.js';
import {
  clearDevelopmentEmails,
  listDevelopmentEmails,
} from '../dev/email-outbox.js';

const isDevelopmentEmailOutboxEnabled =
  env.NODE_ENV === 'development' || env.NODE_ENV === 'test';
const createDevSowerProfileSchema = z.object({
  displayName: z.string().min(1),
  contactEmail: z.email().optional(),
  notes: z.string().min(1).optional(),
});

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
        authUrl: env.BETTER_AUTH_URL,
        developmentEmailOutboxEnabled: isDevelopmentEmailOutboxEnabled,
        usesDevelopmentSecret:
          env.BETTER_AUTH_SECRET ===
          'replace-this-with-a-real-development-secret',
      },
    };
  });

  app.get('/auth/dev/emails', async (request, reply) => {
    if (!isDevelopmentEmailOutboxEnabled) {
      return reply.code(404).send({
        error: 'NOT_FOUND',
      });
    }

    return {
      emails: await listDevelopmentEmails(),
    };
  });

  app.delete('/auth/dev/emails', async (request, reply) => {
    if (!isDevelopmentEmailOutboxEnabled) {
      return reply.code(404).send({
        error: 'NOT_FOUND',
      });
    }

    await clearDevelopmentEmails();

    return {
      status: true,
    };
  });

  app.get('/auth/dev/sower-profiles', async (request, reply) => {
    if (!isDevelopmentEmailOutboxEnabled) {
      return reply.code(404).send({
        error: 'NOT_FOUND',
      });
    }

    return {
      profiles: await listSowerProfiles(),
    };
  });

  app.post('/auth/dev/sower-profiles', async (request, reply) => {
    if (!isDevelopmentEmailOutboxEnabled) {
      return reply.code(404).send({
        error: 'NOT_FOUND',
      });
    }

    const body = createDevSowerProfileSchema.parse(request.body);
    const profile = await createManualSowerProfile({
      displayName: body.displayName,
      contactEmail: body.contactEmail,
      notes: body.notes,
    });

    return reply.code(201).send({
      profile,
    });
  });
};
