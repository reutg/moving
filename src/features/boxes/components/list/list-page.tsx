"use client";

import ButtonsSwitch from "@/components/inputs/buttons-switch";

import { useBoxesList } from "../../hooks/use-boxes-list";
import RoomFilter from "./room-filter";
import BoxCard from "../../box-card";

const ListPage = () => {
  const {
    filteredBoxes,
    statusOptions,
    selectedStatus,
    handleStatusChange,
    selectedRoom,
    handleSelectRoom,
  } = useBoxesList();

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

export default ListPage;
