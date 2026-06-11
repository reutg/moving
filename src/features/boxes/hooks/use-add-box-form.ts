"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { BOX_STATUS_LABELS, BOX_STATUSES, COMMON_LOCATIONS, DEFAULT_BOX_STATUS } from "@/constants";
import type { ApiResponse } from "@/lib/api/response";

import { AddBoxFormValues, AddBoxFormValuesSchema } from "../schemas/add-box-form-schema";
import type { BoxPhotoAnalysis } from "../services/analyze-box-photo-service";

export const useAddBoxForm = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultValues: AddBoxFormValues = {
    name: "",
    description: "",
    destinationRoom: "",
    status: DEFAULT_BOX_STATUS,
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm<AddBoxFormValues>({
    resolver: zodResolver(AddBoxFormValuesSchema),
    defaultValues,
  });

  const onSubmit = async (values: AddBoxFormValues) => {
    console.log("onSubmit - values", values);
    setSubmitError(null);
    try {
      const response = await fetch("/api/boxes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const json: ApiResponse<unknown> = await response.json();
      if (!json.ok) {
        setSubmitError(json.error.message);
        return;
      }
      router.push("/");
      router.refresh();
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : "Failed to create box.");
    }
  };

  const submit = handleSubmit(onSubmit);
  console.log("form values", watch());
  const onFinishedAnalyzing = (analysis: BoxPhotoAnalysis) => {
    console.log("onFinishedAnalyzing - analysis", analysis);
    setValue("name", analysis.name);
    setValue("description", analysis.description);
    if (analysis.destinationRoom) {
      setValue("destinationRoom", analysis.destinationRoom);
    }
  };

  const commonLocations = Object.entries(COMMON_LOCATIONS).map(([value, label]) => ({
    value,
    label,
  }));
  const statusOptions = BOX_STATUSES.map((status) => ({
    value: status,
    label: BOX_STATUS_LABELS[status],
  }));

  return {
    control,
    submit,
    isSubmitting,
    submitError,
    onFinishedAnalyzing,
    commonLocations,
    statusOptions,
  };
};
