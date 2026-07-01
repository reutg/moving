import ScreenHeader from "@/components/ui/screen-header";
import BoxesList from "@/features/boxes/components/boxes-list/boxes-list";
import EmptyList from "@/features/boxes/components/boxes-list/empty-list";
import { getBoxStatusCounts, listBoxes } from "@/features/boxes/services/box-service";
import { getActiveMove, getCurrentMove, getMoveById } from "@/features/moves/services/move-service";

type BoxesPageProps = {
  searchParams: Promise<{ moveId?: string }>;
};

const resolvePageMoveId = async (moveIdParam?: string): Promise<number> => {
  if (moveIdParam) {
    const move = await getMoveById(Number(moveIdParam));
    return move.id;
  }

  const activeMove = await getActiveMove();
  if (activeMove) {
    return activeMove.id;
  }

  const currentMove = await getCurrentMove();
  return currentMove.id;
};

const BoxesPage = async ({ searchParams }: BoxesPageProps) => {
  const { moveId: moveIdParam } = await searchParams;
  const moveId = await resolvePageMoveId(moveIdParam);
  const [boxes, statusCounts] = await Promise.all([listBoxes(moveId), getBoxStatusCounts(moveId)]);

  return (
    <main className="page-content flex flex-col gap-4">
      <ScreenHeader title="Boxes" />
      {boxes.length > 0 ? (
        <BoxesList moveId={moveId} initialBoxes={boxes} initialStatusCounts={statusCounts} />
      ) : (
        <EmptyList />
      )}
    </main>
  );
};

export default BoxesPage;
