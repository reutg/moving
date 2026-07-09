import { eq } from "drizzle-orm";

import { DEFAULT_HOUSEHOLD_INVITE_STATUS } from "@/constants/household";
import { db } from "@/lib/db/client";
import { householdInvites } from "@/lib/db/schema";

export const getPendingInvites = async () => {
  const invites = await db
    .select()
    .from(householdInvites)
    .where(eq(householdInvites.status, DEFAULT_HOUSEHOLD_INVITE_STATUS));

  return invites;
};
