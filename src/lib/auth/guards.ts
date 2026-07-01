import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

export const requireAuth = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return session;
};

export const requireOnboarding = async () => {
  const session = await requireAuth();

  if (!session.user.onboardingCompleted) {
    redirect("/welcome");
  }

  return session;
};

export const requireWelcomeAccess = async () => {
  const session = await requireAuth();

  if (session.user.onboardingCompleted) {
    redirect("/");
  }

  return session;
};
