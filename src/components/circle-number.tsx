import { cn } from "@/lib/utils";

interface CircleNumberProps {
  number: number;
  className?: string;
  active?: boolean;
}

const CircleNumber: React.FC<CircleNumberProps> = ({ number, className, active = false }) => {
  const activeClass = cn("bg-primary text-white", className);
  const inactiveClass = cn("bg-background text-input-placeholder", className);
  return (
    <div
      className={cn(
        "flex size-7 items-center justify-center rounded-full",
        active ? activeClass : inactiveClass,
      )}
    >
      <span className="text-sm font-bold">{number}</span>
    </div>
  );
};

export default CircleNumber;
