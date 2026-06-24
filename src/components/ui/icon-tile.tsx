import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const sizeStyles = {
  sm: { container: "size-10", icon: "size-5" },
  md: { container: "size-16", icon: "size-8" },
  lg: { container: "size-20", icon: "size-10" },
} as const;

type IconTileSize = keyof typeof sizeStyles;

type IconTileProps = {
  icon: LucideIcon;
  className?: string;
  size?: IconTileSize;
  backgroundColor?: string;
  iconColor?: string;
  label?: string;
  labelColor?: string;
};

const IconTile = ({
  icon: Icon,
  size = "md",
  backgroundColor,
  iconColor,
  label,
  labelColor = iconColor,
  className,
}: IconTileProps) => {
  if (backgroundColor !== undefined && iconColor !== undefined) {
    const iconOnly = !label;

    return (
      <div
        aria-hidden
        className={cn(
          "flex h-[50px] w-[50px] flex-none flex-col items-center justify-center rounded-xl",
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
          <span className="text-[17px] leading-none font-bold" style={{ color: labelColor }}>
            {label}
          </span>
        ) : null}
      </div>
    );
  }

  const styles = sizeStyles[size];

  return (
    <div
      className={cn(
        "bg-accent flex items-center justify-center rounded-lg",
        styles.container,
        className,
      )}
    >
      <Icon className={cn("text-primary", styles.icon)} />
    </div>
  );
};

export default IconTile;
