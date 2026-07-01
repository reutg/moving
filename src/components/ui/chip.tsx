import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ChipProps {
  label: string;
  className?: string;
  size?: "sm" | "md";
  icon?: LucideIcon;
}

const Chip: React.FC<ChipProps> = ({ label, size = "md", className, icon: Icon }) => {
  return (
    <div
      className={cn(
        "bg-chip-background text-chip-text flex w-fit items-center gap-1 rounded-full font-semibold",
        size === "sm" ? "px-[8px] py-[1px] text-xs" : "px-3 py-1.5 text-sm",
        className,
      )}
    >
      {Icon && <Icon className="size-2.5" />}
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
};

export default Chip;
