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

export const useBoxesList = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [statusCounts, setStatusCounts] = useState<BoxStatusCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
    const loadStatusCounts = async () => {
      try {
        const response = await fetch("/api/boxes/status-counts");
        const json: ApiResponse<BoxStatusCounts> = await response.json();

        if (json.ok) {
          setStatusCounts(json.data);
        }
      } catch {
        // Status counts are optional UI polish; boxes still load without them.
      }
    };

    void loadStatusCounts();
  }, []);

  useEffect(() => {
    const controller = createAbortController(abortControllerRef);

    const loadBoxes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        setBoxes(await fetchBoxes("all", controller.signal));
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
  }, []);

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
