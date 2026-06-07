import { getBoxesSummary, listBoxes, MyBoxes } from "@/features/boxes";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [boxes, summary] = await Promise.all([listBoxes(), getBoxesSummary()]);

  return (
    <main className="container">
      <MyBoxes boxes={boxes} summary={summary} />
    </main>
  );
}
