import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { auditEvent } from '../db/schema/app.js';

export type AuditActorType = 'user' | 'system';
export type AuditTargetType =
  | 'user'
  | 'user_role_assignment'
  | 'sower_claim'
  | 'project'
  | 'seed'
  | 'auth_session';

export interface CreateAuditEventInput {
  actorType: AuditActorType;
  actorUserId?: string;
  action: string;
  targetType: AuditTargetType;
  targetId: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export const createAuditEvent = async (input: CreateAuditEventInput) => {
  const [createdEvent] = await db
    .insert(auditEvent)
    .values({
      actorType: input.actorType,
      actorUserId: input.actorUserId,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      metadata: input.metadata ?? {},
    })
    .returning();

  return createdEvent;
};

export const listAuditEventsForTarget = async (targetType: AuditTargetType, targetId: string) => {
  return db
    .select()
    .from(auditEvent)
    .where(and(eq(auditEvent.targetType, targetType), eq(auditEvent.targetId, targetId)))
    .orderBy(desc(auditEvent.occurredAt));
};
