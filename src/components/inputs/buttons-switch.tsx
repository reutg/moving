"use client";

import type { LucideIcon } from "lucide-react";

import type { InputProps } from "@/components/form/types";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldLabel } from "@/components/ui/field";

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

const ButtonsSwitch = ({
  options,
  label,
  description,
  name,
  value,
  handleButtonClick,
}: ButtonsSwitchProps & InputProps) => {
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  return (
    <>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

      <div className="bg-input-border relative flex w-full rounded-[13px] p-1">
        <div
          aria-hidden
          className="absolute top-1 bottom-1 left-1 rounded-[10px] bg-white shadow-sm transition-transform duration-200 ease-in-out"
          style={{
            width: `calc((100% - 8px) / ${options.length})`,
            transform: `translateX(calc(${selectedIndex} * 100%))`,
          }}
        />
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            value={option.value}
            variant={option.value === value ? "selected" : "unselected"}
            onClick={() => handleButtonClick(option.value)}
            className="relative z-10 h-auto min-w-0 flex-1 rounded-[10px] bg-transparent py-2.5 shadow-none hover:bg-transparent"
          >
            {option.label}
          </Button>
        ))}
      </div>
      {description && <FieldDescription className="text-xs">{description}</FieldDescription>}
    </>
  );
};

export default ButtonsSwitch;
