"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BOX_STATUS_LABELS, type CommonLocationKey } from "@/constants";
import type { BoxStatusCounts } from "@/features/boxes/types/box-status-counts";
import type { ApiResponse } from "@/lib/api/response";
import type { Box } from "@/lib/db/schema";

import { BOX_LIST_STATUS_FILTERS, BoxListStatusFilter } from "../schemas/boxes-list-schema";
import {
  createAbortController,
  fetchBoxes,
  getBoxesFetchErrorMessage,
  isAbortError,
} from "../utils/boxes-list-api";

type UseBoxesListOptions = {
  moveId: number;
  initialBoxes?: Box[];
  initialStatusCounts?: BoxStatusCounts;
};

export const useBoxesList = ({
  moveId,
  initialBoxes,
  initialStatusCounts,
}: UseBoxesListOptions) => {
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes ?? []);
  const [statusCounts, setStatusCounts] = useState<BoxStatusCounts | null>(
    initialStatusCounts ?? null,
  );
  const [isLoading, setIsLoading] = useState(initialBoxes === undefined);
  const [selectedStatus, setSelectedStatus] = useState<BoxListStatusFilter>("all");
  const [selectedRoom, setSelectedRoom] = useState<CommonLocationKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const filteredBoxes = useMemo(() => {
    return boxes.filter((box) => {
      if (selectedStatus !== "all" && box.status !== selectedStatus) {
        return false;
      }

      if (selectedRoom && box.destinationRoom !== selectedRoom) {
        return false;
      }

      return true;
    });
  }, [boxes, selectedStatus, selectedRoom]);

  const statusOptions = useMemo(
    () =>
      BOX_LIST_STATUS_FILTERS.map((status) => {
        if (status === "all") {
          return { value: status, label: "All" };
        }

        const label = BOX_STATUS_LABELS[status];

        return {
          value: status,
          label: statusCounts ? `${label} ${statusCounts[status]}` : label,
        };
      }),
    [statusCounts],
  );

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as BoxListStatusFilter);
  };

  const handleSelectRoom = (room: CommonLocationKey | null) => {
    setSelectedRoom(room);
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
        setBoxes(await fetchBoxes("all", moveId, controller.signal));
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
  };
};
