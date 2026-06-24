import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
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
      <Link
        href={backHref}
        aria-label={backAriaLabel}
        className="bg-card border-border text-foreground flex size-10 items-center justify-center justify-self-start rounded-xl border"
      >
        <Icon className="size-5" aria-hidden />
      </Link>

      <h6 className="text-md text-foreground justify-self-center font-bold">{title}</h6>

      <div className="justify-self-end">{trailing}</div>
    </header>
  );
};

export default PageHeader;
