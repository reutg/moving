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
      className={cn("relative overflow-hidden", compact ? "rounded-md" : "rounded-lg", className)}
    >
      {children}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 right-0 z-10 overflow-hidden",
          compact ? "size-12" : "size-16",
        )}
      >
        <span
          className={cn(
            "absolute block -translate-x-1/2 -translate-y-1/2 rotate-45 bg-yellow-400 text-center font-semibold whitespace-nowrap text-yellow-950 uppercase shadow-sm",
            compact
              ? "top-[13px] left-[35px] w-16 py-0.5 text-[8px] leading-none tracking-normal"
              : "top-[18px] left-[46px] w-20 py-0.5 text-[10px] leading-none tracking-wide",
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default ComingSoonBanner;
