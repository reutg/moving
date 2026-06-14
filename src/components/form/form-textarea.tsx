"use client";

import { type FieldValues, useController } from "react-hook-form";

import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

import type { FormFieldProps } from "./types";

type FormTextareaProps<T extends FieldValues> = FormFieldProps<T> & {
  rows?: number;
};

const FormTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  description,
  placeholder,
  rows,
}: FormTextareaProps<T>) => {
  const { field } = useController({ name, control });

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
        onChange={field.onChange}
        value={field.value ?? ""}
        // When `rows` is set, drop the base `min-h-16` so the textarea can
        // honor the requested row count via `field-sizing: content`.
        className={rows ? "min-h-0" : undefined}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
};

export default FormTextarea;
