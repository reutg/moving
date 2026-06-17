import type { ReactNode } from "react";

import PageShell from "@/components/page-shell";

const BoxDetailLayout = ({ children }: { children: ReactNode }) => {
  return (
    <PageShell title="Box Details" showEdit>
      {children}
    </PageShell>
  );
};

export default BoxDetailLayout;
