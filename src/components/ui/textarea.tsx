import * as React from "react";

import { cn } from "@/lib/utils";

import { inputFieldClassName } from "./input-field";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(inputFieldClassName, "min-h-[74px] resize-none", className)}
      {...props}
    />
  );
}

export { Textarea };
