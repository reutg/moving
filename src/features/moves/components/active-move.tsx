"use client";

import Button from "@/components/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
import IconTile from "@/components/ui/icon-tile";
import SeparatorDot from "@/components/ui/separator-dot";
import { SectionSubheader } from "@/components/ui/text";
import { COMMON_LOCATIONS, MOVE_STATUS_LABELS } from "@/constants";
import { getDaysUntilDate } from "@/lib/date-utils";
import type { Move } from "@/lib/db/schema";
import { Box, Calendar, EllipsisVertical, Pencil } from "lucide-react";

type ActiveMoveProps = {
  move: Move | null;
  getMoveDate: (move?: Move | null) => string;
  onOpenActionsSheet: (move: Move) => void;
};

const ActiveMove = ({ move, getMoveDate, onOpenActionsSheet }: ActiveMoveProps) => {
  if (!move) {
    return null;
  }

  const roomsCount = Object.keys(COMMON_LOCATIONS).length;

  return (
    <div className="space-y-2.5">
      <SectionSubheader>Active move</SectionSubheader>
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconTile icon={Box} size="sm" />
              <div className="flex flex-col gap-0.5">
                <p className="text-foreground text-lg font-bold">{move.name}</p>
                <div className="text-subtle-foreground flex items-center gap-1 text-sm font-thin">
                  <Calendar className="size-4" />
                  <span>{getMoveDate(move)}</span>
                  <SeparatorDot />
                  <span>in {getDaysUntilDate(move.moveDate)} days</span>
                </div>
              </div>
            </div>

            <Chip label={MOVE_STATUS_LABELS[move.status]} size="sm" />
          </div>

          <div className="text-subtle-foreground flex items-center gap-1 text-sm">
            <span className="text-foreground">{move.boxesCount ?? 0} boxes</span>
            <SeparatorDot />
            <span className="text-subtle-foreground font-thin">{roomsCount} rooms</span>
          </div>

          <div className="flex items-center gap-2">
            <ButtonLink href={`/moves/${move.id}`} variant="outline">
              <Pencil className="size-4" />
              Edit details
            </ButtonLink>

            <Button variant="outline" onClick={() => onOpenActionsSheet(move)} className="w-13">
              <EllipsisVertical className="size-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveMove;
