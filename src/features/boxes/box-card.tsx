import Link from "next/link";

import IconTile from "@/components/ui/icon-tile";
import { Card, CardContent } from "@/components/ui/card";
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

import BoxCardPrintButton from "./box-card-print-button";

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
    <Card className="rounded-md transition-colors">
      <CardContent className="flex items-center gap-3.5">
        <Link href={`/boxes/${box.id}/preview`} className="flex min-w-0 flex-1 items-center gap-3.5">
          <IconTile
            icon={RoomIcon}
            backgroundColor={tileColors.backgroundColor}
            iconColor={tileColors.iconColor}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide uppercase">
                Box {box.number}
              </span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_CHIP_CLASS[status]}`}
              >
                {BOX_STATUS_LABELS[status]}
              </span>
            </div>

            <div className="truncate text-[15px] font-semibold">{box.name}</div>
            <div className="text-muted-foreground truncate text-[13px]">{destinationRoom}</div>
            {box.description ? (
              <div className="text-muted-foreground/70 truncate text-[13px]">{box.description}</div>
            ) : null}
          </div>
        </Link>

        <BoxCardPrintButton box={box} />
      </CardContent>
    </Card>
  );
};

export default BoxCard;
