import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { type User, users } from "@/lib/db/schema";
import { notFound } from "@/lib/errors";

export type CurrentUser = {
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  email: string;
};

export const toCurrentUser = (user: User): CurrentUser => ({
  firstName: user.firstName,
  lastName: user.lastName,
  image: user.image,
  email: user.email,
});

export const getUserById = async (id: string): Promise<User> => {
  const rows = await db.select().from(users).where(eq(users.id, id)).all();
  const user = rows[0];
  if (!user) throw notFound(`User ${id} not found`);
  return user;
};
