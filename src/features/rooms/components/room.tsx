"use client";

import { Info } from "lucide-react";

import type { CommonLocationKey } from "@/constants";
import type { Box, Room as RoomModel } from "@/lib/db/schema";

import BoxContent from "@/features/boxes/components/boxes-list/box-content";

import Button from "@/components/button";
import DeletePrompt from "@/components/delete-prompt";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import IconTile from "@/components/ui/icon-tile";

import useRoom from "../hooks/use-room";

interface RoomProps {
  room: RoomModel;
  boxes: Box[];
}

const Room: React.FC<RoomProps> = ({ room: initialRoom, boxes }) => {
  const {
    room,
    isUpdating,
    isDeleting,
    isDeletePromptOpen,
    isCannotDeleteOpen,
    handleToggleCompleted,
    handleDeleteClick,
    handleConfirmDelete,
    closeDeletePrompt,
    closeCannotDelete,
    setIsDeletePromptOpen,
    setIsCannotDeleteOpen,
  } = useRoom({
    room: initialRoom,
    boxesCount: boxes.length,
  });

  const buttonText = room.completed ? "Mark incomplete" : "Mark complete";

  return (
    <div className="flex flex-col gap-5">
      <span className="text-muted-foreground ps-2 text-base">{boxes.length} boxes</span>

      {boxes.length === 0 ? (
        <p className="text-muted-foreground text-sm">No boxes assigned to {room.name} yet.</p>
      ) : (
        <Card className="p-0">
          <CardContent className="p-0">
            <div className="divide-border divide-y">
              {boxes.map((box) => (
                <BoxContent
                  key={box.id}
                  box={{
                    ...box,
                    roomName: room.name,
                    roomType: room.type as CommonLocationKey,
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="text-primary"
          onClick={handleToggleCompleted}
          disabled={isUpdating || isDeleting}
        >
          {buttonText}
        </Button>
        <Button
          variant="ghost"
          className="text-destructive w-full"
          onClick={handleDeleteClick}
          disabled={isUpdating || isDeleting}
        >
          Delete this room
        </Button>
      </div>

      <DeletePrompt
        itemName={room.name}
        isOpen={isDeletePromptOpen}
        onOpenChange={setIsDeletePromptOpen}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeletePrompt}
        isDeleting={isDeleting}
      />

      <Dialog open={isCannotDeleteOpen} onOpenChange={setIsCannotDeleteOpen}>
        <DialogContent className="flex flex-col items-center gap-4">
          <IconTile
            icon={Info}
            size="md"
            backgroundColor="var(--chip-amber-bg)"
            iconColor="var(--chip-amber-text)"
          />
          <h6 className="text-foreground text-center text-xl leading-tight font-bold">
            Can&apos;t delete {room.name}
          </h6>
          <span className="text-muted-foreground text-center text-base">
            This room still has {boxes.length} {boxes.length === 1 ? "box" : "boxes"} assigned to
            it. Move or delete those boxes first.
          </span>
          <Button variant="outline" onClick={closeCannotDelete} className="w-full">
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Room;
