import Link from "next/link";

import {
  BOX_STATUS_LABELS,
  type BoxStatus,
  COMMON_LOCATIONS,
  type CommonLocationKey,
  FALLBACK_LOCATION_ICON,
  FALLBACK_LOCATION_ICON_TILE,
  LOCATION_ICON_TILE,
  LOCATION_ICONS,
} from "@/constants";
import type { Box } from "@/lib/db/schema";

import Chip from "@/components/ui/chip";
import ListItemContent from "@/components/ui/list-item-content";
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
      <Chip
        size="sm"
        label={BOX_STATUS_LABELS[status]}
        className={`${STATUS_CHIP_CLASS[status]}`}
      />
    </Link>
  );
};

export default BoxCard;
