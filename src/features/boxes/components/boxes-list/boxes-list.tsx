"use client";

import ButtonsSwitch from "@/components/inputs/buttons-switch";
import Spinner from "@/components/ui/spinner";
import type { BoxStatusCounts } from "@/features/boxes/types/box-status-counts";
import type { Box } from "@/lib/db/schema";

import { useBoxesList } from "../../hooks/use-boxes-list";
import RoomFilter from "./room-filter";
import BoxCard from "../../box-card";

type BoxesListProps = {
  initialBoxes?: Box[];
  initialStatusCounts?: BoxStatusCounts;
};

const BoxesList = ({ initialBoxes, initialStatusCounts }: BoxesListProps) => {
  const {
    filteredBoxes,
    statusOptions,
    selectedStatus,
    handleStatusChange,
    selectedRoom,
    handleSelectRoom,
    isLoading,
    error,
  } = useBoxesList({ initialBoxes, initialStatusCounts });

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

      <div className="flex flex-col gap-2">
        {filteredBoxes.map((box) => (
          <BoxCard key={box.id} box={box} />
        ))}
      </div>
    </>
  );
};

export default BoxesList;
