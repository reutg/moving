"use client";

import type { BoxWithRoom } from "@/features/boxes/services/box-service";
import type { BoxStatusCounts } from "@/features/boxes/types/box-status-counts";
import type { RoomWithBoxesCount } from "@/features/rooms/services/room-service";

import ChipButtonGroup from "@/components/chip-button-group";
import { Card, CardContent } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";

import { useBoxesList } from "../../hooks/use-boxes-list";

import BoxContent from "./box-content";

type BoxesListProps = {
  moveId: number;
  initialBoxes?: BoxWithRoom[];
  initialStatusCounts?: BoxStatusCounts;
  rooms: RoomWithBoxesCount[];
};

const BoxesList = ({ moveId, initialBoxes, initialStatusCounts, rooms }: BoxesListProps) => {
  const {
    filteredBoxes,
    statusOptions,
    selectedStatus,
    handleStatusChange,
    selectedRoom,
    handleSelectRoom,
    handleBoxStatusChange,
    isLoading,
    error,
  } = useBoxesList({ moveId, initialBoxes, initialStatusCounts });

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-destructive text-sm">{error}</p>;
  }

  const roomsOptions = rooms.map((room) => ({
    value: room.type,
    label: room.name,
  }));

  return (
    <>
      <ChipButtonGroup
        selectedVariant="default"
        options={[{ value: null, label: "All" }, ...statusOptions]}
        selectedValue={selectedStatus}
        onSelect={handleStatusChange}
      />

      <ChipButtonGroup
        showColorDot
        options={[{ value: null, label: "All rooms" }, ...roomsOptions]}
        selectedValue={selectedRoom}
        onSelect={handleSelectRoom}
      />

      <Card className="p-0">
        <CardContent className="p-0">
          <div className="divide-border divide-y">
            {filteredBoxes.map((box) => (
              <BoxContent key={box.id} box={box} onStatusChange={handleBoxStatusChange} />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BoxesList;
