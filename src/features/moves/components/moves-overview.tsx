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
    pendingCurrentMoveId,
    isReActivating,
    isMarkingComplete,
    isDeletingMove,
    isDeleteMovePromptOpen,
    getMoveDate,
    openActionsSheet,
    closeActionsSheet,
    setCurrentMove,
    handleReActivateMove,
    handleMarkComplete,
    confirmDeleteMove,
    openDeleteMovePrompt,
    closeDeleteMovePrompt,
  } = useMovesPage({
    currentMoveId: currentMove?.id ?? null,
    initialOtherMoves,
  });

  return (
    <>
      <ActiveMove
        move={currentMove}
        getMoveDate={getMoveDate}
        onOpenActionsSheet={openActionsSheet}
      />
      <PastMoves
        otherMoves={otherMoves}
        pendingCurrentMoveId={pendingCurrentMoveId}
        onSelectMove={(move) => void setCurrentMove(move)}
        onOpenActionsSheet={openActionsSheet}
      />

      <ActionsSheet
        move={selectedMove}
        onClose={closeActionsSheet}
        getMoveDate={getMoveDate}
        isReActivating={isReActivating}
        isMarkingComplete={isMarkingComplete}
        isDeletingMove={isDeletingMove}
        onReActivateMove={handleReActivateMove}
        onMarkComplete={handleMarkComplete}
        onDeleteMove={openDeleteMovePrompt}
      />

      <DeletePrompt
        itemName={selectedMove?.name ?? ""}
        onConfirm={confirmDeleteMove}
        onCancel={closeDeleteMovePrompt}
        isDeleting={isDeletingMove}
        isOpen={isDeleteMovePromptOpen}
        onOpenChange={closeDeleteMovePrompt}
        deleteText={selectedMove?.boxesCount ? "Delete Move & boxes" : "Delete move"}
      >
        {selectedMove?.boxesCount && (
          <>
            <h6 className="text-foreground text-center text-xl leading-tight font-bold">
              Delete {selectedMove?.name}?
            </h6>
            <span className="text-muted-foreground text-center text-lg">
              This move has {selectedMove?.boxesCount ?? 0} boxes packed. <br />
              Deleting the move will also delete all of its boxes and QR labels - this can't be
              undone.
            </span>
          </>
        )}
      </DeletePrompt>
    </>
  );
};

export default MovesOverview;
