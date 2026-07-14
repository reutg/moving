"use client";

import { useRef } from "react";

import Link from "next/link";

import { EllipsisVertical, SquarePen, Trash2 } from "lucide-react";

import { FALLBACK_LOCATION_ICON, LOCATION_ICONS } from "@/constants";
import { cn } from "@/lib/utils";

import type { RoomWithBoxesCount } from "@/features/rooms/services/room-service";

import { Button } from "@/components/ui/button";
import ListItemContent from "@/components/ui/list-item-content";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

type RoomRowProps = {
  room: RoomWithBoxesCount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onDelete: (roomId: number) => void;
  isDeleting: boolean;
};

const RoomRow = ({ room, open, onOpenChange, onClose, onDelete, isDeleting }: RoomRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const icon = LOCATION_ICONS[room.type] ?? FALLBACK_LOCATION_ICON;

  return (
    <div
      ref={rowRef}
      className={cn(
        "relative z-0 flex min-w-0 items-center gap-2",
        open &&
          "bg-card border-border z-50 -mx-(--card-spacing) rounded-2xl border px-(--card-spacing) shadow-[0_8px_30px_rgba(15,23,42,0.1)]",
      )}
    >
      <Link href={`/rooms/${room.id}`} className="flex min-w-0 flex-1 items-center">
        <ListItemContent
          icon={icon}
          backgroundColor={`var(--room-${room.type})`}
          iconColor="var(--primary-foreground)"
          title={room.name}
          description={`${room.boxesCount} ${room.boxesCount === 1 ? "box" : "boxes"}`}
        />
      </Link>

      <Popover modal open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger
          render={
            <Button
              variant={open ? "outline" : "ghost"}
              size="icon-sm"
              className="shrink-0 rounded-full"
            >
              <EllipsisVertical />
            </Button>
          }
        />
        <PopoverContent
          anchor={rowRef}
          align="center"
          side="bottom"
          sideOffset={6}
          showBackdrop
          className="w-(--anchor-width) rounded-xl p-0 py-3.5"
        >
          <Button variant="list" size="icon-sm" className="h-fit w-full px-4" onClick={onClose}>
            <SquarePen />
            Rename
          </Button>
          <Separator className="bg-border-light" />
          <Button
            variant="list"
            size="icon-sm"
            className="text-destructive h-fit w-full px-4"
            disabled={isDeleting}
            onClick={() => onDelete(room.id)}
          >
            <Trash2 />
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RoomRow;
