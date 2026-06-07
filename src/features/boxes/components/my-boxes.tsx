import type { ReactNode } from "react";

import { Box as BoxIcon, PackageOpen } from "lucide-react";

import type { BoxStatus } from "@/constants";
import type { Box } from "@/lib/db/schema";

import { StatCard } from "@/components/ui/stat-card";

import type { BoxesSummary } from "../services/box-service";

type Props = {
  boxes: Box[];
  summary: BoxesSummary;
};

type StatusDisplay = {
  label: string;
  color: string;
  icon: ReactNode;
};

const ICON_SIZE = 22;

const STATUS_DISPLAY: Record<BoxStatus, StatusDisplay> = {
  packed: {
    label: "Packed",
    color: "var(--status-packed)",
    icon: <BoxIcon size={ICON_SIZE} />,
  },
  unpacked: {
    label: "Unpacked",
    color: "var(--status-unpacked)",
    icon: <PackageOpen size={ICON_SIZE} />,
  },
};

export function MyBoxes({ boxes: _boxes, summary }: Props) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">My Boxes</h2>
      <div className="flex gap-4">
        {Object.entries(summary.byStatus).map(([status, count]) => {
          const display = STATUS_DISPLAY[status as BoxStatus];
          return (
            <StatCard
              key={status}
              title={display.label}
              count={count}
              icon={display.icon}
              iconColor={display.color}
              className="flex-1"
            />
          );
        })}
      </div>
    </section>
  );
}
