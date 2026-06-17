import type { ReactNode } from "react";

import PageShell from "@/components/page-shell";

const EditBoxLayout = ({ children }: { children: ReactNode }) => {
  return <PageShell title="Edit Box">{children}</PageShell>;
};

export default EditBoxLayout;
