"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { ApiResponse } from "@/lib/api/response";
import type { Room } from "@/lib/db/schema";

type UseRoomOptions = {
  room: Room;
  boxesCount: number;
};

const useRoom = ({ room: initialRoom, boxesCount }: UseRoomOptions) => {
  const router = useRouter();
  const [room, setRoom] = useState(initialRoom);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletePromptOpen, setIsDeletePromptOpen] = useState(false);
  const [isCannotDeleteOpen, setIsCannotDeleteOpen] = useState(false);

  const canDelete = boxesCount === 0;

  const handleToggleCompleted = async () => {
    if (isUpdating || isDeleting) return;

    const nextCompleted = !room.completed;
    const previous = room;

    setIsUpdating(true);
    setRoom({ ...room, completed: nextCompleted });

    try {
      const response = await fetch(`/api/rooms/${room.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: nextCompleted }),
      });
      const json: ApiResponse<Room> = await response.json();

      if (!json.ok) {
        throw new Error(json.error.message);
      }

      setRoom(json.data);
      router.refresh();
    } catch (error) {
      setRoom(previous);
      toast.error(error instanceof Error ? error.message : "Failed to update room");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    if (isUpdating || isDeleting) return;

    if (!canDelete) {
      setIsCannotDeleteOpen(true);
      return;
    }

    setIsDeletePromptOpen(true);
  };

  const closeDeletePrompt = () => {
    if (isDeleting) return;
    setIsDeletePromptOpen(false);
  };

  const closeCannotDelete = () => {
    setIsCannotDeleteOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (isUpdating || isDeleting || !canDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/rooms/${room.id}`, { method: "DELETE" });
      const json: ApiResponse<{ id: number }> = await response.json();

      if (!json.ok) {
        throw new Error(json.error.message);
      }

      setIsDeletePromptOpen(false);
      router.push("/rooms");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete room");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    room,
    canDelete,
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
  };
};

export default useRoom;
