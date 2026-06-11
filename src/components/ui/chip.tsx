import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  className?: string;
}

const Chip: React.FC<ChipProps> = ({ label, className }) => {
  return (
    <div
      className={cn("bg-primary/10 text-primary w-fit rounded-full px-2 py-1 text-sm", className)}
    >
      {label}
    </div>
  );
};

export default Chip;
