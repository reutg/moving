"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DONE_MOVE_STATUS, DEFAULT_MOVE_STATUS } from "@/constants";
import type { MoveWithBoxesCount } from "@/features/moves/services/move-service";
import type { ApiResponse } from "@/lib/api/response";
import type { Move } from "@/lib/db/schema";
import { formatDate } from "@/lib/date-utils";

type UseMovesPageOptions = {
  currentMoveId?: number | null;
  initialOtherMoves?: Move[];
};

type UseMovesPageResult = {
  otherMoves: Move[];
  selectedMove: Move | null;
  pendingCurrentMoveId: number | null;
  isReActivating: boolean;
  isMarkingComplete: boolean;
  isDeletingMove: boolean;
  isDeleteMovePromptOpen: boolean;
  openDeleteMovePrompt: () => void;
  closeDeleteMovePrompt: () => void;
  getMoveDate: (move?: Move | null) => string;
  openActionsSheet: (move: Move) => void;
  closeActionsSheet: () => void;
  setCurrentMove: (move: Move) => Promise<void>;
  handleReActivateMove: () => Promise<void>;
  handleMarkComplete: (move: Move | null) => Promise<void>;
  confirmDeleteMove: () => Promise<void>;
};

export const useMovesPage = ({
  currentMoveId = null,
  initialOtherMoves,
}: UseMovesPageOptions = {}): UseMovesPageResult => {
  const router = useRouter();
  const otherMoves = initialOtherMoves ?? [];
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [pendingCurrentMoveId, setPendingCurrentMoveId] = useState<number | null>(null);
  const [isReActivating, setIsReActivating] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isDeletingMove, setIsDeletingMove] = useState(false);
  const [isDeleteMovePromptOpen, setIsDeleteMovePromptOpen] = useState(false);

  const openDeleteMovePrompt = () => {
    setIsDeleteMovePromptOpen(true);
  };

  const closeDeleteMovePrompt = () => {
    setIsDeleteMovePromptOpen(false);
    setIsDeletingMove(false);
  };

  const openActionsSheet = (move: Move) => {
    setSelectedMove(move);
  };

  const closeActionsSheet = () => {
    setSelectedMove(null);
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

  const setCurrentMove = async (move: Move) => {
    if (move.id === currentMoveId || pendingCurrentMoveId !== null) {
      return;
    }

    setPendingCurrentMoveId(move.id);

    try {
      const response = await fetch("/api/user/current-move", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ moveId: move.id }),
      });
      const json: ApiResponse<MoveWithBoxesCount> = await response.json();

      if (!json.ok) {
        throw new Error(json.error.message);
      }

      router.refresh();
    } finally {
      setPendingCurrentMoveId(null);
    }
  };

  const handleReActivateMove = async () => {
    if (!selectedMove || isReActivating) {
      return;
    }

    setIsReActivating(true);

    try {
      await updateMoveStatus(selectedMove, DEFAULT_MOVE_STATUS);
      closeActionsSheet();
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
      closeActionsSheet();
      router.refresh();
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const confirmDeleteMove = async () => {
    if (!selectedMove || isDeletingMove) {
      return;
    }

    setIsDeletingMove(true);

    try {
      const response = await fetch(`/api/moves/${selectedMove.id}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: selectedMove.id }),
      });
      const json: ApiResponse<void> = await response.json();

      if (!json.ok) {
        throw new Error(json.error.message);
      }

      closeActionsSheet();
      setIsDeleteMovePromptOpen(false);
      router.refresh();
    } finally {
      setIsDeletingMove(false);
    }
  };

  return {
    otherMoves,
    selectedMove,
    pendingCurrentMoveId,
    isReActivating,
    isMarkingComplete,
    isDeletingMove,
    isDeleteMovePromptOpen,
    getMoveDate,
    openActionsSheet,
    closeActionsSheet,
    setCurrentMove,
    handleReActivateMove,
    handleMarkComplete,
    confirmDeleteMove,
    openDeleteMovePrompt,
    closeDeleteMovePrompt,
  };
};
