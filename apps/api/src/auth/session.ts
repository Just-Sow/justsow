import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyRequest } from 'fastify';
import type { UserRole } from '../../../../packages/shared/src/index.js';
import { auth } from './index.js';
import { listActiveRolesForUser } from './roles.js';

export const getRequestSession = async (request: FastifyRequest) => {
  return auth.api.getSession({
    headers: fromNodeHeaders(request.raw.headers),
  });
};

export const getRequestIdentity = async (request: FastifyRequest) => {
  const session = await getRequestSession(request);

  if (!session) {
    return null;
  }

  const roles = await listActiveRolesForUser(session.user.id);

  return {
    session: session.session,
    user: session.user,
    roles,
  };
};

export const hasRequiredRole = (roles: readonly UserRole[], requiredRoles: readonly UserRole[]) => {
  return requiredRoles.some((role) => roles.includes(role));
};
