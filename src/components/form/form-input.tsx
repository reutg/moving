"use client";

import { type FieldValues, useController } from "react-hook-form";

import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import type { FormFieldProps } from "./types";

const FormInput = <T extends FieldValues>({
  name,
  label,
  placeholder,
  control,
}: FormFieldProps<T>) => {
  const { field } = useController({ name, control });

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={field.onChange}
        value={field.value ?? ""}
      />
    </Field>
  );
};

export default FormInput;
