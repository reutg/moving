import { withApi } from "@/lib/api/handler";

import {
  createRoom,
  CreateRoomInputSchema,
  listRooms,
  ListRoomsQuerySchema,
} from "@/features/rooms/services/room-service";

export const GET = withApi(async (request) => {
  const { searchParams } = new URL(request.url);
  const { moveId } = ListRoomsQuerySchema.parse({
    moveId: searchParams.get("moveId") ?? undefined,
  });

  return listRooms(moveId);
});

export const POST = withApi(
  async (request) => {
    const body: unknown = await request.json().catch(() => ({}));
    const input = CreateRoomInputSchema.parse(body);
    return createRoom(input);
  },
  { status: 201 },
);
