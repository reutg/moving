import { IconLink } from "@/components/ui/icon-link";
import PageHeader from "@/components/ui/page-header";
import MovesOverview from "@/features/moves/components/moves-overview";
import { getActiveMove, getPastMoves } from "@/features/moves/services/move-service";
import { ChevronLeft, Plus } from "lucide-react";

const MovesPage = async () => {
  const [activeMove, pastMoves] = await Promise.all([getActiveMove(), getPastMoves()]);

  return (
    <main className="page-content flex flex-col gap-4">
      <PageHeader
        title="Your moves"
        backHref="/"
        icon={ChevronLeft}
        trailing={
          <IconLink
            href="/moves/add"
            aria-label="Add move"
            icon={Plus}
            className="justify-self-start"
          />
        }
      />
      <MovesOverview activeMove={activeMove} initialPastMoves={pastMoves} />
    </main>
  );
};

export default MovesPage;
