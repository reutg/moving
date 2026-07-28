"use client";

import type { BoxWithRoom } from "@/features/boxes/services/box-service";
import type { BoxStatusCounts } from "@/features/boxes/types/box-status-counts";

import ButtonsSwitch from "@/components/inputs/buttons-switch";
import { Card, CardContent } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";

import { useBoxesList } from "../../hooks/use-boxes-list";

import BoxCard from "./box-card";
import RoomFilter from "./room-filter";

type BoxesListProps = {
  moveId: number;
  initialBoxes?: BoxWithRoom[];
  initialStatusCounts?: BoxStatusCounts;
};

const BoxesList = ({ moveId, initialBoxes, initialStatusCounts }: BoxesListProps) => {
  const {
    filteredBoxes,
    statusOptions,
    selectedStatus,
    handleStatusChange,
    selectedRoom,
    handleSelectRoom,
    isLoading,
    error,
  } = useBoxesList({ moveId, initialBoxes, initialStatusCounts });

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-destructive text-sm">{error}</p>;
  }

  return (
    <>
      <ButtonsSwitch
        name="status"
        value={selectedStatus}
        options={statusOptions}
        handleButtonClick={handleStatusChange}
      />
      <RoomFilter selectedRoom={selectedRoom} handleSelectRoom={handleSelectRoom} />

      <Card className="p-0">
        <CardContent>
          <div className="divide-border divide-y">
            {filteredBoxes.map((box) => (
              <BoxCard key={box.id} box={box} />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BoxesList;
