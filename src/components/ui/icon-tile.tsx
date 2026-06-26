import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const sizeStyles = {
  sm: { container: "size-10", icon: "size-5" },
  md: { container: "size-16", icon: "size-8" },
  lg: { container: "size-20", icon: "size-10" },
  logo: { container: "size-[88px]", icon: "size-[44px]" },
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
  const styles = sizeStyles[size];

  if (backgroundColor !== undefined && iconColor !== undefined) {
    const iconOnly = !label;

    return (
      <div
        aria-hidden
        className={cn(
          "flex flex-none flex-col items-center justify-center rounded-3xl",
          iconOnly ? styles.container : "h-[50px] w-[50px]",
          className,
        )}
        style={{ backgroundColor }}
      >
        <Icon
          className={cn(iconOnly ? styles.icon : "mb-0.5 size-[13px]")}
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

  return (
    <div
      className={cn(
        "bg-accent flex items-center justify-center rounded-xl",
        styles.container,
        className,
      )}
    >
      <Icon className={cn("text-primary", styles.icon)} />
    </div>
  );
};

export default IconTile;
