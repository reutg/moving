"use client";

import { useState } from "react";

import { toast } from "sonner";

import type { BoxStatus } from "@/constants";
import type { ApiResponse } from "@/lib/api/response";

import type { BoxWithRoom } from "@/features/boxes/services/box-service";

type UseBoxStatusToggleOptions = {
  boxId: number;
  initialStatus: BoxStatus;
  onStatusChange?: (boxId: number, status: BoxStatus) => void;
};

const getToggledStatus = (status: BoxStatus): BoxStatus =>
  status === "packed" ? "packing" : "packed";

export const useBoxStatusToggle = ({
  boxId,
  initialStatus,
  onStatusChange,
}: UseBoxStatusToggleOptions) => {
  const [status, setStatus] = useState<BoxStatus>(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusToggle = async () => {
    if (isUpdating) {
      return;
    }

    const previousStatus = status;
    const nextStatus = getToggledStatus(status);

    setIsUpdating(true);
    setStatus(nextStatus);
    onStatusChange?.(boxId, nextStatus);

    try {
      const response = await fetch(`/api/boxes/${boxId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json: ApiResponse<BoxWithRoom> = await response.json();

      if (!json.ok) {
        throw new Error(json.error.message);
      }

      const confirmedStatus = json.data.status as BoxStatus;
      setStatus(confirmedStatus);
      onStatusChange?.(boxId, confirmedStatus);
    } catch (error) {
      setStatus(previousStatus);
      onStatusChange?.(boxId, previousStatus);
      toast.error(error instanceof Error ? error.message : "Failed to update box status");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    status,
    isUpdating,
    handleStatusToggle,
  };
};
