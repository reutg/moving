"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
import IconTile from "@/components/ui/icon-tile";
import SeparatorDot from "@/components/ui/separator-dot";
import { MOVE_STATUS_LABELS } from "@/constants";
import { formatDate, isFutureDate } from "@/lib/date-utils";
import { Move } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { Box, EllipsisVertical, Loader2 } from "lucide-react";

interface PastMoveCardProps {
  move: Move;
  isSettingCurrent: boolean;
  onSelect: () => void;
  onOpenActions: () => void;
}

const PastMoveCard: React.FC<PastMoveCardProps> = ({
  move,
  isSettingCurrent,
  onSelect,
  onOpenActions,
}) => {
  const moveDate = move.moveDate ? formatDate(move.moveDate, "MMM D, YYYY") : "";
  const chipBackgroundColor = move.status === "done" ? "bg-status-done-bg" : "bg-chip-background";
  const chipTextColor = move.status === "done" ? "text-status-done" : "text-chip-text";
  const isFutureMove = move.moveDate ? isFutureDate(move.moveDate) : false;

  return (
    <Card className="cursor-pointer" onClick={onSelect}>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconTile
              icon={Box}
              size="sm"
              backgroundColor="var(--background)"
              iconColor="#8E8E94"
            />
            <div className="flex flex-col gap-0.5">
              <p className="text-foreground text-lg font-bold">{move.name}</p>
              <div className="text-subtle-foreground flex items-center gap-2 text-sm font-thin">
                {move.moveDate && (
                  <span>{isFutureMove ? `Moving on ${moveDate}` : `Moved ${moveDate}`}</span>
                )}
                <SeparatorDot />
                <Chip
                  label={MOVE_STATUS_LABELS[move.status]}
                  size="sm"
                  className={cn(chipBackgroundColor, chipTextColor)}
                />
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            disabled={isSettingCurrent}
            onClick={(event) => {
              event.stopPropagation();
              onOpenActions();
            }}
          >
            {isSettingCurrent ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <EllipsisVertical />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PastMoveCard;
