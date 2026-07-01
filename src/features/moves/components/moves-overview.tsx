"use client";

import type { Move } from "@/lib/db/schema";

import { useMovesPage } from "../hooks/use-moves-page";
import ActiveMove from "./active-move";
import PastMoves from "./past-moves";
import ActionsSheet from "./move-actions/actions-sheet";
import DeletePrompt from "@/components/delete-prompt";

type MovesOverviewProps = {
  currentMove: Move | null;
  initialOtherMoves: Move[];
};

const MovesOverview = ({ currentMove, initialOtherMoves }: MovesOverviewProps) => {
  const {
    otherMoves,
    selectedMove,
    settingMoveId,
    isReActivating,
    isMarkingComplete,
    isDeleting,
    isOpen,
    getMoveDate,
    selectMove,
    setCurrentMove,
    handleReActivateMove,
    handleMarkComplete,
    handleDeleteMove,
    openDelete,
    closeDelete,
  } = useMovesPage({
    currentMoveId: currentMove?.id ?? null,
    initialOtherMoves,
  });

  return (
    <>
      <ActiveMove move={currentMove} getMoveDate={getMoveDate} selectMove={selectMove} />
      <PastMoves
        otherMoves={otherMoves}
        settingMoveId={settingMoveId}
        onSelectMove={(move) => void setCurrentMove(move)}
        onOpenActions={selectMove}
      />

      <ActionsSheet
        selectedMove={selectedMove}
        selectMove={selectMove}
        getMoveDate={getMoveDate}
        isReActivating={isReActivating}
        isMarkingComplete={isMarkingComplete}
        isDeleting={isDeleting}
        handleReActivateMove={handleReActivateMove}
        handleMarkComplete={handleMarkComplete}
        handleDeleteMove={openDelete}
      />

      <DeletePrompt
        itemName={selectedMove?.name ?? ""}
        onConfirm={handleDeleteMove}
        onCancel={closeDelete}
        isDeleting={isDeleting}
        isOpen={isOpen}
        onOpenChange={closeDelete}
      />
    </>
  );
};

export default MovesOverview;
