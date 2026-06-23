import * as React from "react";

import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

import { inputFieldClassName } from "./input-field";

function Input({ className, type, ref, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        inputFieldClassName,
        "file:text-foreground file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
