import Link from "next/link";

import IconTile from "@/components/ui/icon-tile";
import {
  BOX_STATUS_LABELS,
  COMMON_LOCATIONS,
  FALLBACK_LOCATION_ICON,
  FALLBACK_LOCATION_ICON_TILE,
  LOCATION_ICON_TILE,
  LOCATION_ICONS,
  type BoxStatus,
  type CommonLocationKey,
} from "@/constants";
import type { Box } from "@/lib/db/schema";

import Chip from "@/components/ui/chip";
import SeparatorDot from "@/components/ui/separator-dot";

type BoxCardProps = {
  box: Box;
};

const STATUS_CHIP_CLASS: Record<BoxStatus, string> = {
  packed: "bg-status-packed-bg text-status-packed",
  packing: "bg-status-packing-bg text-status-packing",
};

const BoxCard = ({ box }: BoxCardProps) => {
  const status = box.status as BoxStatus;
  const roomKey = box.destinationRoom as CommonLocationKey;
  const RoomIcon = LOCATION_ICONS[roomKey] ?? FALLBACK_LOCATION_ICON;
  const tileColors = LOCATION_ICON_TILE[roomKey] ?? FALLBACK_LOCATION_ICON_TILE;
  const destinationRoom = COMMON_LOCATIONS[roomKey] ?? box.destinationRoom;

  return (
    <Link
      href={`/boxes/${box.id}/preview`}
      className="flex min-w-0 flex-1 items-center gap-3.5 py-3.5"
    >
      <IconTile
        icon={RoomIcon}
        backgroundColor={tileColors.backgroundColor}
        iconColor={tileColors.iconColor}
        size="sm"
      />

      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-semibold">{box.name}</div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground font-thin">Box {box.number}</span>
          <SeparatorDot />
          <span className="text-muted-foreground truncate">{destinationRoom}</span>
        </div>
      </div>
      <Chip
        size="sm"
        label={BOX_STATUS_LABELS[status]}
        className={`${STATUS_CHIP_CLASS[status]}`}
      />
    </Link>
  );
};

export default BoxCard;
