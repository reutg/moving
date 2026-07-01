import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const sizeStyles = {
  sm: { container: "size-11 rounded-xl", icon: "size-5" },
  md: { container: "size-16 rounded-2xl", icon: "size-8" },
  lg: { container: "size-20", icon: "size-10" },
  logo: { container: "size-[88px]", icon: "size-[44px]" },
  xl: { container: "size-26 rounded-3xl", icon: "size-13" },
} as const;

const variantStyles = {
  default: {
    container: "bg-accent",
    icon: "text-primary",
  },
  outline: {
    container: "border-border bg-white border",
    icon: "text-foreground",
  },
} as const;

type IconTileSize = keyof typeof sizeStyles;
type IconTileVariant = keyof typeof variantStyles;

type IconTileProps = {
  icon: LucideIcon;
  className?: string;
  iconSize?: string;
  size?: IconTileSize;
  variant?: IconTileVariant;
  backgroundColor?: string;
  iconColor?: string;
  label?: string;
  labelColor?: string;
};

const IconTile = ({
  icon: Icon,
  iconSize,
  size = "md",
  variant = "default",
  backgroundColor,
  iconColor,
  label,
  labelColor = iconColor,
  className,
}: IconTileProps) => {
  const styles = sizeStyles[size];
  const variantStyle = variantStyles[variant];

  if (backgroundColor !== undefined && iconColor !== undefined) {
    const iconOnly = !label;
    const iconClassName = iconSize ?? (iconOnly ? styles.icon : "size-[13px]");

    return (
      <div
        aria-hidden
        className={cn(
          "flex flex-none flex-col items-center justify-center rounded-3xl",
          variant === "outline" && variantStyle.container,
          iconOnly ? styles.container : "h-[50px] w-[50px]",
          className,
        )}
        style={{ backgroundColor }}
      >
        <Icon
          className={cn(iconOnly ? iconClassName : cn("mb-0.5", iconClassName))}
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

  const iconClassName = iconSize ?? styles.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-3xl",
        variantStyle.container,
        styles.container,
        className,
      )}
    >
      <Icon className={cn(variantStyle.icon, iconClassName)} />
    </div>
  );
};

export default IconTile;
