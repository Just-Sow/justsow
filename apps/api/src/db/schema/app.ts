import { sql } from 'drizzle-orm';
import { userRoles } from '../../../../../packages/shared/src/index.js';
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './auth.js';

export const userRole = pgEnum('user_role', userRoles);

export const auditActorType = pgEnum('audit_actor_type', ['user', 'system']);

export const auditTargetType = pgEnum('audit_target_type', [
  'user',
  'user_role_assignment',
  'sower_profile',
  'sower_claim',
  'project',
  'seed',
  'auth_session',
]);

export const sowerProfileSource = pgEnum('sower_profile_source', [
  'staff_manual',
  'self_registered',
  'imported',
]);

export const sowerClaimStatus = pgEnum('sower_claim_status', [
  'pending',
  'completed',
  'rejected',
  'expired',
]);

export const sowerClaimVerificationMethod = pgEnum('sower_claim_verification_method', [
  'email_ownership_plus_staff_review',
]);

export const userRoleAssignment = pgTable(
  'user_role_assignment',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    role: userRole('role').notNull(),
    assignedByUserId: text('assigned_by_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    assignedAt: timestamp('assigned_at', { withTimezone: true }).notNull().defaultNow(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    revokedByUserId: text('revoked_by_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    reason: text('reason'),
  },
  (table) => ({
    activeRoleByUser: uniqueIndex('user_role_assignment_active_role_idx')
      .on(table.userId, table.role)
      .where(sql`${table.revokedAt} is null`),
    userLookup: index('user_role_assignment_user_id_idx').on(table.userId),
    roleLookup: index('user_role_assignment_role_idx').on(table.role),
  })
);

export const auditEvent = pgTable(
  'audit_event',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    actorType: auditActorType('actor_type').notNull(),
    actorUserId: text('actor_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    action: text('action').notNull(),
    targetType: auditTargetType('target_type').notNull(),
    targetId: text('target_id').notNull(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    metadata: jsonb('metadata').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => ({
    occurredAtLookup: index('audit_event_occurred_at_idx').on(table.occurredAt),
    actorLookup: index('audit_event_actor_user_id_idx').on(table.actorUserId),
    targetLookup: index('audit_event_target_idx').on(table.targetType, table.targetId),
    actionLookup: index('audit_event_action_idx').on(table.action),
  })
);

export const sowerProfile = pgTable(
  'sower_profile',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    displayName: text('display_name').notNull(),
    contactEmail: text('contact_email'),
    source: sowerProfileSource('source').notNull().default('staff_manual'),
    notes: text('notes'),
    linkedUserId: text('linked_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    createdByUserId: text('created_by_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    claimedAt: timestamp('claimed_at', { withTimezone: true }),
  },
  (table) => ({
    linkedUserLookup: uniqueIndex('sower_profile_linked_user_id_idx')
      .on(table.linkedUserId)
      .where(sql`${table.linkedUserId} is not null`),
    emailLookup: index('sower_profile_contact_email_idx').on(table.contactEmail),
    displayNameLookup: index('sower_profile_display_name_idx').on(table.displayName),
  })
);

export const sowerClaim = pgTable(
  'sower_claim',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sowerProfileId: uuid('sower_profile_id')
      .notNull()
      .references(() => sowerProfile.id, { onDelete: 'cascade' }),
    claimantUserId: text('claimant_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    status: sowerClaimStatus('status').notNull().default('pending'),
    verificationMethod: sowerClaimVerificationMethod('verification_method')
      .notNull()
      .default('email_ownership_plus_staff_review'),
    requestedAt: timestamp('requested_at', { withTimezone: true }).notNull().defaultNow(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    resolvedByUserId: text('resolved_by_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    notes: text('notes'),
  },
  (table) => ({
    profileLookup: index('sower_claim_sower_profile_id_idx').on(table.sowerProfileId),
    claimantLookup: index('sower_claim_claimant_user_id_idx').on(table.claimantUserId),
    pendingClaimByProfile: uniqueIndex('sower_claim_pending_by_profile_idx')
      .on(table.sowerProfileId)
      .where(sql`${table.status} = 'pending'`),
    pendingClaimByClaimant: uniqueIndex('sower_claim_pending_by_claimant_idx')
      .on(table.claimantUserId)
      .where(sql`${table.status} = 'pending'`),
  })
);
