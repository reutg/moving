import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export const CHIP_VARIANTS = {
  default: "bg-chip-background text-chip-text",
  amber: "bg-chip-amber-bg text-chip-amber-text",
  neutral: "bg-chip-neutral-bg text-chip-neutral-text",
  destructive: "bg-destructive-border text-destructive",
} as const;

export type ChipVariant = keyof typeof CHIP_VARIANTS;

interface ChipProps {
  label: string;
  className?: string;
  size?: "sm" | "md";
  icon?: LucideIcon;
  variant?: ChipVariant;
}

const Chip: React.FC<ChipProps> = ({
  label,
  size = "md",
  className,
  icon: Icon,
  variant = "default",
}) => {
  return (
    <div
      className={cn(
        "flex w-fit items-center gap-1 rounded-full font-semibold",
        CHIP_VARIANTS[variant],
        size === "sm" ? "px-[10px] py-[3px] text-xs" : "px-3 py-1.5 text-sm",
        className,
      )}
    >
      {Icon && <Icon className="size-2.5" />}
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
};

export default Chip;
