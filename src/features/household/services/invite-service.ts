import { and, eq, isNotNull } from "drizzle-orm";

import { DEFAULT_HOUSEHOLD_INVITE_STATUS } from "@/constants/household";
import { db } from "@/lib/db/client";
import { householdInvites } from "@/lib/db/schema";

import type { HouseholdInviteSummary } from "./household-service";

export const getPendingInvites = async (): Promise<HouseholdInviteSummary[]> => {
  const invites = await db
    .select()
    .from(householdInvites)
    .where(
      and(
        eq(householdInvites.status, DEFAULT_HOUSEHOLD_INVITE_STATUS),
        isNotNull(householdInvites.email),
      ),
    )
    .all();

  return invites.map((invite) => ({
    id: invite.id,
    email: invite.email,
    status: invite.status,
    createdAt: invite.createdAt,
    expiresAt: invite.expiresAt,
  }));
};
