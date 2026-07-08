import { z } from 'zod';
import type { FastifyPluginAsync } from 'fastify';
import {
  assignUserRole,
  listActiveRolesForUser,
  revokeUserRole,
} from '../auth/roles.js';
import {
  completeSowerClaim,
  createManualSowerProfile,
  createSowerClaim,
  findSowerProfileByLinkedUser,
  listSowerClaimsForProfile,
  rejectSowerClaim,
} from '../auth/sowers.js';
import { getRequestIdentity, hasRequiredRole } from '../auth/session.js';
import { createAuditEvent } from '../audit/events.js';
import { userRoles } from '../../../../packages/shared/src/index.js';

const createSowerProfileSchema = z.object({
  displayName: z.string().min(1),
  contactEmail: z.email().optional(),
  notes: z.string().min(1).optional(),
});

const createSowerClaimSchema = z.object({
  sowerProfileId: z.uuid(),
  notes: z.string().min(1).optional(),
});

const resolveSowerClaimSchema = z.object({
  notes: z.string().min(1).optional(),
});

const assignRoleSchema = z.object({
  role: z.enum(userRoles),
  reason: z.string().min(1).optional(),
});

const adminRoles = ['admin'] as const;
const sowerReviewRoles = ['admin', 'seed_allocator', 'stewardship_staff'] as const;

export const authAppRoutes: FastifyPluginAsync = async (app) => {
  app.get('/auth/me', async (request, reply) => {
    const identity = await getRequestIdentity(request);

    if (!identity) {
      return reply.code(401).send({
        error: 'UNAUTHORIZED',
      });
    }

    const sowerProfile = await findSowerProfileByLinkedUser(identity.user.id);

    return {
      session: identity.session,
      user: identity.user,
      roles: identity.roles,
      sowerProfile,
    };
  });

  app.get('/auth/roles', async (request, reply) => {
    const identity = await getRequestIdentity(request);

    if (!identity) {
      return reply.code(401).send({
        error: 'UNAUTHORIZED',
      });
    }

    return {
      roles: identity.roles,
    };
  });

  app.get('/auth/sower-profile', async (request, reply) => {
    const identity = await getRequestIdentity(request);

    if (!identity) {
      return reply.code(401).send({
        error: 'UNAUTHORIZED',
      });
    }

    return {
      sowerProfile: await findSowerProfileByLinkedUser(identity.user.id),
    };
  });

  app.post('/auth/sower-claims', async (request, reply) => {
    const identity = await getRequestIdentity(request);

    if (!identity) {
      return reply.code(401).send({
        error: 'UNAUTHORIZED',
      });
    }

    const body = createSowerClaimSchema.parse(request.body);
    const claim = await createSowerClaim({
      sowerProfileId: body.sowerProfileId,
      claimantUserId: identity.user.id,
      notes: body.notes,
    });

    await createAuditEvent({
      actorType: 'user',
      actorUserId: identity.user.id,
      action: 'sower_claim.requested',
      targetType: 'sower_claim',
      targetId: claim.id,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      metadata: {
        sowerProfileId: claim.sowerProfileId,
      },
    });

    return reply.code(201).send({
      claim,
    });
  });

  app.post('/auth/admin/sower-profiles', async (request, reply) => {
    const identity = await getRequestIdentity(request);

    if (!identity) {
      return reply.code(401).send({
        error: 'UNAUTHORIZED',
      });
    }

    if (!hasRequiredRole(identity.roles, sowerReviewRoles)) {
      return reply.code(403).send({
        error: 'FORBIDDEN',
      });
    }

    const body = createSowerProfileSchema.parse(request.body);
    const profile = await createManualSowerProfile({
      displayName: body.displayName,
      contactEmail: body.contactEmail,
      createdByUserId: identity.user.id,
      notes: body.notes,
    });

    await createAuditEvent({
      actorType: 'user',
      actorUserId: identity.user.id,
      action: 'sower_profile.created',
      targetType: 'sower_profile',
      targetId: profile.id,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    return reply.code(201).send({
      profile,
    });
  });

  app.get('/auth/admin/sower-profiles/:profileId/claims', async (request, reply) => {
    const identity = await getRequestIdentity(request);

    if (!identity) {
      return reply.code(401).send({
        error: 'UNAUTHORIZED',
      });
    }

    if (!hasRequiredRole(identity.roles, sowerReviewRoles)) {
      return reply.code(403).send({
        error: 'FORBIDDEN',
      });
    }

    const params = z.object({ profileId: z.uuid() }).parse(request.params);
    const claims = await listSowerClaimsForProfile(params.profileId);

    return {
      claims,
    };
  });

  app.post('/auth/admin/sower-claims/:claimId/approve', async (request, reply) => {
    const identity = await getRequestIdentity(request);

    if (!identity) {
      return reply.code(401).send({
        error: 'UNAUTHORIZED',
      });
    }

    if (!hasRequiredRole(identity.roles, sowerReviewRoles)) {
      return reply.code(403).send({
        error: 'FORBIDDEN',
      });
    }

    const params = z.object({ claimId: z.uuid() }).parse(request.params);
    const body = resolveSowerClaimSchema.parse(request.body);
    const result = await completeSowerClaim({
      claimId: params.claimId,
      resolvedByUserId: identity.user.id,
      notes: body.notes,
    });

    if (!result) {
      return reply.code(404).send({
        error: 'CLAIM_NOT_FOUND',
      });
    }

    await createAuditEvent({
      actorType: 'user',
      actorUserId: identity.user.id,
      action: 'sower_claim.approved',
      targetType: 'sower_claim',
      targetId: result.claim.id,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      metadata: {
        sowerProfileId: result.claim.sowerProfileId,
        claimantUserId: result.claim.claimantUserId,
      },
    });

    return {
      claim: result.claim,
      profile: result.profile,
    };
  });

  app.post('/auth/admin/sower-claims/:claimId/reject', async (request, reply) => {
    const identity = await getRequestIdentity(request);

    if (!identity) {
      return reply.code(401).send({
        error: 'UNAUTHORIZED',
      });
    }

    if (!hasRequiredRole(identity.roles, sowerReviewRoles)) {
      return reply.code(403).send({
        error: 'FORBIDDEN',
      });
    }

    const params = z.object({ claimId: z.uuid() }).parse(request.params);
    const body = resolveSowerClaimSchema.parse(request.body);
    const claim = await rejectSowerClaim({
      claimId: params.claimId,
      resolvedByUserId: identity.user.id,
      notes: body.notes,
    });

    if (!claim) {
      return reply.code(404).send({
        error: 'CLAIM_NOT_FOUND',
      });
    }

    await createAuditEvent({
      actorType: 'user',
      actorUserId: identity.user.id,
      action: 'sower_claim.rejected',
      targetType: 'sower_claim',
      targetId: claim.id,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      metadata: {
        sowerProfileId: claim.sowerProfileId,
        claimantUserId: claim.claimantUserId,
      },
    });

    return {
      claim,
    };
  });

  app.post('/auth/admin/users/:userId/roles', async (request, reply) => {
    const identity = await getRequestIdentity(request);

    if (!identity) {
      return reply.code(401).send({
        error: 'UNAUTHORIZED',
      });
    }

    if (!hasRequiredRole(identity.roles, adminRoles)) {
      return reply.code(403).send({
        error: 'FORBIDDEN',
      });
    }

    const params = z.object({ userId: z.string().min(1) }).parse(request.params);
    const body = assignRoleSchema.parse(request.body);
    const assignment = await assignUserRole({
      userId: params.userId,
      role: body.role,
      assignedByUserId: identity.user.id,
      reason: body.reason,
    });

    if (!assignment) {
      return reply.code(409).send({
        error: 'ROLE_ALREADY_ASSIGNED',
      });
    }

    await createAuditEvent({
      actorType: 'user',
      actorUserId: identity.user.id,
      action: 'user_role.assigned',
      targetType: 'user_role_assignment',
      targetId: assignment.id,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      metadata: {
        userId: params.userId,
        role: assignment.role,
      },
    });

    return reply.code(201).send({
      assignment,
    });
  });

  app.delete('/auth/admin/users/:userId/roles/:role', async (request, reply) => {
    const identity = await getRequestIdentity(request);

    if (!identity) {
      return reply.code(401).send({
        error: 'UNAUTHORIZED',
      });
    }

    if (!hasRequiredRole(identity.roles, adminRoles)) {
      return reply.code(403).send({
        error: 'FORBIDDEN',
      });
    }

    const params = z
      .object({
        userId: z.string().min(1),
        role: z.enum(userRoles),
      })
      .parse(request.params);
    const body = z.object({ reason: z.string().min(1).optional() }).parse(request.body ?? {});
    const assignment = await revokeUserRole({
      userId: params.userId,
      role: params.role,
      revokedByUserId: identity.user.id,
      reason: body.reason,
    });

    if (!assignment) {
      return reply.code(404).send({
        error: 'ROLE_ASSIGNMENT_NOT_FOUND',
      });
    }

    await createAuditEvent({
      actorType: 'user',
      actorUserId: identity.user.id,
      action: 'user_role.revoked',
      targetType: 'user_role_assignment',
      targetId: assignment.id,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      metadata: {
        userId: params.userId,
        role: params.role,
      },
    });

    return {
      assignment,
    };
  });

  app.get('/auth/admin/users/:userId/roles', async (request, reply) => {
    const identity = await getRequestIdentity(request);

    if (!identity) {
      return reply.code(401).send({
        error: 'UNAUTHORIZED',
      });
    }

    if (!hasRequiredRole(identity.roles, adminRoles)) {
      return reply.code(403).send({
        error: 'FORBIDDEN',
      });
    }

    const params = z.object({ userId: z.string().min(1) }).parse(request.params);

    return {
      roles: await listActiveRolesForUser(params.userId),
    };
  });
};
