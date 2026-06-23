"use client";

import IconTile from "@/components/ui/icon-tile";
import {
  FALLBACK_LOCATION_ICON,
  FALLBACK_LOCATION_ICON_TILE,
  LOCATION_ICON_TILE,
  LOCATION_ICONS,
  type CommonLocationKey,
} from "@/constants";
import type { Box } from "@/lib/db/schema";

type RoomIconProps = {
  box: Box;
};

const RoomIcon = ({ box }: RoomIconProps) => {
  const roomKey = box.destinationRoom as CommonLocationKey;
  const RoomIconComponent = LOCATION_ICONS[roomKey] ?? FALLBACK_LOCATION_ICON;
  const tileColors = LOCATION_ICON_TILE[roomKey] ?? FALLBACK_LOCATION_ICON_TILE;

  return (
    <div className="flex flex-col items-center gap-2">
      <IconTile
        icon={RoomIconComponent}
        backgroundColor={tileColors.backgroundColor}
        iconColor={tileColors.iconColor}
        className="size-16 rounded-md"
      />
      <p className="text-lg font-semibold">{box.name}</p>
    </div>
  );
};

export default RoomIcon;
