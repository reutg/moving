import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  className?: string;
}

const Chip: React.FC<ChipProps> = ({ label, className }) => {
  return (
    <div
      className={cn(
        "bg-chip-background text-chip-text w-fit rounded-full px-3 py-1.5 text-xs font-semibold",
        className,
      )}
    >
      {label}
    </div>
  );
};

export default Chip;
