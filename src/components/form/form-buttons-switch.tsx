"use client";

import { useController, type FieldValues } from "react-hook-form";

import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Field, FieldLabel } from "../ui/field";
import type { FormFieldProps } from "./types";

type FormButtonsSwitchProps<T extends FieldValues> = FormFieldProps<T> & {
  options: { label: string; value: string }[];
};

const FormButtonsSwitch = <T extends FieldValues>({
  name,
  label,
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
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
    </Field>
  );
};

export default FormButtonsSwitch;
