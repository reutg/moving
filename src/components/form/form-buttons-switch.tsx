"use client";

import type { LucideIcon } from "lucide-react";
import { type FieldValues, useController } from "react-hook-form";

import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Field, FieldDescription, FieldLabel } from "../ui/field";

import type { FormFieldProps } from "./types";

type FormButtonsSwitchProps<T extends FieldValues> = FormFieldProps<T> & {
  options: { label: string; value: string; icon?: LucideIcon }[];
  size?: "default" | "sm";
};

const FormButtonsSwitch = <T extends FieldValues>({
  name,
  label,
  description,
  options,
  control,
}: FormButtonsSwitchProps<T>) => {
  const { field } = useController({ name, control });

  const handleButtonClick = (value: string) => () => {
    field.onChange(value);
  };

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <ButtonGroup>
        {options.map((option) => (
          <Button
            key={option.value}
            value={option.value}
            variant={option.value === field.value ? "soft" : "outline"}
            onClick={handleButtonClick(option.value)}
          >
            {option.icon && <option.icon />}
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
      {description && <FieldDescription className="text-xs">{description}</FieldDescription>}
    </Field>
  );
};

export default FormButtonsSwitch;
