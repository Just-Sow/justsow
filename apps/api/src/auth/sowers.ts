import { and, desc, eq, isNull } from 'drizzle-orm';
import type { InferInsertModel } from 'drizzle-orm';
import { db } from '../db/client.js';
import { sowerClaim, sowerProfile } from '../db/schema/app.js';

export interface CreateManualSowerProfileInput {
  displayName: string;
  contactEmail?: string;
  createdByUserId?: string;
  notes?: string;
}

export interface CreateSowerClaimInput {
  sowerProfileId: string;
  claimantUserId: string;
  notes?: string;
}

export interface ResolveSowerClaimInput {
  claimId: string;
  resolvedByUserId?: string;
  notes?: string;
}

export const createManualSowerProfile = async (input: CreateManualSowerProfileInput) => {
  const [profile] = await db
    .insert(sowerProfile)
    .values({
      displayName: input.displayName,
      contactEmail: input.contactEmail,
      createdByUserId: input.createdByUserId,
      notes: input.notes,
      source: 'staff_manual',
    })
    .returning();

  return profile;
};

export const listSowerClaimsForProfile = async (sowerProfileId: string) => {
  return db
    .select()
    .from(sowerClaim)
    .where(eq(sowerClaim.sowerProfileId, sowerProfileId))
    .orderBy(desc(sowerClaim.requestedAt));
};

export const createSowerClaim = async (input: CreateSowerClaimInput) => {
  const [claim] = await db
    .insert(sowerClaim)
    .values({
      sowerProfileId: input.sowerProfileId,
      claimantUserId: input.claimantUserId,
      notes: input.notes,
    })
    .returning();

  return claim;
};

export const completeSowerClaim = async (input: ResolveSowerClaimInput) => {
  const [claim] = await db
    .update(sowerClaim)
    .set({
      status: 'completed',
      resolvedAt: new Date(),
      resolvedByUserId: input.resolvedByUserId,
      notes: input.notes,
    })
    .where(and(eq(sowerClaim.id, input.claimId), eq(sowerClaim.status, 'pending')))
    .returning();

  if (!claim) {
    return null;
  }

  const [profile] = await db
    .update(sowerProfile)
    .set({
      linkedUserId: claim.claimantUserId,
      claimedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(sowerProfile.id, claim.sowerProfileId), isNull(sowerProfile.linkedUserId)))
    .returning();

  return {
    claim,
    profile: profile ?? null,
  };
};

export const rejectSowerClaim = async (input: ResolveSowerClaimInput) => {
  const [claim] = await db
    .update(sowerClaim)
    .set({
      status: 'rejected',
      resolvedAt: new Date(),
      resolvedByUserId: input.resolvedByUserId,
      notes: input.notes,
    })
    .where(and(eq(sowerClaim.id, input.claimId), eq(sowerClaim.status, 'pending')))
    .returning();

  return claim ?? null;
};

export const findSowerProfileByLinkedUser = async (linkedUserId: string) => {
  const [profile] = await db
    .select()
    .from(sowerProfile)
    .where(eq(sowerProfile.linkedUserId, linkedUserId))
    .limit(1);

  return profile ?? null;
};
