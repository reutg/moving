"use client";

import { LucideIcon } from "lucide-react";
import { ButtonGroup } from "../ui/button-group";
import { FieldDescription, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { InputProps } from "../form/types";

export type SwitchOption = {
  label: string;
  value: string;
  icon?: LucideIcon;
};

interface ButtonsSwitchProps {
  options: SwitchOption[];
  description?: string;
  handleButtonClick: (value: string) => void;
}

const ButtonsSwitch: React.FC<ButtonsSwitchProps & InputProps> = ({
  options,
  label,
  description,
  name,
  value,
  handleButtonClick,
}) => {
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  return (
    <>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

      <ButtonGroup className="relative flex w-full rounded-sm bg-zinc-200 p-0.5">
        <div
          aria-hidden
          className="absolute top-0.5 bottom-0.5 left-0.5 rounded-sm bg-white shadow-sm transition-transform duration-200 ease-in-out"
          style={{
            width: `calc((100% - 4px) / ${options.length})`,
            transform: `translateX(calc(${selectedIndex} * 100%))`,
          }}
        />
        {options.map((option) => (
          <Button
            key={option.value}
            value={option.value}
            variant={option.value === value ? "selected" : "unselected"}
            onClick={() => handleButtonClick(option.value)}
            className="relative z-10 min-w-0 flex-1 bg-transparent shadow-none hover:bg-transparent"
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
      {description && <FieldDescription className="text-xs">{description}</FieldDescription>}
    </>
  );
};

export default ButtonsSwitch;
