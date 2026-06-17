import { getBoxesSummary, listBoxes } from "@/features/boxes/services/box-service";
import MyBoxes from "@/features/boxes/components/my-boxes";
import BoxesList from "@/features/boxes/components/boxes-list/boxes-list";
import SearchBox from "@/features/boxes/components/search-box";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [boxes, summary] = await Promise.all([listBoxes(), getBoxesSummary()]);

  return (
    <main className="flex-container">
      <MyBoxes summary={summary} />
      <SearchBox />
      <BoxesList boxes={boxes} />
    </main>
  );
}
