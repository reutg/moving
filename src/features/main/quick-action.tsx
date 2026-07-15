"use client";

import Link from "next/link";

import type { LucideIcon } from "lucide-react";

import ComingSoonBanner from "@/components/ui/coming-soon-banner";
import IconTile from "@/components/ui/icon-tile";

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
      className="border-border-light bg-card flex w-full flex-col items-center gap-1.5 rounded-xl border px-2 py-3.5"
    >
      <IconTile icon={Icon} size="sm" />
      <span className="text-field-label text-[10.5px] font-medium">{title}</span>
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
