"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import {
  BOX_STATUS_LABELS,
  BOX_STATUSES,
  DEFAULT_BOX_STATUS,
  FALLBACK_LOCATION_ICON,
  LOCATION_ICONS,
} from "@/constants";
import type { ApiResponse } from "@/lib/api/response";
import type { Room } from "@/lib/db/schema";

import type { BoxFormValues } from "../schemas/box-form-schema";
import { BoxFormValuesSchema } from "../schemas/box-form-schema";
import type { BoxPhotoAnalysis } from "../services/analyze-box-photo-service";
import type { BoxWithRoom } from "../services/box-service";

export const useAddBoxForm = (box?: BoxWithRoom) => {
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
    name: box?.name ?? "",
    description: box?.description ?? "",
    roomId: box?.roomId !== undefined ? String(box.roomId) : "",
    status: box?.status ?? DEFAULT_BOX_STATUS,
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<BoxFormValues>({
    resolver: zodResolver(BoxFormValuesSchema),
    defaultValues,
  });

  const description = useWatch({ control, name: "description" });

  const isEdit = box !== undefined;

  const onSubmit = async (values: BoxFormValues) => {
    setSubmitError(null);
    try {
      const response = await fetch(isEdit ? `/api/boxes/${box.id}` : "/api/boxes", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, roomId: Number(values.roomId) }),
      });
      const json: ApiResponse<BoxWithRoom> = await response.json();
      if (!json.ok) {
        å;
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
      const suggestedRoom = rooms.find((room) => room.type === analysis.destinationRoom);
      if (suggestedRoom) {
        setValue("roomId", String(suggestedRoom.id));
      }
    }
  };

  const roomOptions = rooms.map((room) => ({
    key: String(room.id),
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
