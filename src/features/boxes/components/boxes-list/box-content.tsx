"use client";

import Link from "next/link";

import { Check } from "lucide-react";

import {
  BOX_STATUS_LABELS,
  type BoxStatus,
  FALLBACK_LOCATION_ICON,
  FALLBACK_LOCATION_ICON_TILE,
  LOCATION_ICON_TILE,
  LOCATION_ICONS,
} from "@/constants";

import type { BoxWithRoom } from "@/features/boxes/services/box-service";

import Chip from "@/components/ui/chip";
import ListItemContent from "@/components/ui/list-item-content";
import SeparatorDot from "@/components/ui/separator-dot";

import { useBoxStatusToggle } from "../../hooks/use-box-status-toggle";

type BoxContentProps = {
  box: BoxWithRoom;
  onStatusChange?: (boxId: number, status: BoxStatus) => void;
};

const STATUS_CHIP_CLASS: Record<BoxStatus, string> = {
  packed: "bg-status-packed-bg text-status-packed",
  packing: "bg-status-packing-bg text-status-packing",
};

const BoxContent = ({ box, onStatusChange }: BoxContentProps) => {
  const { status, isUpdating, handleStatusToggle } = useBoxStatusToggle({
    boxId: box.id,
    initialStatus: box.status as BoxStatus,
    onStatusChange,
  });

  const roomKey = box.roomType;
  const RoomIcon = LOCATION_ICONS[roomKey] ?? FALLBACK_LOCATION_ICON;
  const tileColors = LOCATION_ICON_TILE[roomKey] ?? FALLBACK_LOCATION_ICON_TILE;
  const destinationRoom = box.roomName;

  return (
    <div className="flex min-w-0 flex-1 items-center px-4">
      <Link href={`/boxes/${box.id}/preview`} className="flex min-w-0 flex-1 items-center">
        <ListItemContent
          icon={RoomIcon}
          backgroundColor={tileColors.backgroundColor}
          iconColor={tileColors.iconColor}
          title={box.name}
          description={
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-thin">Box {box.number}</span>
              <SeparatorDot />
              <span className="text-muted-foreground truncate">{destinationRoom}</span>
            </div>
          }
        />
      </Link>
      <Chip
        label={BOX_STATUS_LABELS[status]}
        className={STATUS_CHIP_CLASS[status]}
        icon={status === "packed" ? Check : undefined}
        onClick={handleStatusToggle}
        disabled={isUpdating}
      />
    </div>
  );
};

export default BoxContent;
