import type { ReactNode } from "react";

import { Navbar } from "@/components/Navbar";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default HomeLayout;
