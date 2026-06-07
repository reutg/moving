import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  count: number;
  icon: ReactNode;
  iconColor: string;
  className?: string;
};

export function StatCard({ title, count, icon, iconColor, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center gap-4">
        <div
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md"
          style={{
            color: iconColor,
            backgroundColor: `color-mix(in srgb, ${iconColor} 15%, transparent)`,
          }}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">{title}</span>
          <span className="text-2xl leading-tight font-semibold">{count}</span>
        </div>
      </CardContent>
    </Card>
  );
}
