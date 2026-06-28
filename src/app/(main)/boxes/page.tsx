import ScreenHeader from "@/components/ui/screen-header";
import BoxesList from "@/features/boxes/components/boxes-list/boxes-list";
import EmptyList from "@/features/boxes/components/boxes-list/empty-list";
import { getBoxStatusCounts, listBoxes } from "@/features/boxes/services/box-service";

const BoxesPage = async () => {
  const [boxes, statusCounts] = await Promise.all([listBoxes(), getBoxStatusCounts()]);

  return (
    <main className="page-content flex flex-col gap-4">
      <ScreenHeader title="Boxes" />
      {boxes.length > 0 ? (
        <BoxesList initialBoxes={boxes} initialStatusCounts={statusCounts} />
      ) : (
        <EmptyList />
      )}
    </main>
  );
};

export default BoxesPage;
