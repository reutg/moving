"use client";

import { FormProvider } from "react-hook-form";

import type { RoomWithBoxesCount } from "@/features/rooms/services/room-service";

import useRoomTypeSheet from "../hooks/use-room-type-sheet";

import AddRoomSheet from "./add-room-sheet";
import RoomCard from "./room-card";

interface RoomsListProps {
  rooms: RoomWithBoxesCount[];
}

const RoomsList: React.FC<RoomsListProps> = ({ rooms }) => {
  const {
    isOpen: isAddRoomSheetOpen,
    onOpenChange: onAddRoomSheetOpenChange,
    close: onAddRoomSheetClose,
    form,
    submit,
    isSubmitting,
    submitError,
  } = useRoomTypeSheet();

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
      <FormProvider {...form}>
        <AddRoomSheet
          open={isAddRoomSheetOpen}
          onOpenChange={onAddRoomSheetOpenChange}
          onClose={onAddRoomSheetClose}
          onSubmit={submit}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      </FormProvider>
    </>
  );
};

export default RoomsList;
