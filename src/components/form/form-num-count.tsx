"use client";

import { type FieldValues, useController } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import type { FormFieldProps } from "./types";
import { Button } from "../ui/button";
import { Minus } from "lucide-react";
import { Plus } from "lucide-react";

type FormNumCountProps<T extends FieldValues> = FormFieldProps<T> & {
  min?: number;
  max?: number;
  step?: number;
};

const FormNumCount = <T extends FieldValues>({
  name,
  label,
  description,
  control,
  min = 1,
  max,
  step = 1,
  disabled,
}: FormNumCountProps<T>) => {
  const {
    field,
    formState: { errors },
  } = useController({ name, control });

  const handleIncrement = () => {
    const nextValue = field.value + step;
    if (max && nextValue > max) {
      return;
    }
    field.onChange(nextValue);
  };

  const handleDecrement = () => {
    const nextValue = field.value - step;
    if (nextValue < min) {
      return;
    }
    field.onChange(nextValue);
  };

  return (
    <Field data-invalid={!!errors[name]} className="w-fit">
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="rounded-xl" onClick={handleDecrement}>
          <Minus />
        </Button>
        <span className="text-foreground text-sm font-medium">{field.value}</span>
        <Button variant="default" size="icon" className="rounded-xl" onClick={handleIncrement}>
          <Plus />
        </Button>
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      {errors[name] && <FieldError>{errors[name]?.message as string}</FieldError>}
    </Field>
  );
};

export default FormNumCount;
