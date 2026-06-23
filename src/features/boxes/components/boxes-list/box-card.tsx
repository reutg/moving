import { MapPinIcon } from "lucide-react";
import Link from "next/link";

import IconTile from "@/components/ui/icon-tile";
import { Card, CardContent } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
import {
  FALLBACK_LOCATION_ICON,
  FALLBACK_LOCATION_ICON_TILE,
  COMMON_LOCATIONS,
  LOCATION_ICON_TILE,
  LOCATION_ICONS,
  type CommonLocationKey,
} from "@/constants";
import type { Box } from "@/lib/db/schema";

interface BoxCardProps {
  box: Box;
}

const BoxCard: React.FC<BoxCardProps> = ({ box }) => {
  const roomKey = box.destinationRoom as CommonLocationKey;
  const RoomIcon = LOCATION_ICONS[roomKey] ?? FALLBACK_LOCATION_ICON;
  const tileColors = LOCATION_ICON_TILE[roomKey] ?? FALLBACK_LOCATION_ICON_TILE;
  const destinationRoomName = box.destinationRoom ? COMMON_LOCATIONS[roomKey] : "";

  return (
    <Link href={`/boxes/${box.id}/preview`} className="block">
      <Card className="hover:bg-muted transition-colors">
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <IconTile
              icon={RoomIcon}
              backgroundColor={tileColors.backgroundColor}
              iconColor={tileColors.iconColor}
              className="size-12 rounded-md"
            />
            <div className="flex flex-col gap-1">
              <span className="text-foreground text-md font-semibold">{box.name}</span>
              <span className="text-muted-foreground line-clamp-2 text-sm">{box.description}</span>

              <p className="flex items-center gap-1">
                <MapPinIcon size={16} /> {destinationRoomName}
              </p>
            </div>
          </div>

          <Chip label={box.status.toString()} />
        </CardContent>
      </Card>
    </Link>
  );
};

export default BoxCard;
