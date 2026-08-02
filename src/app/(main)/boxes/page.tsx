import { redirect } from "next/navigation";

import BoxesList from "@/features/boxes/components/boxes-list/boxes-list";
import EmptyList from "@/features/boxes/components/boxes-list/empty-list";
import { getBoxStatusCounts, listBoxes } from "@/features/boxes/services/box-service";
import { getCurrentMove, getMoveById } from "@/features/moves/services/move-service";
import { listRooms } from "@/features/rooms/services/room-service";

import ScreenHeader from "@/components/ui/screen-header";

type BoxesPageProps = {
  searchParams: Promise<{ moveId?: string }>;
};

const resolvePageMoveId = async (moveIdParam?: string): Promise<number> => {
  if (moveIdParam) {
    const move = await getMoveById(Number(moveIdParam));
    return move.id;
  }

  const currentMove = await getCurrentMove();
  if (currentMove) {
    return currentMove.id;
  }

  redirect("/moves");
};

const BoxesPage = async ({ searchParams }: BoxesPageProps) => {
  const { moveId: moveIdParam } = await searchParams;
  const moveId = await resolvePageMoveId(moveIdParam);
  const [boxes, statusCounts, rooms] = await Promise.all([
    listBoxes(moveId),
    getBoxStatusCounts(moveId),
    listRooms(moveId),
  ]);

  return (
    <main className="flex min-h-full flex-col gap-4 px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <ScreenHeader title="Boxes" />
      {boxes.length > 0 ? (
        <BoxesList
          moveId={moveId}
          initialBoxes={boxes}
          initialStatusCounts={statusCounts}
          rooms={rooms}
        />
      ) : (
        <EmptyList />
      )}
    </main>
  );
};

export default BoxesPage;
