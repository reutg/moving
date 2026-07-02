"use client";

import { type FieldValues, useController } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { DateInput } from "../ui/date-input";
import { Input } from "../ui/input";
import type { FormFieldProps } from "./types";

const FormInput = <T extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  type = "text",
  control,
}: FormFieldProps<T>) => {
  const {
    field,
    formState: { errors },
  } = useController({ name, control });

  const inputProps = {
    id: name,
    name,
    placeholder,
    onChange: field.onChange,
    value: field.value ?? "",
  };

  return (
    <Field data-invalid={!!errors[name]}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {type === "date" ? <DateInput {...inputProps} /> : <Input {...inputProps} type={type} />}
      {description && <FieldDescription>{description}</FieldDescription>}
      {errors[name] && <FieldError>{errors[name]?.message as string}</FieldError>}
    </Field>
  );
};

export default FormInput;
