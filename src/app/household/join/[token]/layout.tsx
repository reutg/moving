import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

type JoinLayoutProps = {
  children: ReactNode;
  params: Promise<{ token: string }>;
};

const JoinLayout = async ({ children, params }: JoinLayoutProps) => {
  const { token } = await params;
  const session = await auth();

  if (!session?.user) {
    const callbackUrl = `/household/join/${encodeURIComponent(token)}`;
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return children;
};

export default JoinLayout;
