import type { ReactNode } from "react";

import Link from "next/link";

import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import IconTile from "@/components/ui/icon-tile";

type SummaryCardProps = {
  icon?: LucideIcon;
  leading?: ReactNode;
  title: string;
  subtitle: string;
  href?: string;
  trailing?: ReactNode;
};

const SummaryCard = ({ icon, leading, title, subtitle, href, trailing }: SummaryCardProps) => {
  const card = (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {leading ?? <IconTile icon={icon} size="sm" />}

          <div>
            <h3 className="text-foreground text-md font-semibold">{title}</h3>
            <p className="text-subtle-foreground text-sm">{subtitle}</p>
          </div>
        </div>

        {(trailing || href) && (
          <div className="flex items-center gap-4">
            {trailing}
            {href ? <ChevronRight className="text-subtle-foreground size-4" /> : null}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }

  return card;
};

export default SummaryCard;
