import type { FastifyPluginAsync } from 'fastify';
import { authCapabilities } from '../../../../packages/shared/src/index.js';
import {
  authBasePath,
  authNodeHandler,
  authSetupSummary,
} from '../auth/index.js';
import { env } from '../config/env.js';
import {
  clearDevelopmentEmails,
  listDevelopmentEmails,
} from '../dev/email-outbox.js';

const isDevelopmentEmailOutboxEnabled =
  env.NODE_ENV === 'development' || env.NODE_ENV === 'test';

const authRouteRateLimitWindowMs = 60_000;
const authRouteRateLimitMaxRequests = 120;

type AuthRouteRateLimitBucket = {
  count: number;
  resetAt: number;
};

const authRouteRateLimits = new Map<string, AuthRouteRateLimitBucket>();

const getAuthRouteRateLimitKey = (request: {
  ip?: string;
  socket: { remoteAddress?: string | null };
}) => {
  return request.ip ?? request.socket.remoteAddress ?? 'unknown';
};

const consumeAuthRouteRateLimit = (request: {
  ip?: string;
  socket: { remoteAddress?: string | null };
}) => {
  const key = getAuthRouteRateLimitKey(request);
  const now = Date.now();
  const bucket = authRouteRateLimits.get(key);

  if (!bucket || bucket.resetAt <= now) {
    authRouteRateLimits.set(key, {
      count: 1,
      resetAt: now + authRouteRateLimitWindowMs,
    });

    return {
      allowed: true,
    };
  }

  if (bucket.count >= authRouteRateLimitMaxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;

  return {
    allowed: true,
  };
};

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.all(`${authBasePath}/*`, async (request, reply) => {
    const rateLimit = consumeAuthRouteRateLimit(request);

    if (!rateLimit.allowed) {
      reply.header('retry-after', String(rateLimit.retryAfterSeconds));
      return reply.code(429).send({
        error: 'RATE_LIMITED',
      });
    }

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
};
