import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type IconTileProps = {
  icon: LucideIcon;
  backgroundColor: string;
  iconColor: string;
  label?: string;
  labelColor?: string;
  className?: string;
};

const IconTile = ({
  icon: Icon,
  backgroundColor,
  iconColor,
  label,
  labelColor = iconColor,
  className,
}: IconTileProps) => {
  const iconOnly = !label;

  return (
    <div
      aria-hidden
      className={cn(
        "flex h-[50px] w-[50px] flex-none flex-col items-center justify-center rounded-[14px]",
        className,
      )}
      style={{ backgroundColor }}
    >
      <Icon
        className={cn(!iconOnly && "mb-0.5")}
        size={iconOnly ? 20 : 13}
        color={iconColor}
        strokeWidth={2}
      />
      {label ? (
        <span className="text-[17px] font-bold leading-none" style={{ color: labelColor }}>
          {label}
        </span>
      ) : null}
    </div>
  );
};

export default IconTile;
