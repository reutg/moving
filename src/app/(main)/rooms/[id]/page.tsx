import { ChevronLeft } from "lucide-react";

import { listBoxesByRoomId } from "@/features/boxes/services/box-service";
import Room from "@/features/rooms/components/room";
import { getRoomById } from "@/features/rooms/services/room-service";

import PageHeader from "@/components/ui/page-header";

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

const RoomPage: React.FC<RoomPageProps> = async ({ params }) => {
  const { id } = await params;
  const roomId = Number(id);
  const [room, boxes] = await Promise.all([getRoomById(roomId), listBoxesByRoomId(roomId)]);

  return (
    <main className="flex min-h-full flex-col gap-4 px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <PageHeader title={room.name} backHref="/rooms" icon={ChevronLeft} />
      <Room room={room} boxes={boxes} />
    </main>
  );
};

export default RoomPage;
