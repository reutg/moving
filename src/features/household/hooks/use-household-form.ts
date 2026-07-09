"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { HouseholdFormValues } from "../schemas/household-form-schema";
import { HouseholdFormValuesSchema } from "../schemas/household-form-schema";

const useHouseholdForm = () => {
  const router = useRouter();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<HouseholdFormValues>({
    resolver: zodResolver(HouseholdFormValuesSchema),
  });

  const onSubmit = async (values: HouseholdFormValues) => {
    try {
      const response = await fetch("/api/household", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create household");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        setSubmitError(error.message);
      }
    }
    router.refresh();
  };

  const submit = handleSubmit(onSubmit);

  return { control, isSubmitting, submitError, submit };
};

export default useHouseholdForm;
