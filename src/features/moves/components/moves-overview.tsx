"use client";

import type { Move } from "@/lib/db/schema";

import { useMovesPage } from "../hooks/use-moves-page";
import ActiveMove from "./active-move";
import PastMoves from "./past-moves";

type MovesOverviewProps = {
  activeMove: Move | null;
  initialPastMoves: Move[];
};

const MovesOverview = ({ activeMove, initialPastMoves }: MovesOverviewProps) => {
  const {
    pastMoves,
    selectedMove,
    isReActivating,
    isMarkingComplete,
    isDeleting,
    isOpen,
    getMoveDate,
    selectMove,
    handleReActivateMove,
    handleMarkComplete,
    handleDeleteMove,
    openDelete,
    closeDelete,
  } = useMovesPage({ initialPastMoves });

  return (
    <>
      <ActiveMove
        move={activeMove}
        getMoveDate={getMoveDate}
        isMarkingComplete={isMarkingComplete}
        handleMarkComplete={handleMarkComplete}
      />
      <PastMoves
        pastMoves={pastMoves}
        selectedMove={selectedMove}
        isReActivating={isReActivating}
        isMarkingComplete={isMarkingComplete}
        isDeleting={isDeleting}
        getMoveDate={getMoveDate}
        selectMove={selectMove}
        handleReActivateMove={handleReActivateMove}
        handleMarkComplete={handleMarkComplete}
        handleDeleteMove={handleDeleteMove}
        openDelete={openDelete}
        closeDelete={closeDelete}
        isOpen={isOpen}
      />
    </>
  );
};

export default MovesOverview;
