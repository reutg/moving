import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  className?: string;
  size?: "sm" | "md";
}

const Chip: React.FC<ChipProps> = ({ label, size = "md", className }) => {
  return (
    <div
      className={cn(
        "bg-chip-background text-chip-text w-fit rounded-full px-3 py-1.5 text-xs font-semibold",
        size === "sm" ? "text-xs" : "text-sm",
        className,
      )}
    >
      {label}
    </div>
  );
};

export default Chip;
