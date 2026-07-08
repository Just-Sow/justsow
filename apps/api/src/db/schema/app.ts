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
  'sower_claim',
  'project',
  'seed',
  'auth_session',
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
