import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type IconLinkProps = Omit<ComponentProps<typeof Link>, "children"> & {
  icon: LucideIcon;
  "aria-label": string;
};

const IconLink = ({ icon: Icon, className, ...linkProps }: IconLinkProps) => {
  return (
    <Link
      className={cn(
        "bg-card border-border text-foreground flex size-10 items-center justify-center rounded-xl border",
        className,
      )}
      {...linkProps}
    >
      <Icon className="size-5" aria-hidden />
    </Link>
  );
};

export { IconLink };
