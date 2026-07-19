"use client";

import type { CommonLocationKey } from "@/constants";
import {
  COMMON_LOCATIONS,
  FALLBACK_LOCATION_ICON,
  FALLBACK_LOCATION_ICON_TILE,
  LOCATION_ICON_TILE,
  LOCATION_ICONS,
} from "@/constants";

import type { BoxSearchBoxResult } from "@/features/boxes/types/box-search-result";

import { Card, CardContent } from "@/components/ui/card";
import ListItemContent from "@/components/ui/list-item-content";
import SeparatorDot from "@/components/ui/separator-dot";

interface BoxResultProps {
  box: BoxSearchBoxResult;
}

const BoxResult: React.FC<BoxResultProps> = ({ box }) => {
  const roomKey = box.room as CommonLocationKey;
  const RoomIcon = LOCATION_ICONS[roomKey] ?? FALLBACK_LOCATION_ICON;
  const tileColors = LOCATION_ICON_TILE[roomKey] ?? FALLBACK_LOCATION_ICON_TILE;
  const roomLabel = COMMON_LOCATIONS[roomKey] ?? box.room;

  return (
    <Card className="rounded-2xl p-0">
      <CardContent className="flex items-center justify-between">
        <ListItemContent
          icon={RoomIcon}
          title={box.title}
          backgroundColor={tileColors.backgroundColor}
          iconColor={tileColors.iconColor}
          description={
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-thin">Box {box.boxNumber}</span>
                <SeparatorDot />
                <span className="text-muted-foreground truncate">{roomLabel}</span>
              </div>
              <span className="text-muted-foreground text-sm font-thin">
                Contains &quot;{box.match}&quot;
              </span>
            </div>
          }
        />
      </CardContent>
    </Card>
  );
};

export default BoxResult;
