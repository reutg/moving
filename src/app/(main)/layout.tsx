import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import BottomNavigation from "@/components/bottom-navigation";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      <BottomNavigation />
    </>
  );
};

export default MainLayout;
