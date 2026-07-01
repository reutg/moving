import type { ReactNode } from "react";

import BottomNavigation from "@/components/bottom-navigation";
import { requireOnboarding } from "@/lib/auth/guards";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  await requireOnboarding();

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      <BottomNavigation />
    </>
  );
};

export default MainLayout;
