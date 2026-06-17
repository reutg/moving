import type { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return <div className="flex min-h-0 flex-1 flex-col">{children}</div>;
};

export default AppLayout;
