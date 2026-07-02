"use client";

import { SectionSubheader } from "@/components/ui/text";
import { Move } from "@/lib/db/schema";
import PastMoveCard from "./past-move-card";

type PastMovesProps = {
  otherMoves: Move[];
  pendingCurrentMoveId: number | null;
  onSelectMove: (move: Move) => void;
  onOpenActionsSheet: (move: Move) => void;
};

const PastMoves = ({
  otherMoves,
  pendingCurrentMoveId,
  onSelectMove,
  onOpenActionsSheet,
}: PastMovesProps) => {
  return (
    <>
      {otherMoves.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <SectionSubheader>Other moves</SectionSubheader>
          {otherMoves.map((move) => (
            <PastMoveCard
              key={move.id}
              move={move}
              isSettingCurrent={pendingCurrentMoveId === move.id}
              onSelect={() => onSelectMove(move)}
              onOpenActions={() => onOpenActionsSheet(move)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default PastMoves;
