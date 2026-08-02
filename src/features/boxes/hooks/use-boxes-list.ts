"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  BOX_STATUS_LABELS,
  BOX_STATUSES,
  type BoxStatus,
  type CommonLocationKey,
} from "@/constants";
import type { ApiResponse } from "@/lib/api/response";

import type { BoxWithRoom } from "@/features/boxes/services/box-service";
import type { BoxStatusCounts } from "@/features/boxes/types/box-status-counts";

import {
  createAbortController,
  fetchBoxes,
  getBoxesFetchErrorMessage,
  isAbortError,
} from "../utils/boxes-list-api";

type UseBoxesListOptions = {
  moveId: number;
  initialBoxes?: BoxWithRoom[];
  initialStatusCounts?: BoxStatusCounts;
};

export const useBoxesList = ({
  moveId,
  initialBoxes,
  initialStatusCounts,
}: UseBoxesListOptions) => {
  const [boxes, setBoxes] = useState<BoxWithRoom[]>(initialBoxes ?? []);
  const [statusCounts, setStatusCounts] = useState<BoxStatusCounts | null>(
    initialStatusCounts ?? null,
  );
  const [isLoading, setIsLoading] = useState(initialBoxes === undefined);
  const [selectedStatus, setSelectedStatus] = useState<BoxStatus | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<CommonLocationKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const filteredBoxes = useMemo(() => {
    return boxes.filter((box) => {
      if (selectedStatus && box.status !== selectedStatus) {
        return false;
      }

      if (selectedRoom && box.roomType !== selectedRoom) {
        return false;
      }

      return true;
    });
  }, [boxes, selectedStatus, selectedRoom]);

  const statusOptions = useMemo(
    () =>
      BOX_STATUSES.map((status) => {
        const label = BOX_STATUS_LABELS[status];

        return {
          value: status,
          label: statusCounts ? `${label} ${statusCounts[status]}` : label,
        };
      }),
    [statusCounts],
  );

  const handleStatusChange = (value: string | null) => {
    setSelectedStatus(value as BoxStatus | null);
  };

  const handleSelectRoom = (room: string | null) => {
    setSelectedRoom(room as CommonLocationKey | null);
  };

  const handleBoxStatusChange = (boxId: number, nextStatus: BoxStatus) => {
    const current = boxes.find((box) => box.id === boxId);
    if (!current || current.status === nextStatus) {
      return;
    }

    const previousStatus = current.status as BoxStatus;

    setBoxes((previousBoxes) =>
      previousBoxes.map((box) => (box.id === boxId ? { ...box, status: nextStatus } : box)),
    );

    setStatusCounts((previousCounts) => {
      if (!previousCounts) {
        return previousCounts;
      }

      return {
        ...previousCounts,
        [previousStatus]: previousCounts[previousStatus] - 1,
        [nextStatus]: previousCounts[nextStatus] + 1,
      };
    });
  };

  useEffect(() => {
    if (initialStatusCounts) {
      return;
    }

    const loadStatusCounts = async () => {
      try {
        const response = await fetch(`/api/boxes/status-counts?moveId=${moveId}`);
        const json: ApiResponse<BoxStatusCounts> = await response.json();

        if (json.ok) {
          setStatusCounts(json.data);
        }
      } catch {
        // Status counts are optional UI polish; boxes still load without them.
      }
    };

    void loadStatusCounts();
  }, [initialStatusCounts, moveId]);

  useEffect(() => {
    if (initialBoxes) {
      return;
    }

    const controller = createAbortController(abortControllerRef);

    const loadBoxes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        setBoxes(await fetchBoxes(null, moveId, controller.signal));
      } catch (cause) {
        if (isAbortError(cause)) {
          return;
        }

        setError(getBoxesFetchErrorMessage(cause));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadBoxes();

    return () => {
      controller.abort();
    };
  }, [initialBoxes, moveId]);

  return {
    filteredBoxes,
    statusCounts,
    isLoading,
    error,
    selectedStatus,
    statusOptions,
    handleStatusChange,
    selectedRoom,
    handleSelectRoom,
    handleBoxStatusChange,
  };
};
