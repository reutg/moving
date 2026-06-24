"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "group/switch focus-visible:ring-primary/15 data-checked:bg-primary data-unchecked:bg-switch-track-off relative inline-block h-7 w-[46px] shrink-0 rounded-full p-0 transition-colors duration-200 outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="bg-card pointer-events-none absolute top-1/2 left-[3px] block size-[22px] translate-x-0 -translate-y-1/2 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform duration-200 ease-in-out group-data-checked/switch:translate-x-[18px] data-checked:translate-x-[18px]"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
