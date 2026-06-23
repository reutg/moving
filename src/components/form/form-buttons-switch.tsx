"use client";

import { type FieldValues, useController } from "react-hook-form";
import type { FormFieldProps } from "./types";
import { Field } from "../ui/field";
import ButtonsSwitch from "../inputs/buttons-switch";
import type { SwitchOption } from "../inputs/buttons-switch";
type FormButtonsSwitchProps<T extends FieldValues> = FormFieldProps<T> & {
  options: SwitchOption[];
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

  const handleButtonClick = (value: string) => {
    field.onChange(value);
  };

  return (
    <Field>
      <ButtonsSwitch
        name={name}
        value={field.value}
        label={label}
        description={description}
        options={options}
        handleButtonClick={handleButtonClick}
      />
    </Field>
  );
};

export default FormButtonsSwitch;
