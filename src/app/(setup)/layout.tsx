import type { ReactNode } from "react";

import { requireAuth } from "@/lib/auth/guards";

const SetupLayout = async ({ children }: { children: ReactNode }) => {
  await requireAuth();

  return children;
};

export default SetupLayout;
