import { createClient } from "@libsql/client";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

import { HOUSEHOLD_INVITE_TTL_MS, OWNER_HOUSEHOLD_ROLE } from "@/constants/household";
import { householdInvites, householdMembers, households } from "@/lib/db/schema";
import { env } from "@/lib/env";

const TEST_EMAIL = "expired-invite@example.com";

const main = async () => {
  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });
  const db = drizzle(client);

  const [household] = await db.select().from(households).limit(1).all();

  if (!household) {
    throw new Error("No household found. Create a household first.");
  }

  const [ownerMember] = await db
    .select({ userId: householdMembers.userId })
    .from(householdMembers)
    .where(
      and(
        eq(householdMembers.householdId, household.id),
        eq(householdMembers.role, OWNER_HOUSEHOLD_ROLE),
      ),
    )
    .limit(1)
    .all();

  if (!ownerMember) {
    throw new Error(`No owner found for household "${household.name}" (id ${household.id}).`);
  }

  const createdAt = new Date(Date.now() - HOUSEHOLD_INVITE_TTL_MS - 60 * 60 * 1000);
  const expiresAt = new Date(createdAt.getTime() + HOUSEHOLD_INVITE_TTL_MS);

  const [invite] = await db
    .insert(householdInvites)
    .values({
      householdId: household.id,
      email: TEST_EMAIL,
      invitedByUserId: ownerMember.userId,
      status: "pending",
      createdAt,
      expiresAt,
    })
    .returning()
    .all();

  if (!invite) {
    throw new Error("Failed to insert expired invite.");
  }

  console.log(
    `Inserted expired invite ${invite.id} for ${TEST_EMAIL} in household "${household.name}" (created ${createdAt.toISOString()}).`,
  );

  client.close();
};

await main();
