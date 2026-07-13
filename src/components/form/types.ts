import type { ComponentProps } from "react";

import type { Control, FieldPath, FieldValues } from "react-hook-form";

import type { InputFieldSize } from "@/components/ui/input-field";

export type InputProps = {
  value: string;
  label?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  type?: ComponentProps<"input">["type"];
  icon?: React.ReactNode;
};

export type FormFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: ComponentProps<"input">["type"];
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  size?: InputFieldSize;
};
