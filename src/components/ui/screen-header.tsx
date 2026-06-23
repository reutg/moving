import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ScreenHeaderProps = {
  title: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

const ScreenHeader = ({ title, actions, children, className }: ScreenHeaderProps) => {
  return (
    <header className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-foreground text-2xl leading-tight font-bold tracking-tight">
          {title}
        </h1>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </header>
  );
};

export default ScreenHeader;
