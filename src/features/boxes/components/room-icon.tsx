"use client";

import {
  CommonLocationKey,
  FALLBACK_LOCATION_COLOR,
  FALLBACK_LOCATION_ICON,
  LOCATION_COLORS,
  LOCATION_ICONS,
} from "@/constants";
import { Box } from "@/lib/db/schema";

interface RoomIconProps {
  box: Box;
}

const RoomIcon: React.FC<RoomIconProps> = ({ box }) => {
  const roomKey = box.destinationRoom as CommonLocationKey;
  const RoomIcon = LOCATION_ICONS[roomKey] ?? FALLBACK_LOCATION_ICON;
  const iconColor = LOCATION_COLORS[roomKey] ?? FALLBACK_LOCATION_COLOR;
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        aria-hidden
        className="flex size-16 shrink-0 items-center justify-center rounded-md"
        style={{
          color: iconColor,
          backgroundColor: `color-mix(in srgb, ${iconColor} 15%, transparent)`,
        }}
      >
        <RoomIcon />
      </div>
      <p className="text-lg font-semibold">{box.name}</p>
    </div>
  );
};

export default RoomIcon;
