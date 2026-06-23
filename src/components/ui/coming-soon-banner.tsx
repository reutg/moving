import { cn } from "@/lib/utils";

type ComingSoonBannerProps = {
  children: React.ReactNode;
  className?: string;
  label?: string;
  compact?: boolean;
};

const ComingSoonBanner = ({
  children,
  className,
  label = "Soon",
  compact = false,
}: ComingSoonBannerProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        compact ? "rounded-md" : "rounded-lg",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-10 flex items-center justify-center rotate-45 bg-yellow-400 font-semibold whitespace-nowrap text-yellow-950 uppercase shadow-sm",
          compact
            ? "top-2.5 -right-10 flex w-36 items-center justify-center py-0.5 text-[8px] leading-none tracking-normal"
            : "top-3.5 -right-11 flex w-40 items-center justify-center py-0.5 text-[10px] leading-none tracking-wide",
        )}
      >
        {label}
      </span>
    </div>
  );
};

export default ComingSoonBanner;
