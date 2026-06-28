import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
  label?: string;
};

const Spinner = ({ className, label }: SpinnerProps) => {
  return (
    <div
      role="status"
      aria-label={label ?? "Loading"}
      className={cn("flex flex-1 flex-col items-center justify-center gap-3 py-12", className)}
    >
      <Loader2 className="text-primary size-8 animate-spin" aria-hidden />
      {label ? <p className="text-muted-foreground text-sm">{label}</p> : null}
    </div>
  );
};

export default Spinner;
