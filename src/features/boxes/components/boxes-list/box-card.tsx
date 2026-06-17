import { MapPinIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Box } from "@/lib/db/schema";
import Link from "next/link";
import Chip from "@/components/ui/chip";
import {
  FALLBACK_LOCATION_COLOR,
  FALLBACK_LOCATION_ICON,
  LOCATION_COLORS,
  LOCATION_ICONS,
} from "@/constants";
import { COMMON_LOCATIONS, CommonLocationKey } from "@/constants/common-locations";

interface BoxCardProps {
  box: Box;
}

const BoxCard: React.FC<BoxCardProps> = ({ box }) => {
  const roomKey = box.destinationRoom as CommonLocationKey;
  const RoomIcon = LOCATION_ICONS[roomKey] ?? FALLBACK_LOCATION_ICON;
  const iconColor = LOCATION_COLORS[roomKey] ?? FALLBACK_LOCATION_COLOR;
  const destinationRoomName = box.destinationRoom ? COMMON_LOCATIONS[roomKey] : "";

  return (
    <Link href={`/boxes/${box.id}`} className="block">
      <Card className="hover:bg-muted transition-colors">
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              aria-hidden
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md"
              style={{
                color: iconColor,
                backgroundColor: `color-mix(in srgb, ${iconColor} 15%, transparent)`,
              }}
            >
              <RoomIcon />
            </div>
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
