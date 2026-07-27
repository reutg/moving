"use client";

import { type FieldValues, useController } from "react-hook-form";

import { DateInput } from "../ui/date-input";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

import type { FormFieldProps } from "./types";

const FormInput = <T extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  type = "text",
  control,
  icon,
  trailing,
  size = "default",
}: FormFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const inputProps = {
    id: name,
    name,
    placeholder,
    onChange: field.onChange,
    value: field.value ?? "",
    size,
  };

  return (
    <Field data-invalid={!!error}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      {type === "date" ? (
        <DateInput {...inputProps} />
      ) : (
        <InputGroup size={size}>
          <InputGroupAddon>{icon}</InputGroupAddon>
          <InputGroupInput {...inputProps} type={type} />
          <InputGroupAddon>{trailing}</InputGroupAddon>
        </InputGroup>
      )}
      {description && (
        <FieldDescription className="text-input-placeholder text-sm font-light">
          {description}
        </FieldDescription>
      )}
      {error && <FieldError>{error.message}</FieldError>}
    </Field>
  );
};

export default FormInput;
