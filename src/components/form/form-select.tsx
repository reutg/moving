"use client";

import type { LucideIcon } from "lucide-react";
import { type FieldValues, useController } from "react-hook-form";

import { Field, FieldDescription, FieldLabel } from "../ui/field";
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
};

const triggerIconClass = "text-muted-foreground mr-1.5 size-4 shrink-0";

const FormSelect = <T extends FieldValues>({
  name,
  label,
  description,
  options,
  placeholder,
  control,
  getOptionLabel,
}: FormSelectProps<T>) => {
  const { field } = useController({ name, control });

  const selectedOption = options.find((option) => option.key === field.value);
  const SelectedIcon = selectedOption?.icon ?? null;
  const getLabel = (key: string) =>
    getOptionLabel?.(key) ?? options.find((option) => option.key === key)?.label ?? key;

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select onValueChange={field.onChange} value={field.value || null}>
        <SelectTrigger>
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
    </Field>
  );
};

export default FormSelect;
