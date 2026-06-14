import type { ReactNode } from "react";
import { Box as BoxIcon, PackageOpen } from "lucide-react";

import { BOX_STATUS_LABELS, type BoxStatus } from "@/constants";
import { StatCard } from "@/components/ui/stat-card";
import type { BoxesSummary } from "../services/box-service";

type Props = {
  summary: BoxesSummary;
};

type StatusDisplay = {
  color: string;
  icon: ReactNode;
};

const ICON_SIZE = 22;

const STATUS_DISPLAY: Record<BoxStatus, StatusDisplay> = {
  packed: {
    color: "var(--status-packed)",
    icon: <BoxIcon size={ICON_SIZE} />,
  },
  packing: {
    color: "var(--status-packing)",
    icon: <PackageOpen size={ICON_SIZE} />,
  },
};

const MyBoxes = ({ summary }: Props) => {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">My Boxes</h2>
      <div className="flex gap-4">
        {Object.entries(summary.byStatus).map(([status, count]) => {
          const boxStatus = status as BoxStatus;
          const display = STATUS_DISPLAY[boxStatus];
          return (
            <StatCard
              key={status}
              title={BOX_STATUS_LABELS[boxStatus]}
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
};

export default MyBoxes;
