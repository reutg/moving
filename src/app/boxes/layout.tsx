import type { ReactNode } from "react";

const BoxesLayout = ({ children }: { children: ReactNode }) => {
  return <main className="container">{children}</main>;
};

export default BoxesLayout;
