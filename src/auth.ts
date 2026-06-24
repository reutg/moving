import "server-only";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { type GoogleProfile, mapGoogleProfileToUser, parseGoogleName } from "@/lib/auth/google-profile";
import { db } from "@/lib/db/client";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";

import { getUserById, toCurrentUser } from "@/features/users/services/user-service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

  session: { strategy: "database" },

  providers: [
    Google({
      profile: (profile) => mapGoogleProfileToUser(profile),
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      const currentUser = await getUserById(user.id);

      session.user = {
        ...session.user,
        id: currentUser.id,
        email: currentUser.email,
        image: currentUser.image,
        name: currentUser.name,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
      };

      return session;
    },
  },

  events: {
    async signIn({ user, profile }) {
      if (!user.id || !profile || typeof profile !== "object") return;

      const { firstName, lastName } = parseGoogleName(profile as GoogleProfile);
      const googleProfile = profile as {
        picture?: string;
        name?: string;
      };

      await db
        .update(users)
        .set({
          firstName,
          lastName,
          image: googleProfile.picture ?? user.image,
          name: googleProfile.name ?? user.name,
        })
        .where(eq(users.id, user.id));
    },
  },
});

export const getCurrentUser = async () => {
  const session = await auth();
  if (!session?.user?.id) return null;
  return toCurrentUser(await getUserById(session.user.id));
};
