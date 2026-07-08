import { and, eq, isNull } from 'drizzle-orm';
import type { UserRole } from '../../../../packages/shared/src/index.js';
import { db } from '../db/client.js';
import { userRoleAssignment } from '../db/schema/app.js';

export interface AssignUserRoleInput {
  userId: string;
  role: UserRole;
  assignedByUserId?: string;
  reason?: string;
}

export interface RevokeUserRoleInput {
  userId: string;
  role: UserRole;
  revokedByUserId?: string;
  reason?: string;
}

export const listActiveRolesForUser = async (userId: string) => {
  const assignments = await db
    .select({
      role: userRoleAssignment.role,
    })
    .from(userRoleAssignment)
    .where(and(eq(userRoleAssignment.userId, userId), isNull(userRoleAssignment.revokedAt)));

  return assignments.map((assignment) => assignment.role);
};

export const assignUserRole = async (input: AssignUserRoleInput) => {
  const [assignment] = await db
    .insert(userRoleAssignment)
    .values({
      userId: input.userId,
      role: input.role,
      assignedByUserId: input.assignedByUserId,
      reason: input.reason,
    })
    .onConflictDoNothing({
      target: [userRoleAssignment.userId, userRoleAssignment.role],
      where: isNull(userRoleAssignment.revokedAt),
    })
    .returning();

  return assignment ?? null;
};

export const revokeUserRole = async (input: RevokeUserRoleInput) => {
  const [assignment] = await db
    .update(userRoleAssignment)
    .set({
      revokedAt: new Date(),
      revokedByUserId: input.revokedByUserId,
      reason: input.reason,
    })
    .where(
      and(
        eq(userRoleAssignment.userId, input.userId),
        eq(userRoleAssignment.role, input.role),
        isNull(userRoleAssignment.revokedAt)
      )
    )
    .returning();

  return assignment ?? null;
};
