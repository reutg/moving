"use client";

import { FormProvider } from "react-hook-form";

import { cn } from "@/lib/utils";

import RoomRow from "@/features/rooms/components/room-row";
import useRoomActionsPopover from "@/features/rooms/hooks/use-room-actions-popover";
import type { RoomWithBoxesCount } from "@/features/rooms/services/room-service";

import { Card, CardContent } from "@/components/ui/card";

import useRoomTypeSheet from "../hooks/use-room-type-sheet";

import AddRoomSheet from "./add-room-sheet";

interface RoomsListProps {
  rooms: RoomWithBoxesCount[];
}

const RoomsList: React.FC<RoomsListProps> = ({ rooms }) => {
  const { activeRoomId, isOpen, onOpenChange, close, onDelete, isDeleting } =
    useRoomActionsPopover();
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
      <Card className={cn("p-0", activeRoomId !== null && "overflow-visible")}>
        <CardContent>
          <div className="divide-border divide-y">
            {rooms.map((room) => (
              <RoomRow
                key={room.id}
                room={room}
                open={isOpen(room.id)}
                onOpenChange={onOpenChange(room.id)}
                onClose={close}
                onDelete={onDelete}
                isDeleting={isDeleting && activeRoomId === room.id}
              />
            ))}
          </div>
        </CardContent>
      </Card>
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
