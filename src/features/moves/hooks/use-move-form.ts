"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import type { ApiResponse } from "@/lib/api/response";
import type { Move } from "@/lib/db/schema";

import { MoveFormValues, MoveFormValuesSchema } from "../schemas/move-form-schema";
import { formatDate } from "@/lib/date-utils";

const defaultValues: MoveFormValues = {
  name: "",
  address: "",
  moveDate: "",
};

export const useMoveForm = (move?: Move) => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<MoveFormValues>({
    resolver: zodResolver(MoveFormValuesSchema),
    defaultValues,
  });

  useEffect(() => {
    if (move) {
      setValue("name", move.name);
      setValue("address", move.address);
      setValue("moveDate", formatDate(move.moveDate, "YYYY-MM-DD"));
    }
  }, [move]);

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

  const submit = handleSubmit(onSubmit);

  return {
    control,
    submit,
    isSubmitting,
    submitError,
  };
};
