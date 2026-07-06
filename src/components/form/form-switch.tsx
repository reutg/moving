"use client";

import { type FieldValues, useController } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import type { FormFieldProps } from "./types";

type FormSwitchProps<T extends FieldValues> = FormFieldProps<T>;

const FormSwitch = <T extends FieldValues>({ name, control, label }: FormSwitchProps<T>) => {
  const {
    field,
    formState: { errors },
  } = useController({ name, control });

  return (
    <Field
      data-invalid={!!errors[name]}
      orientation="horizontal"
      className={cn(!label && "w-fit")}
    >
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <Switch id={name} checked={field.value} onCheckedChange={field.onChange} />
      {errors[name] && <FieldError>{errors[name]?.message as string}</FieldError>}
    </Field>
  );
};

export default FormSwitch;
