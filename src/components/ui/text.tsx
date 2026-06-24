"use client";

import { cn } from "@/lib/utils";

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<TextProps> = ({ children, className }) => {
  return (
    <div className={cn("text-foreground text-[13px] font-semibold", className)}>{children}</div>
  );
};

export const SectionSubheader: React.FC<TextProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "text-subtle-foreground mx-0.5 text-xs font-semibold tracking-wide uppercase",
        className,
      )}
    >
      {children}
    </div>
  );
};
