import type { ReactNode } from "react";

import BottomNavigation from "@/components/bottom-navigation";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="flex-1 overflow-y-auto">{children}</div>
      <BottomNavigation />
    </>
  );
};

export default MainLayout;
