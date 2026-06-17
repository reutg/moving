import type { ReactNode } from "react";

import PageHeader from "@/components/PageHeader";

type PageShellProps = {
  title: string;
  showEdit?: boolean;
  children: ReactNode;
};

const PageShell = ({ title, showEdit, children }: PageShellProps) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader title={title} showEdit={showEdit} />
      <div className="page-content mx-auto w-full max-w-[960px] flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default PageShell;
