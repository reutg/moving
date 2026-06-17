import type { ReactNode } from "react";

import PageShell from "@/components/page-shell";

const NewBoxLayout = ({ children }: { children: ReactNode }) => {
  return <PageShell title="Create a new box">{children}</PageShell>;
};

export default NewBoxLayout;
