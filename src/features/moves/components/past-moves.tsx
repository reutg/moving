"use client";

import { SectionSubheader } from "@/components/ui/text";
import { Move } from "@/lib/db/schema";
import PastMoveCard from "./past-move-card";

interface PastMovesProps {
  otherMoves: Move[];
  settingMoveId: number | null;
  onSelectMove: (move: Move) => void;
  onOpenActions: (move: Move) => void;
}

const PastMoves: React.FC<PastMovesProps> = ({
  otherMoves,
  settingMoveId,
  onSelectMove,
  onOpenActions,
}) => {
  return (
    <>
      {otherMoves.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <SectionSubheader>Other moves</SectionSubheader>
          {otherMoves.map((move) => (
            <PastMoveCard
              key={move.id}
              move={move}
              isSettingCurrent={settingMoveId === move.id}
              onSelect={() => onSelectMove(move)}
              onOpenActions={() => onOpenActions(move)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default PastMoves;
