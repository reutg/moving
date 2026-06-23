"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { ApiResponse } from "@/lib/api/response";
import type { Move } from "@/lib/db/schema";

import { MoveFormValues, MoveFormValuesSchema } from "../schemas/move-form-schema";

const defaultValues: MoveFormValues = {
  name: "",
  address: "",
  startDate: "",
  endDate: "",
};

export const useAddMoveForm = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<MoveFormValues>({
    resolver: zodResolver(MoveFormValuesSchema),
    defaultValues,
  });

  const onSubmit = async (values: MoveFormValues) => {
    setSubmitError(null);

    try {
      const response = await fetch("/api/moves", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const json: ApiResponse<Move> = await response.json();

      if (!json.ok) {
        setSubmitError(json.error.message);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : "Failed to save move.");
    }
  };

  return {
    control,
    submit: handleSubmit(onSubmit),
    isSubmitting,
    submitError,
  };
};
