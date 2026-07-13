import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { IconLink } from "@/components/ui/icon-link";

type PageHeaderProps = {
  title?: string;
  backHref: string;
  icon: LucideIcon;
  backAriaLabel?: string;
  trailing?: ReactNode;
  className?: string;
};

const PageHeader = ({
  title,
  backHref,
  icon: Icon,
  backAriaLabel = "Go back",
  trailing,
  className,
}: PageHeaderProps) => {
  return (
    <header className={cn("grid grid-cols-[1fr_auto_1fr] items-center", className)}>
      <IconLink
        href={backHref}
        aria-label={backAriaLabel}
        icon={Icon}
        className="justify-self-start"
      />

      {title && <h6 className="text-foreground justify-self-center text-lg font-bold">{title}</h6>}

      <div className="justify-self-end">{trailing}</div>
    </header>
  );
};

export default PageHeader;
