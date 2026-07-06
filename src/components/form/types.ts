import type { ComponentProps } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

export type InputProps = {
  value: string;
  label?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  type?: ComponentProps<"input">["type"];
};

export type FormFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: ComponentProps<"input">["type"];
};
