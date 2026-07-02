"use client";

import { Card, CardContent } from "@/components/ui/card";
import IconTile from "@/components/ui/icon-tile";
import SeparatorDot from "@/components/ui/separator-dot";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Move } from "@/lib/db/schema";
import { Box, Calendar, ChevronRight, Pencil, Trash } from "lucide-react";
import MakeMoveActiveButton from "./make-move-active-button";
import MarkMoveCompleteButton from "./mark-move-complete-button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ActionsSheetProps = {
  move: Move | null;
  onClose: () => void;
  getMoveDate: (move?: Move | null) => string;
  isReActivating: boolean;
  isMarkingComplete: boolean;
  isDeletingMove: boolean;
  onReActivateMove: () => Promise<void>;
  onMarkComplete: (move: Move | null) => Promise<void>;
  onDeleteMove: () => void;
};

const ActionsSheet = ({
  move,
  onClose,
  getMoveDate,
  isReActivating,
  isMarkingComplete,
  isDeletingMove,
  onReActivateMove,
  onMarkComplete,
  onDeleteMove,
}: ActionsSheetProps) => {
  const statusText = move?.status === "done" ? "Completed" : "Active";

  return (
    <Sheet open={!!move} onOpenChange={(open) => !open && onClose()}>
      <SheetContent showCloseButton={false} className="space-y-4">
        <div className="flex items-center gap-3">
          <IconTile icon={Box} size="sm" />
          <div className="flex flex-col gap-0.5">
            <p className="text-foreground text-lg font-bold">{move?.name}</p>
            <div className="text-subtle-foreground flex items-center gap-1 text-sm font-thin">
              <Calendar className="size-4" />
              <span>{statusText}</span>
              <SeparatorDot />
              <span>{move ? getMoveDate(move) : ""}</span>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-4 p-0">
            {move?.status === "done" ? (
              <MakeMoveActiveButton
                isReActivating={isReActivating}
                handleReActivateMove={onReActivateMove}
              />
            ) : (
              <MarkMoveCompleteButton
                isMarkingComplete={isMarkingComplete}
                handleMarkComplete={() => onMarkComplete(move)}
              />
            )}
            <Separator className="bg-border-light" />

            <Link href={move ? `/boxes?moveId=${move.id}` : "/boxes"}>
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <Box />
                  <span className="text-foreground text-sm font-medium">View boxes</span>
                </div>
                <ChevronRight className="text-subtle-foreground size-4" />
              </div>
            </Link>

            <Separator className="bg-border-light" />

            <Link href={`/moves/${move?.id}`}>
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <Pencil />
                  <span className="text-foreground text-sm font-medium">Edit move</span>
                </div>
                <ChevronRight className="text-subtle-foreground size-4" />
              </div>
            </Link>
          </CardContent>
        </Card>

        <Button
          variant="destructive"
          className="w-full"
          onClick={onDeleteMove}
          disabled={isDeletingMove}
        >
          <Trash />
          Delete move
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default ActionsSheet;
