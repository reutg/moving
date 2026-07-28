"use client";

import { useState } from "react";

import { Loader2, type LucideIcon } from "lucide-react";
import { type FieldValues, useController } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import type { FormFieldProps } from "./types";

type FormSelectOption = {
  key: string;
  label?: string;
  icon?: LucideIcon | null;
};

type FormSelectProps<T extends FieldValues> = FormFieldProps<T> & {
  options: FormSelectOption[];
  placeholder?: string;
  getOptionLabel?: (key: string) => string;
  isLoading?: boolean;
};

const triggerIconClass = "text-muted-foreground mr-1.5 size-4 shrink-0";

const loaderIcon = (
  <Loader2 aria-hidden className="text-muted-foreground pointer-events-none size-4 animate-spin" />
);

const FormSelect = <T extends FieldValues>({
  name,
  label,
  description,
  options,
  placeholder,
  control,
  isLoading,
  getOptionLabel,
}: FormSelectProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });
  const [open, setOpen] = useState(false);

  const SelectedIcon = options.find((option) => option.key === field.value)?.icon;
  const getLabel = (key: string) =>
    getOptionLabel?.(key) ?? options.find((option) => option.key === key)?.label ?? key;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isLoading) return;
    setOpen(nextOpen);
  };

  return (
    <Field data-invalid={!!error}>
      <FieldLabel>{label}</FieldLabel>
      <Select
        onValueChange={field.onChange}
        value={field.value || null}
        open={open}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger icon={isLoading ? loaderIcon : undefined}>
          {SelectedIcon && <SelectedIcon aria-hidden className={triggerIconClass} />}
          <SelectValue placeholder={placeholder}>
            {field.value ? getLabel(field.value) : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem
                  key={option.key}
                  value={option.key}
                  icon={Icon ? <Icon className="text-muted-foreground" /> : null}
                >
                  {getLabel(option.key)}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error.message}</FieldError>}
    </Field>
  );
};

export default FormSelect;
