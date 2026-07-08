import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyRequest } from 'fastify';
import {
  roleRequiresTwoFactor,
  type UserRole,
} from '../../../../packages/shared/src/index.js';
import { auth } from './index.js';
import { listActiveRolesForUser } from './roles.js';

interface TwoFactorCapableUser {
  twoFactorEnabled?: boolean | null;
}

export interface IdentityTwoFactorState {
  enabled: boolean;
  required: boolean;
  requiredForRoles: UserRole[];
  satisfied: boolean;
}

const hasTwoFactorEnabled = (user: unknown): user is TwoFactorCapableUser => {
  return typeof user === 'object' && user !== null && 'twoFactorEnabled' in user;
};

export const getIdentityTwoFactorState = (
  roles: readonly UserRole[],
  user: unknown
): IdentityTwoFactorState => {
  const enabled = hasTwoFactorEnabled(user) && user.twoFactorEnabled === true;
  const requiredForRoles = roles.filter((role) => roleRequiresTwoFactor(role));

  return {
    enabled,
    required: requiredForRoles.length > 0,
    requiredForRoles,
    satisfied: requiredForRoles.length === 0 || enabled,
  };
};

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
  const twoFactor = getIdentityTwoFactorState(roles, session.user);

  return {
    session: session.session,
    user: session.user,
    roles,
    twoFactor,
  };
};

export const hasRequiredRole = (roles: readonly UserRole[], requiredRoles: readonly UserRole[]) => {
  return requiredRoles.some((role) => roles.includes(role));
};
