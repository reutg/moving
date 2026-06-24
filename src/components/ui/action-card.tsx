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
        "flex items-center gap-[13px] rounded-xl p-[17px]",
        "bg-[linear-gradient(120deg,var(--primary),var(--primary-light))]",
        "transition-opacity text-white",
        className,
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/18">
        <Icon className="size-5" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">{title}</div>
        {description ? <div className="mt-px text-xs text-white/80">{description}</div> : null}
      </div>

      <ChevronRight className="size-5 shrink-0 text-white/85" aria-hidden />
    </Link>
  );
};

export default ActionCard;
