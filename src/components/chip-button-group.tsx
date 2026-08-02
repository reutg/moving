"use client";

import Button from "./button";
import type { ButtonVariant } from "./ui/button";

type ChipButtonGroupOption = {
  value: string | null;
  label: string;
};

interface ChipButtonGroupProps {
  options: ChipButtonGroupOption[];
  selectedValue: string | null;
  showColorDot?: boolean;
  selectedVariant?: ButtonVariant;
  onSelect: (value: string | null) => void;
}

const ChipButtonGroup: React.FC<ChipButtonGroupProps> = ({
  options,
  selectedValue,
  showColorDot = false,
  selectedVariant = "selectedChip",
  onSelect,
}) => {
  const buttonVariant = (value: string | null) =>
    selectedValue === value ? selectedVariant : "outline";

  return (
    <div className="flex w-full scrollbar-none gap-2 overflow-x-auto">
      {options.map((option, index) => (
        <Button
          key={option.value}
          className="w-auto shrink-0 leading-normal"
          onClick={() => onSelect(index === 0 ? null : option.value)}
          variant={buttonVariant(index === 0 ? null : option.value)}
          shape="pill"
        >
          {showColorDot && index !== 0 && (
            <div
              className="size-2.5 rounded-full"
              style={{ backgroundColor: `var(--room-${option.value})` }}
            />
          )}
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default ChipButtonGroup;
