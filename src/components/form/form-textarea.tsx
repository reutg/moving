"use client";

import { type FieldValues, useController } from "react-hook-form";

import { Field, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import type { FormFieldProps } from "./types";

const FormTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
}: FormFieldProps<T>) => {
  const { field } = useController({ name, control });

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
    </Field>
  );
};

export default FormTextarea;
