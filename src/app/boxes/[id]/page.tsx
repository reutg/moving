import PageHeader from "@/components/PageHeader";
import Chip from "@/components/ui/chip";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  BOX_STATUS_LABELS,
  type BoxStatus,
  COMMON_LOCATIONS,
  type CommonLocationKey,
  FALLBACK_LOCATION_COLOR,
  LOCATION_COLORS,
  LOCATION_ICONS,
} from "@/constants";
import BoxLabelActions from "@/features/boxes/components/box-label-actions";
import DeleteBoxButton from "@/features/boxes/components/delete-box-button";
import { getBoxById } from "@/features/boxes/services/box-service";
import { Box as BoxIcon, CalendarDays, List, MapPinIcon } from "lucide-react";

const STATUS_CLASS: Record<BoxStatus, string> = {
  packed: "bg-status-packed-bg text-status-packed",
  packing: "bg-status-packing-bg text-status-packing",
};

type BoxPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BoxPage({ params }: BoxPageProps) {
  const { id } = await params;

  const box = await getBoxById(Number(id));

  const roomKey = box.destinationRoom as CommonLocationKey;
  const RoomIcon = LOCATION_ICONS[roomKey] ?? BoxIcon;
  const iconColor = LOCATION_COLORS[roomKey] ?? FALLBACK_LOCATION_COLOR;

  const tableData: { icon: typeof List; label: string; value: React.ReactNode }[] = [
    {
      icon: List,
      label: "Description",
      value: box.description,
    },
    {
      icon: MapPinIcon,
      label: "Destination",
      value: COMMON_LOCATIONS[roomKey],
    },
    {
      icon: BoxIcon,
      label: "Status",
      value: <Chip label={BOX_STATUS_LABELS[box.status]} className={STATUS_CLASS[box.status]} />,
    },
    {
      icon: CalendarDays,
      label: "Created",
      value: box.createdAt.toLocaleDateString(),
    },
  ];

  return (
    <>
      <PageHeader title="Box Details" />
      <div className="flex flex-col gap-8">
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
        <Table>
          <TableBody className="[&_td]:align-top">
            {tableData.map((row) => (
              <TableRow key={row.label}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <row.icon className="size-4" />
                    <span className="text-sm font-medium">{row.label}</span>
                  </div>
                </TableCell>
                <TableCell className="break-words whitespace-normal">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <BoxLabelActions box={box} />
        <DeleteBoxButton box={box} />
      </div>
    </>
  );
}
