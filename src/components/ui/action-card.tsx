import Link from "next/link";

import { ChevronRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ActionCardProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  linkTo: string;
  className?: string;
};

const ActionCard = ({ icon: Icon, title, description, linkTo, className }: ActionCardProps) => {
  return (
    <Link
      href={linkTo}
      className={cn(
        "border-border bg-surface-muted text-foreground flex items-center gap-3.25 rounded-lg border p-4.25 transition-opacity",
        className,
      )}
    >
      <span className="bg-primary flex size-10 shrink-0 items-center justify-center rounded-full text-white">
        <Icon className="size-4" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">{title}</div>
        {description ? (
          <div className="text-muted-foreground mt-px text-xs">{description}</div>
        ) : null}
      </div>

      <ChevronRight className="text-muted-foreground size-5 shrink-0" aria-hidden />
    </Link>
  );
};

export default ActionCard;
