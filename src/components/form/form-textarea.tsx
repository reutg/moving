"use client";

import { type FieldValues, useController } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

import type { FormFieldProps } from "./types";

const FormTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  description,
  placeholder,
}: FormFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={field.onChange}
        value={field.value ?? ""}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error.message}</FieldError>}
    </Field>
  );
};

export default FormTextarea;
