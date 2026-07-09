"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  BOX_STATUS_LABELS,
  BOX_STATUSES,
  COMMON_LOCATIONS,
  DEFAULT_BOX_STATUS,
  FALLBACK_LOCATION_ICON,
  LOCATION_ICONS,
} from "@/constants";
import type { CommonLocationKey } from "@/constants/common-locations";
import type { ApiResponse } from "@/lib/api/response";
import type { Box } from "@/lib/db/schema";

import type { BoxFormValues } from "../schemas/box-form-schema";
import { BoxFormValuesSchema } from "../schemas/box-form-schema";
import type { BoxPhotoAnalysis } from "../services/analyze-box-photo-service";

export const useAddBoxForm = (box?: Box) => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const isEdit = box !== undefined;

  const onSubmit = async (values: BoxFormValues) => {
    setSubmitError(null);
    try {
      const response = await fetch(isEdit ? `/api/boxes/${box.id}` : "/api/boxes", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const json: ApiResponse<unknown> = await response.json();
      if (!json.ok) {
        setSubmitError(json.error.message);
        return;
      }
      router.push(isEdit ? `/boxes/${box.id}` : "/");
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

  const commonLocations = (Object.entries(COMMON_LOCATIONS) as [CommonLocationKey, string][]).map(
    ([key, label]) => ({
      key,
      label,
      icon: LOCATION_ICONS[key] ?? FALLBACK_LOCATION_ICON,
    }),
  );

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
    commonLocations,
    statusOptions,
    isEdit,
  };
};
