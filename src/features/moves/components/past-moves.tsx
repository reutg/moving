"use client";

import { SectionSubheader } from "@/components/ui/text";
import { Move } from "@/lib/db/schema";
import PastMoveCard from "./past-move-card";
import ActionsSheet from "./move-actions/actions-sheet";
import DeletePrompt from "@/components/delete-prompt";

interface PastMovesProps {
  pastMoves: Move[];
  selectedMove: Move | null;
  isReActivating: boolean;
  isMarkingComplete: boolean;
  isDeleting: boolean;
  isOpen: boolean;
  getMoveDate: (move?: Move | null) => string;
  selectMove: (move: Move | null) => void;
  handleReActivateMove: () => Promise<void>;
  handleMarkComplete: (move: Move | null) => Promise<void>;
  handleDeleteMove: () => Promise<void>;
  openDelete: () => void;
  closeDelete: () => void;
}

const PastMoves: React.FC<PastMovesProps> = ({
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
}) => {
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <SectionSubheader>Other moves</SectionSubheader>
        {pastMoves.map((move) => (
          <PastMoveCard key={move.id} move={move} onClick={() => selectMove(move)} />
        ))}
      </div>
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

export default PastMoves;
