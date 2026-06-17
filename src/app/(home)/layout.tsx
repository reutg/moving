import type { ReactNode } from "react";

import { Navbar } from "@/components/Navbar";
import BottomNavigation from "@/components/bottom-navigation";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="flex-1 overflow-y-auto">{children}</div>
      <BottomNavigation />
    </>
  );
};

export default HomeLayout;
