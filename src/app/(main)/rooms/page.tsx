import { Suspense } from "react";

import { PlusIcon } from "lucide-react";

import RoomsList from "@/features/rooms/components/rooms-list";
import { ADD_ROOM_HREF } from "@/features/rooms/constants/add-room-query";
import { listRooms } from "@/features/rooms/services/room-service";

import { ButtonLink } from "@/components/ui/button-link";
import ScreenHeader from "@/components/ui/screen-header";

const RoomsPage = async () => {
  const rooms = await listRooms();

  return (
    <main className="page-content flex flex-col gap-4">
      <ScreenHeader
        title="Rooms"
        actions={
          <ButtonLink href={ADD_ROOM_HREF} size="sm">
            <PlusIcon /> Add room
          </ButtonLink>
        }
      />

      <Suspense fallback={null}>
        <RoomsList rooms={rooms} />
      </Suspense>
    </main>
  );
};

export default RoomsPage;
