import Link from "next/link";

import IconTile from "@/components/ui/icon-tile";
import ScreenHeader from "@/components/ui/screen-header";
import {
  COMMON_LOCATIONS,
  FALLBACK_LOCATION_ICON,
  FALLBACK_LOCATION_ICON_TILE,
  LOCATION_ICON_TILE,
  LOCATION_ICONS,
  type CommonLocationKey,
} from "@/constants";
import { getBoxesSummary } from "@/features/boxes/services/box-service";

const RoomsPage = async () => {
  const { byDestinationRoom } = await getBoxesSummary();

  return (
    <main className="page-content flex flex-col gap-4">
      <ScreenHeader title="Rooms" />

      <div className="flex flex-col gap-2">
        {(Object.entries(COMMON_LOCATIONS) as [CommonLocationKey, string][]).map(
          ([roomKey, roomLabel]) => {
            const boxCount = byDestinationRoom[roomKey] ?? 0;
            const RoomIcon = LOCATION_ICONS[roomKey] ?? FALLBACK_LOCATION_ICON;
            const tileColors = LOCATION_ICON_TILE[roomKey] ?? FALLBACK_LOCATION_ICON_TILE;

            return (
              <Link
                key={roomKey}
                href="/boxes"
                className="bg-card border-border flex items-center gap-3.5 rounded-md border p-3.5 transition-colors"
              >
                <IconTile
                  icon={RoomIcon}
                  backgroundColor={tileColors.backgroundColor}
                  iconColor={tileColors.iconColor}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-semibold">{roomLabel}</div>
                  <div className="text-muted-foreground text-[13px]">
                    {boxCount} {boxCount === 1 ? "box" : "boxes"}
                  </div>
                </div>
              </Link>
            );
          },
        )}
      </div>
    </main>
  );
};

export default RoomsPage;
