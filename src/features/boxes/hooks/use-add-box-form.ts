"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { camelCase } from "lodash";
import { useForm, useWatch } from "react-hook-form";

import {
  BOX_STATUS_LABELS,
  BOX_STATUSES,
  DEFAULT_BOX_STATUS,
  FALLBACK_LOCATION_ICON,
  LOCATION_ICONS,
} from "@/constants";
import type { ApiResponse } from "@/lib/api/response";
import type { Box, Room } from "@/lib/db/schema";

import type { BoxFormValues } from "../schemas/box-form-schema";
import { BoxFormValuesSchema } from "../schemas/box-form-schema";
import type { BoxPhotoAnalysis } from "../services/analyze-box-photo-service";

export const useAddBoxForm = (box?: Box) => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingRoomOptions, setIsLoadingRoomOptions] = useState(false);

  useEffect(() => {
    let active = true;

    const loadRooms = async () => {
      setIsLoadingRoomOptions(true);
      try {
        const response = await fetch("/api/rooms", {
          headers: { "content-type": "application/json" },
        });
        const json: ApiResponse<Room[]> = await response.json();
        if (active && json.ok) {
          setRooms(json.data);
        }
      } catch {
        setIsLoadingRoomOptions(false);
      } finally {
        setIsLoadingRoomOptions(false);
      }
    };

    loadRooms();

    return () => {
      active = false;
    };
  }, []);

  const defaultValues: BoxFormValues = {
    name: "",
    description: "",
    destinationRoom: "",
    status: DEFAULT_BOX_STATUS,
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<BoxFormValues>({
    resolver: zodResolver(BoxFormValuesSchema),
    defaultValues: box ? { ...defaultValues, ...box } : defaultValues,
  });

  const description = useWatch({ control, name: "description" });

  const isEdit = box !== undefined;

  const onSubmit = async (values: BoxFormValues) => {
    setSubmitError(null);
    try {
      const response = await fetch(isEdit ? `/api/boxes/${box.id}` : "/api/boxes", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const json: ApiResponse<Box> = await response.json();
      if (!json.ok) {
        setSubmitError(json.error.message);
        return;
      }
      router.push(`/boxes/${json.data.id}/preview`);
      router.refresh();
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : "Failed to save box.");
    }
  };

  const submit = handleSubmit(onSubmit);

  const onFinishedAnalyzing = (analysis: BoxPhotoAnalysis) => {
    setValue("name", analysis.name);
    setValue("description", analysis.description);
    if (analysis.destinationRoom) {
      setValue("destinationRoom", analysis.destinationRoom);
    }
  };

  const getRoomKey = (room: Room) => (room.type === "other" ? camelCase(room.name) : room.type);

  const roomOptions = rooms.map((room) => ({
    key: getRoomKey(room),
    label: room.name,
    icon: LOCATION_ICONS[room.type] ?? FALLBACK_LOCATION_ICON,
  }));

  const statusOptions = BOX_STATUSES.map((status) => ({
    value: status,
    label: BOX_STATUS_LABELS[status],
  }));

  return {
    control,
    submit,
    isSubmitting,
    isDirty,
    submitError,
    onFinishedAnalyzing,
    roomOptions,
    statusOptions,
    isEdit,
    description,
    isLoadingRoomOptions,
  };
};
