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
