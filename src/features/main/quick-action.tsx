"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import ComingSoonBanner from "@/components/ui/coming-soon-banner";

type QuickActionProps = {
  icon: LucideIcon;
  title: string;
  linkTo: string;
  comingSoon?: boolean;
};

const QuickAction = ({ icon: Icon, title, linkTo, comingSoon = false }: QuickActionProps) => {
  const action = (
    <Link
      href={linkTo}
      type="button"
      className="border-border-light bg-card flex w-full flex-col items-center gap-1.5 rounded-md border px-2 py-3.5"
    >
      <span className="bg-accent text-primary flex size-9 items-center justify-center rounded-sm">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="text-[10.5px] font-medium text-zinc-600">{title}</span>
    </Link>
  );

  if (!comingSoon) {
    return action;
  }

  return (
    <ComingSoonBanner compact className="min-w-0">
      {action}
    </ComingSoonBanner>
  );
};

export default QuickAction;
