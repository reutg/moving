import "server-only";

import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { parseGoogleName } from "@/lib/auth/google-profile";
import { db } from "@/lib/db/client";
import { type User, users } from "@/lib/db/schema";
import { notFound } from "@/lib/errors";

export type CurrentUser = {
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  email: string;
};

export const UpdateUserInputSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
  })
  .strict();

export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;

export const toCurrentUser = (user: User): CurrentUser => ({
  firstName: user.firstName,
  lastName: user.lastName,
  image: user.image,
  email: user.email,
});

export const hasCompletedOnboarding = (user: User): boolean =>
  user.onboardingCompletedAt !== null;

export const completeOnboarding = async (userId: string): Promise<void> => {
  await db
    .update(users)
    .set({ onboardingCompletedAt: new Date() })
    .where(and(eq(users.id, userId), isNull(users.onboardingCompletedAt)))
    .run();
};

export const getUserById = async (id: string): Promise<User> => {
  const rows = await db.select().from(users).where(eq(users.id, id)).all();
  const user = rows[0];
  if (!user) throw notFound(`User ${id} not found`);
  return user;
};

export const updateUser = async (id: string, input: UpdateUserInput): Promise<CurrentUser> => {
  const { firstName, lastName } = parseGoogleName({ name: input.name });

  const updated = await db
    .update(users)
    .set({ name: input.name, firstName, lastName })
    .where(eq(users.id, id))
    .returning()
    .all();

  const user = updated[0];
  if (!user) throw notFound(`User ${id} not found`);

  return toCurrentUser(user);
};
