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
  settingMoveId: number | null;
  isReActivating: boolean;
  isMarkingComplete: boolean;
  isDeleting: boolean;
  isOpen: boolean;
  openDelete: () => void;
  closeDelete: () => void;
  getMoveDate: (move?: Move | null) => string;
  selectMove: (move: Move | null) => void;
  setCurrentMove: (move: Move) => Promise<void>;
  handleReActivateMove: () => Promise<void>;
  handleMarkComplete: (move: Move | null) => Promise<void>;
  handleDeleteMove: () => Promise<void>;
};

export const useMovesPage = ({
  currentMoveId = null,
  initialOtherMoves,
}: UseMovesPageOptions = {}): UseMovesPageResult => {
  const router = useRouter();
  const otherMoves = initialOtherMoves ?? [];
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [settingMoveId, setSettingMoveId] = useState<number | null>(null);
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

  const setCurrentMove = async (move: Move) => {
    if (move.id === currentMoveId || settingMoveId !== null) {
      return;
    }

    setSettingMoveId(move.id);

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
      setSettingMoveId(null);
    }
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
      setIsOpen(false);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    otherMoves,
    selectedMove,
    settingMoveId,
    isReActivating,
    isMarkingComplete,
    isDeleting,
    isOpen,
    getMoveDate,
    selectMove,
    setCurrentMove,
    handleReActivateMove,
    handleMarkComplete,
    handleDeleteMove,
    openDelete,
    closeDelete,
  };
};
