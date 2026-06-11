"use client";

import { Field, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { type FieldValues, useController } from "react-hook-form";

import type { FormFieldProps } from "./types";

type FormSelectProps<T extends FieldValues> = FormFieldProps<T> & {
  options: { label: string; value: string }[];
  placeholder?: string;
};

const FormSelect = <T extends FieldValues>({
  name,
  label,
  options,
  placeholder,
  control,
}: FormSelectProps<T>) => {
  const { field } = useController({ name, control });

  const getOptionLabel = (value: string) =>
    options.find((option) => option.value === value)?.label ?? "";

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select onValueChange={field.onChange} value={getOptionLabel(field.value)}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
};

export default FormSelect;
