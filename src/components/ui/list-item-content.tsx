import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import IconTile from "@/components/ui/icon-tile";

const DEFAULT_BACKGROUND_COLOR = "var(--background)";
const DEFAULT_ICON_COLOR = "var(--field-label)";

type ListItemContentProps = {
  icon: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  backgroundColor?: string;
  iconColor?: string;
  className?: string;
  trailingContent?: ReactNode;
};

const Description = ({ description }: { description: ReactNode }) => {
  if (typeof description === "string" || typeof description === "number") {
    return <div className="text-muted-foreground truncate text-sm">{description}</div>;
  }

  return <div className="text-sm">{description}</div>;
};

const ListItemContent = ({
  icon,
  title,
  description,
  backgroundColor = DEFAULT_BACKGROUND_COLOR,
  iconColor = DEFAULT_ICON_COLOR,
  className,
  trailingContent,
}: ListItemContentProps) => {
  return (
    <div className={cn("flex min-w-0 flex-1 items-center gap-3.5 py-3.5", className)}>
      <IconTile icon={icon} backgroundColor={backgroundColor} iconColor={iconColor} size="sm" />

      <div className="min-w-0 flex-1">
        <div className="truncate text-base font-semibold">{title}</div>
        {description ? <Description description={description} /> : null}
      </div>

      {trailingContent ? trailingContent : null}
    </div>
  );
};

export default ListItemContent;
