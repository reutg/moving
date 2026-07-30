import { ChevronLeft, Plus } from "lucide-react";

import MovesOverview from "@/features/moves/components/moves-overview";
import { getCurrentMove, getOtherMoves } from "@/features/moves/services/move-service";

import { IconLink } from "@/components/ui/icon-link";
import PageHeader from "@/components/ui/page-header";

const MovesPage = async () => {
  const [currentMove, otherMoves] = await Promise.all([getCurrentMove(), getOtherMoves()]);

  return (
    <main className="min-h-full px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] flex flex-col gap-4">
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
      <MovesOverview currentMove={currentMove} initialOtherMoves={otherMoves} />
    </main>
  );
};

export default MovesPage;
