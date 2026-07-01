import type { ReactNode } from "react";

import { requireWelcomeAccess } from "@/lib/auth/guards";

const WelcomeLayout = async ({ children }: { children: ReactNode }) => {
  await requireWelcomeAccess();

  return children;
};

export default WelcomeLayout;
