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
  label: string;
  value: string;
  icon?: LucideIcon | null;
};

type FormSelectProps<T extends FieldValues> = FormFieldProps<T> & {
  options: FormSelectOption[];
  placeholder?: string;
};

// Matches the dropdown items' icon styling (plain muted-foreground SVG).
// `mr-1.5` adds 6px on top of the trigger's own `gap-1.5`, giving `gap-3`
// (12px) between the icon and the label without widening the
// value-to-chevron spacing.
const triggerIconClass = "text-muted-foreground mr-1.5 size-4 shrink-0";

const FormSelect = <T extends FieldValues>({
  name,
  label,
  description,
  options,
  placeholder,
  control,
}: FormSelectProps<T>) => {
  const { field } = useController({ name, control });

  const selectedOption = options.find((option) => option.value === field.value);
  const SelectedIcon = selectedOption?.icon ?? null;

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select onValueChange={field.onChange} value={field.value || null}>
        <SelectTrigger>
          {SelectedIcon && <SelectedIcon aria-hidden className={triggerIconClass} />}
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  icon={Icon ? <Icon className="text-muted-foreground" /> : null}
                >
                  {option.label}
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
