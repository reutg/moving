"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DONE_MOVE_STATUS, DEFAULT_MOVE_STATUS } from "@/constants";
import type { ApiResponse } from "@/lib/api/response";
import type { Move } from "@/lib/db/schema";
import { formatDate } from "@/lib/date-utils";

type UseMovesPageOptions = {
  initialPastMoves?: Move[];
};

type UseMovesPageResult = {
  pastMoves: Move[];
  selectedMove: Move | null;
  isReActivating: boolean;
  isMarkingComplete: boolean;
  isDeleting: boolean;
  isOpen: boolean;
  openDelete: () => void;
  closeDelete: () => void;
  getMoveDate: (move?: Move | null) => string;
  selectMove: (move: Move | null) => void;
  handleReActivateMove: () => Promise<void>;
  handleMarkComplete: (move: Move | null) => Promise<void>;
  handleDeleteMove: () => Promise<void>;
};

export const useMovesPage = ({
  initialPastMoves,
}: UseMovesPageOptions = {}): UseMovesPageResult => {
  const router = useRouter();
  const pastMoves = initialPastMoves ?? [];
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [isReActivating, setIsReActivating] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openDelete = () => {
    setIsOpen(true);
  };

  const closeDelete = () => {
    setIsOpen(false);
    setIsDeleting(false);
  };

  const selectMove = (move: Move | null) => {
    setSelectedMove(move);
  };

  const getMoveDate = (move?: Move | null) => {
    return move?.moveDate ? formatDate(move.moveDate, "MMM D, YYYY") : "";
  };

  const updateMoveStatus = async (
    move: Move,
    status: typeof DEFAULT_MOVE_STATUS | typeof DONE_MOVE_STATUS,
  ) => {
    const response = await fetch(`/api/moves/${move.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json: ApiResponse<Move> = await response.json();

    if (!json.ok) {
      throw new Error(json.error.message);
    }

    return json.data;
  };

  const handleReActivateMove = async () => {
    if (!selectedMove || isReActivating) {
      return;
    }

    setIsReActivating(true);

    try {
      await updateMoveStatus(selectedMove, DEFAULT_MOVE_STATUS);
      setSelectedMove(null);
      router.refresh();
    } finally {
      setIsReActivating(false);
    }
  };

  const handleMarkComplete = async (move: Move | null) => {
    if (!move || isMarkingComplete) {
      return;
    }

    setIsMarkingComplete(true);

    try {
      await updateMoveStatus(move, DONE_MOVE_STATUS);
      setSelectedMove(null);
      router.refresh();
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const handleDeleteMove = async () => {
    if (!selectedMove || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/moves/${selectedMove.id}`, { method: "DELETE" });
      const json: ApiResponse<{ id: number }> = await response.json();

      if (!json.ok) {
        return;
      }

      setSelectedMove(null);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return {
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
  };
};
