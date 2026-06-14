import PageHeader from "@/components/PageHeader";
import Chip from "@/components/ui/chip";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  BOX_STATUS_LABELS,
  type BoxStatus,
  COMMON_LOCATIONS,
  type CommonLocationKey,
} from "@/constants";
import BoxLabelActions from "@/features/boxes/components/box-label-actions";
import DeleteBoxButton from "@/features/boxes/components/delete-box-button";
import RoomIcon from "@/features/boxes/components/room-icon";
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
      <PageHeader title="Box Details" showEdit />
      <div className="flex flex-col gap-8">
        <RoomIcon box={box} />
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
