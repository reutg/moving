import "server-only";

import { and, count, desc, eq, inArray, isNull } from "drizzle-orm";
import { z } from "zod";

import {
  DEFAULT_HOUSEHOLD_INVITE_STATUS,
  HOUSEHOLD_INVITE_STATUSES,
  HOUSEHOLD_INVITE_TTL_MS,
  type HouseholdInviteStatus,
  type HouseholdRole,
  OWNER_HOUSEHOLD_ROLE,
} from "@/constants";
import { db } from "@/lib/db/client";
import {
  boxes,
  type Household,
  type HouseholdInvite,
  householdInvites,
  householdMembers,
  households,
  moves,
  users,
} from "@/lib/db/schema";
import { sendHouseholdInviteEmail } from "@/lib/email/mail-service";
import { badRequest, forbidden, internal, notFound, unauthorized } from "@/lib/errors";

import { buildInviteUrl } from "@/features/household/utils/build-invite-url";
import { completeOnboarding, getUserById } from "@/features/users/services/user-service";

import { auth } from "@/auth";

export const CreateHouseholdInputSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
  })
  .strict();

export type CreateHouseholdInput = z.infer<typeof CreateHouseholdInputSchema>;

export const UpdateHouseholdInputSchema = CreateHouseholdInputSchema;

export type UpdateHouseholdInput = z.infer<typeof UpdateHouseholdInputSchema>;

export const CreateHouseholdInviteInputSchema = z
  .object({
    email: z.email().trim().toLowerCase(),
  })
  .strict();

export type CreateHouseholdInviteInput = z.infer<typeof CreateHouseholdInviteInputSchema>;

export const AcceptHouseholdInviteInputSchema = z
  .object({
    token: z.string().trim().min(1),
  })
  .strict();

export type AcceptHouseholdInviteInput = z.infer<typeof AcceptHouseholdInviteInputSchema>;

export const ListHouseholdInvitesQuerySchema = z
  .object({
    status: z.enum(HOUSEHOLD_INVITE_STATUSES).optional(),
  })
  .strict();

export type ListHouseholdInvitesQuery = z.infer<typeof ListHouseholdInvitesQuerySchema>;

export type HouseholdMemberSummary = {
  userId: string;
  role: HouseholdRole;
  joinedAt: Date;
  name: string | null;
  email: string;
  image: string | null;
};

export type HouseholdInviteSummary = {
  id: string;
  email: string | null;
  status: HouseholdInviteStatus;
  createdAt: Date;
  expiresAt: Date;
};

export type HouseholdInviteLink = HouseholdInviteSummary & {
  inviteUrl: string;
};

export type HouseholdInvitePreview = HouseholdInviteSummary & {
  invitedBy: {
    name: string | null;
    image: string | null;
  };
  household: {
    name: string;
    memberNames: string[];
    boxesCount: number;
  };
};

export type HouseholdWithMembers = Household & {
  members: HouseholdMemberSummary[];
};

const getAuthenticatedUserId = async (): Promise<string> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw unauthorized();
  }

  return userId;
};

const getMembershipForUser = async (userId: string) => {
  const [membership] = await db
    .select()
    .from(householdMembers)
    .where(eq(householdMembers.userId, userId))
    .limit(1)
    .all();

  return membership ?? null;
};

const getHouseholdById = async (householdId: number): Promise<Household> => {
  const [household] = await db
    .select()
    .from(households)
    .where(eq(households.id, householdId))
    .limit(1)
    .all();

  if (!household) {
    throw notFound(`Household ${householdId} not found`);
  }

  return household;
};

const requireOwnerMembership = async (userId: string, householdId: number) => {
  const membership = await getMembershipForUser(userId);

  if (!membership || membership.householdId !== householdId) {
    throw notFound("Household not found");
  }

  if (membership.role !== OWNER_HOUSEHOLD_ROLE) {
    throw forbidden("Only the household owner can perform this action");
  }

  return membership;
};

const listMembersForHousehold = async (householdId: number): Promise<HouseholdMemberSummary[]> => {
  const rows = await db
    .select({
      userId: householdMembers.userId,
      role: householdMembers.role,
      joinedAt: householdMembers.joinedAt,
      name: users.name,
      email: users.email,
      image: users.image,
    })
    .from(householdMembers)
    .innerJoin(users, eq(householdMembers.userId, users.id))
    .where(eq(householdMembers.householdId, householdId))
    .all();

  return rows;
};

const toHouseholdWithMembers = async (household: Household): Promise<HouseholdWithMembers> => ({
  ...household,
  members: await listMembersForHousehold(household.id),
});

const toInviteSummary = (invite: HouseholdInvite): HouseholdInviteSummary => ({
  id: invite.id,
  email: invite.email,
  status: invite.status,
  createdAt: invite.createdAt,
  expiresAt: invite.expiresAt,
});

const isInviteActive = (invite: HouseholdInvite, now = new Date()): boolean =>
  invite.status === DEFAULT_HOUSEHOLD_INVITE_STATUS && invite.expiresAt.getTime() > now.getTime();

export const getHouseholdForUserId = async (
  userId: string,
): Promise<HouseholdWithMembers | null> => {
  const membership = await getMembershipForUser(userId);

  if (!membership) {
    return null;
  }

  const household = await getHouseholdById(membership.householdId);
  return toHouseholdWithMembers(household);
};

export const getCurrentHousehold = async (): Promise<HouseholdWithMembers | null> => {
  const userId = await getAuthenticatedUserId();
  return getHouseholdForUserId(userId);
};

export const createHousehold = async (
  input: CreateHouseholdInput,
): Promise<HouseholdWithMembers> => {
  const userId = await getAuthenticatedUserId();
  const existingMembership = await getMembershipForUser(userId);

  if (existingMembership) {
    throw badRequest("You are already in a household");
  }

  const household = await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(households)
      .values({
        name: input.name,
        updatedAt: new Date(),
      })
      .returning()
      .all();

    const createdHousehold = inserted[0];
    if (!createdHousehold) {
      throw internal("Failed to create household");
    }

    await tx
      .insert(householdMembers)
      .values({
        userId,
        householdId: createdHousehold.id,
        role: OWNER_HOUSEHOLD_ROLE,
      })
      .run();

    return createdHousehold;
  });

  return toHouseholdWithMembers(household);
};

export const updateHousehold = async (
  input: UpdateHouseholdInput,
): Promise<HouseholdWithMembers> => {
  const userId = await getAuthenticatedUserId();
  const membership = await getMembershipForUser(userId);

  if (!membership) {
    throw notFound("Household not found");
  }

  await requireOwnerMembership(userId, membership.householdId);

  const updated = await db
    .update(households)
    .set({
      name: input.name,
      updatedAt: new Date(),
    })
    .where(eq(households.id, membership.householdId))
    .returning()
    .all();

  const household = updated[0];
  if (!household) {
    throw notFound("Household not found");
  }

  return toHouseholdWithMembers(household);
};

export const listHouseholdInvites = async (
  query: ListHouseholdInvitesQuery = {},
): Promise<HouseholdInviteSummary[]> => {
  const userId = await getAuthenticatedUserId();
  const membership = await getMembershipForUser(userId);

  if (!membership) {
    throw notFound("Household not found");
  }

  await requireOwnerMembership(userId, membership.householdId);

  const filters = [eq(householdInvites.householdId, membership.householdId)];

  if (query.status) {
    filters.push(eq(householdInvites.status, query.status));
  }

  const invites = await db
    .select()
    .from(householdInvites)
    .where(and(...filters))
    .all();

  return invites.map(toInviteSummary);
};

const requireAuthenticatedOwnerHousehold = async () => {
  const userId = await getAuthenticatedUserId();
  const membership = await getMembershipForUser(userId);

  if (!membership) {
    throw notFound("Household not found");
  }

  await requireOwnerMembership(userId, membership.householdId);

  return { userId, householdId: membership.householdId };
};

export const removeHouseholdMember = async (
  memberUserId: string,
): Promise<{ userId: string }> => {
  const { userId, householdId } = await requireAuthenticatedOwnerHousehold();

  if (memberUserId === userId) {
    throw badRequest("You cannot remove yourself from the household");
  }

  const [targetMember] = await db
    .select()
    .from(householdMembers)
    .where(
      and(eq(householdMembers.userId, memberUserId), eq(householdMembers.householdId, householdId)),
    )
    .limit(1)
    .all();

  if (!targetMember) {
    throw notFound("Member not found");
  }

  if (targetMember.role === OWNER_HOUSEHOLD_ROLE) {
    throw badRequest("Cannot remove the household owner");
  }

  const result = await db
    .delete(householdMembers)
    .where(
      and(eq(householdMembers.userId, memberUserId), eq(householdMembers.householdId, householdId)),
    )
    .run();

  if (result.rowsAffected === 0) {
    throw notFound("Member not found");
  }

  return { userId: memberUserId };
};

const assertEmailIsNotExistingMember = async (householdId: number, email: string) => {
  const [existingMember] = await db
    .select({ userId: users.id })
    .from(users)
    .innerJoin(householdMembers, eq(householdMembers.userId, users.id))
    .where(and(eq(householdMembers.householdId, householdId), eq(users.email, email)))
    .limit(1)
    .all();

  if (existingMember) {
    throw badRequest("This user is already a household member");
  }
};

const assertNoActiveInviteExistsForEmail = async (householdId: number, email: string) => {
  const pendingInvites = await db
    .select()
    .from(householdInvites)
    .where(
      and(
        eq(householdInvites.householdId, householdId),
        eq(householdInvites.email, email),
        eq(householdInvites.status, DEFAULT_HOUSEHOLD_INVITE_STATUS),
      ),
    )
    .all();

  const activePendingInvite = pendingInvites.find((invite) => isInviteActive(invite));

  if (activePendingInvite) {
    throw badRequest("An active invite already exists for this email");
  }
};

const insertPendingHouseholdInvite = async ({
  householdId,
  email,
  invitedByUserId,
  token,
}: {
  householdId: number;
  email: string | null;
  invitedByUserId: string;
  token: string;
}): Promise<HouseholdInvite> => {
  const expiresAt = new Date(Date.now() + HOUSEHOLD_INVITE_TTL_MS);

  const inserted = await db
    .insert(householdInvites)
    .values({
      householdId,
      email,
      invitedByUserId,
      token,
      expiresAt,
    })
    .returning()
    .all();

  const invite = inserted[0];
  if (!invite) {
    throw internal("Failed to create household invite");
  }

  return invite;
};

const sendInviteEmailForHousehold = async ({
  inviteToken,
  household,
  inviterName,
  to,
}: {
  inviteToken: string;
  household: Household;
  inviterName: string | null;
  to: string;
}) => {
  await sendHouseholdInviteEmail({
    to,
    householdName: household.name,
    inviteUrl: buildInviteUrl(inviteToken),
    inviterName,
  });
};

const getHouseholdInviteById = async (
  householdId: number,
  inviteId: string,
): Promise<HouseholdInvite> => {
  const [invite] = await db
    .select()
    .from(householdInvites)
    .where(and(eq(householdInvites.id, inviteId), eq(householdInvites.householdId, householdId)))
    .limit(1)
    .all();

  if (!invite) {
    throw notFound("Invite not found");
  }

  return invite;
};

const assertInviteIsPending = (invite: HouseholdInvite) => {
  if (invite.status !== DEFAULT_HOUSEHOLD_INVITE_STATUS) {
    throw badRequest("Only pending invites can be revoked");
  }
};

const revokePendingHouseholdInvite = async (inviteId: string): Promise<HouseholdInvite> => {
  const updated = await db
    .update(householdInvites)
    .set({ status: "revoked" })
    .where(eq(householdInvites.id, inviteId))
    .returning()
    .all();

  const revokedInvite = updated[0];
  if (!revokedInvite) {
    throw internal("Failed to revoke household invite");
  }

  return revokedInvite;
};

export const createHouseholdInvite = async (
  input: CreateHouseholdInviteInput,
): Promise<HouseholdInviteSummary> => {
  const { userId, householdId } = await requireAuthenticatedOwnerHousehold();
  const household = await getHouseholdById(householdId);
  const inviter = await getUserById(userId);

  await assertEmailIsNotExistingMember(householdId, input.email);
  await assertNoActiveInviteExistsForEmail(householdId, input.email);

  const inviteToken = crypto.randomUUID();

  await sendInviteEmailForHousehold({
    inviteToken,
    household,
    inviterName: inviter.name,
    to: input.email,
  });

  const invite = await insertPendingHouseholdInvite({
    householdId,
    email: input.email,
    invitedByUserId: userId,
    token: inviteToken,
  });

  return toInviteSummary(invite);
};

export const createOrGetHouseholdInviteLink = async (): Promise<HouseholdInviteLink> => {
  const { userId, householdId } = await requireAuthenticatedOwnerHousehold();

  const openInvites = await db
    .select()
    .from(householdInvites)
    .where(
      and(
        eq(householdInvites.householdId, householdId),
        eq(householdInvites.status, DEFAULT_HOUSEHOLD_INVITE_STATUS),
        isNull(householdInvites.email),
      ),
    )
    .all();

  const activeOpenInvite = openInvites.find((invite) => isInviteActive(invite));

  if (activeOpenInvite) {
    return {
      ...toInviteSummary(activeOpenInvite),
      inviteUrl: buildInviteUrl(activeOpenInvite.token),
    };
  }

  const inviteToken = crypto.randomUUID();
  const invite = await insertPendingHouseholdInvite({
    householdId,
    email: null,
    invitedByUserId: userId,
    token: inviteToken,
  });

  return {
    ...toInviteSummary(invite),
    inviteUrl: buildInviteUrl(inviteToken),
  };
};

export const revokeHouseholdInvite = async (inviteId: string): Promise<HouseholdInviteSummary> => {
  const { householdId } = await requireAuthenticatedOwnerHousehold();
  const invite = await getHouseholdInviteById(householdId, inviteId);

  assertInviteIsPending(invite);

  const revokedInvite = await revokePendingHouseholdInvite(inviteId);

  return toInviteSummary(revokedInvite);
};

export const declineHouseholdInvite = async (
  input: AcceptHouseholdInviteInput,
): Promise<HouseholdInviteSummary> => {
  const userId = await getAuthenticatedUserId();
  const user = await getUserById(userId);

  const invite = await findHouseholdInviteByToken(input.token);

  assertInviteIsPending(invite);
  assertInviteEmailMatchesUser(invite, user.email);

  const revokedInvite = await revokePendingHouseholdInvite(invite.id);

  return toInviteSummary(revokedInvite);
};

const assertUserHasNoHousehold = async (userId: string) => {
  const existingMembership = await getMembershipForUser(userId);

  if (existingMembership) {
    throw badRequest("You are already in a household");
  }
};

const findHouseholdInviteByToken = async (token: string): Promise<HouseholdInvite> => {
  const [invite] = await db
    .select()
    .from(householdInvites)
    .where(eq(householdInvites.token, token))
    .limit(1)
    .all();

  if (!invite) {
    throw notFound("Invite not found");
  }

  return invite;
};

const assertInviteIsActive = (invite: HouseholdInvite) => {
  if (!isInviteActive(invite)) {
    throw badRequest("This invite is no longer valid");
  }
};

const assertInviteEmailMatchesUser = (invite: HouseholdInvite, email: string) => {
  if (!invite.email) {
    return;
  }

  if (invite.email !== email.toLowerCase()) {
    throw forbidden("This invite was sent to a different email address");
  }
};

const addUserToHousehold = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  userId: string,
  householdId: number,
) => {
  await tx
    .insert(householdMembers)
    .values({
      userId,
      householdId,
    })
    .run();
};

const markInviteAsAccepted = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  inviteId: string,
  userId: string,
) => {
  await tx
    .update(householdInvites)
    .set({
      status: "accepted",
      acceptedByUserId: userId,
      acceptedAt: new Date(),
    })
    .where(eq(householdInvites.id, inviteId))
    .run();
};

const acceptInviteAndJoinHousehold = async (
  userId: string,
  inviteId: string,
): Promise<Household> => {
  return db.transaction(async (tx) => {
    const [currentInvite] = await tx
      .select()
      .from(householdInvites)
      .where(eq(householdInvites.id, inviteId))
      .limit(1)
      .all();

    if (!currentInvite || !isInviteActive(currentInvite)) {
      throw badRequest("This invite is no longer valid");
    }

    await addUserToHousehold(tx, userId, currentInvite.householdId);
    await markInviteAsAccepted(tx, currentInvite.id, userId);

    const [acceptedHousehold] = await tx
      .select()
      .from(households)
      .where(eq(households.id, currentInvite.householdId))
      .limit(1)
      .all();

    if (!acceptedHousehold) {
      throw notFound("Household not found");
    }

    return acceptedHousehold;
  });
};

const assignCurrentMoveFromHousehold = async (
  userId: string,
  householdId: number,
): Promise<void> => {
  const members = await db
    .select({
      userId: householdMembers.userId,
      role: householdMembers.role,
    })
    .from(householdMembers)
    .where(eq(householdMembers.householdId, householdId))
    .all();

  const memberUserIds = members.map((member) => member.userId);
  if (memberUserIds.length === 0) {
    return;
  }

  const owner = members.find((member) => member.role === OWNER_HOUSEHOLD_ROLE);

  if (owner) {
    const ownerUser = await getUserById(owner.userId);
    if (ownerUser.currentMoveId !== null) {
      const [ownerCurrentMove] = await db
        .select()
        .from(moves)
        .where(and(eq(moves.id, ownerUser.currentMoveId), inArray(moves.userId, memberUserIds)))
        .limit(1)
        .all();

      if (ownerCurrentMove) {
        await db
          .update(users)
          .set({ currentMoveId: ownerCurrentMove.id })
          .where(eq(users.id, userId))
          .run();
        return;
      }
    }
  }

  const [fallbackMove] = await db
    .select()
    .from(moves)
    .where(inArray(moves.userId, memberUserIds))
    .orderBy(desc(moves.createdAt))
    .limit(1)
    .all();

  if (!fallbackMove) {
    return;
  }

  await db
    .update(users)
    .set({ currentMoveId: fallbackMove.id })
    .where(eq(users.id, userId))
    .run();
};

export const acceptHouseholdInvite = async (
  input: AcceptHouseholdInviteInput,
): Promise<HouseholdWithMembers> => {
  const userId = await getAuthenticatedUserId();
  const user = await getUserById(userId);

  await assertUserHasNoHousehold(userId);

  const invite = await findHouseholdInviteByToken(input.token);

  assertInviteIsActive(invite);
  assertInviteEmailMatchesUser(invite, user.email);

  const household = await acceptInviteAndJoinHousehold(userId, invite.id);
  await assignCurrentMoveFromHousehold(userId, household.id);
  await completeOnboarding(userId);

  return toHouseholdWithMembers(household);
};

const countBoxesForHousehold = async (householdId: number): Promise<number> => {
  const members = await db
    .select({ userId: householdMembers.userId })
    .from(householdMembers)
    .where(eq(householdMembers.householdId, householdId))
    .all();

  const memberUserIds = members.map((member) => member.userId);

  if (memberUserIds.length === 0) {
    return 0;
  }

  const [row] = await db
    .select({ boxesCount: count() })
    .from(boxes)
    .innerJoin(moves, eq(boxes.moveId, moves.id))
    .where(inArray(moves.userId, memberUserIds))
    .all();

  return row?.boxesCount ?? 0;
};

export const getHouseholdInviteByToken = async (
  token: string,
): Promise<HouseholdInvitePreview> => {
  await getAuthenticatedUserId();

  const [row] = await db
    .select({
      invite: householdInvites,
      householdName: households.name,
      inviterName: users.name,
      inviterImage: users.image,
    })
    .from(householdInvites)
    .innerJoin(households, eq(householdInvites.householdId, households.id))
    .innerJoin(users, eq(householdInvites.invitedByUserId, users.id))
    .where(eq(householdInvites.token, token))
    .limit(1)
    .all();

  if (!row) {
    throw notFound("Invite not found");
  }

  const members = await listMembersForHousehold(row.invite.householdId);
  const boxesCount = await countBoxesForHousehold(row.invite.householdId);

  return {
    ...toInviteSummary(row.invite),
    invitedBy: {
      name: row.inviterName,
      image: row.inviterImage,
    },
    household: {
      name: row.householdName,
      memberNames: members
        .map((member) => member.name)
        .filter((name): name is string => Boolean(name)),
      boxesCount,
    },
  };
};
