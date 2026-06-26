import Chip from "@/components/ui/chip";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import IconTile from "@/components/ui/icon-tile";
import PageHeader from "@/components/ui/page-header";
import SeparatorDot from "@/components/ui/separator-dot";
import {
  BOX_STATUS_LABELS,
  BoxStatus,
  COMMON_LOCATIONS,
  CommonLocationKey,
  FALLBACK_LOCATION_ICON,
  FALLBACK_LOCATION_ICON_TILE,
  LOCATION_ICON_TILE,
  LOCATION_ICONS,
} from "@/constants";
import { getBoxById } from "@/features/boxes/services/box-service";
import DeleteBoxButton from "@/features/boxes/components/delete-box-button";
import { appUrl } from "@/lib/app-url";
import { formatDate } from "@/lib/date-utils";
import { ChevronLeft, Pencil, Printer } from "lucide-react";
import QrGenerator from "@/features/boxes/components/qr-generator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PreviewBoxPageProps {
  params: Promise<{ id: number }>;
}

const STATUS_CLASS: Record<BoxStatus, string> = {
  packed: "bg-status-packed-bg text-status-packed",
  packing: "bg-status-packing-bg text-status-packing",
};

const PreviewBoxPage: React.FC<PreviewBoxPageProps> = async ({ params }) => {
  const { id } = await params;
  const box = await getBoxById(id);

  const roomKey = box.destinationRoom as CommonLocationKey;
  const RoomIconComponent = LOCATION_ICONS[roomKey] ?? FALLBACK_LOCATION_ICON;
  const destinationRoom = COMMON_LOCATIONS[roomKey] ?? box.destinationRoom;
  const tileColors = LOCATION_ICON_TILE[roomKey] ?? FALLBACK_LOCATION_ICON_TILE;
  return (
    <main className="flex-container page-content">
      <PageHeader title={`Box ${box.number}`} backHref="/" icon={ChevronLeft} />

      <div className="flex gap-4">
        <IconTile
          icon={RoomIconComponent}
          backgroundColor={tileColors.backgroundColor}
          iconColor={tileColors.iconColor}
          className="size-16 rounded-md"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-foreground text-2xl leading-tight font-bold tracking-tight">
            {box.name}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm leading-tight font-medium tracking-tight">
              {destinationRoom}
            </span>

            <SeparatorDot />
            <span className="text-muted-foreground text-sm leading-tight font-medium tracking-tight">
              {`Created ${formatDate(box.createdAt, "MMM DD")}`}
            </span>

            <SeparatorDot />

            <Chip label={BOX_STATUS_LABELS[box.status]} className={STATUS_CLASS[box.status]} />
          </div>
        </div>
      </div>

      <Card>
        <CardContent>
          <CardTitle className="mb-2 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            Contents
          </CardTitle>
          <CardDescription className="text-foreground text-sm leading-relaxed font-light">
            {box.description}
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4">
          <div className="size-20 shrink-0">
            <QrGenerator url={appUrl(`/boxes/${box.id}`)} />
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-sm font-semibold">{`Box #${box.number}`}</span>
            </div>
            <p className="text-muted-foreground text-xs leading-normal">
              Point your camera at the sticker on the box to see what's inside.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button>
        <Printer /> Print label
      </Button>

      <div className="flex gap-2">
        <Link href={`/boxes/${box.id}/edit`} className="min-w-0 flex-1">
          <Button variant="outline">
            <Pencil /> Edit
          </Button>
        </Link>
        <DeleteBoxButton box={box} label="Delete" className="flex-1" />
      </div>
    </main>
  );
};

export default PreviewBoxPage;
