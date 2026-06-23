import { cn } from "@/lib/utils";

type SeparatorDotProps = {
  className?: string;
};

const SeparatorDot = ({ className }: SeparatorDotProps) => {
  return (
    <span aria-hidden className={cn("size-[3px] shrink-0 rounded-full bg-[#CFCFD3]", className)} />
  );
};

export default SeparatorDot;
