"use client";

import { Calendar } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Input } from "./input";

const dateInputClassName =
  "pr-11 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-11 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-datetime-edit]:text-inherit";

const DateInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  ({ className, value, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const hasValue = value !== undefined && value !== "";

    const setRefs = (element: HTMLInputElement | null) => {
      inputRef.current = element;

      if (typeof ref === "function") {
        ref(element);
        return;
      }

      if (ref) {
        ref.current = element;
      }
    };

    const openPicker = () => {
      const input = inputRef.current;
      if (!input) return;

      input.focus();
      input.showPicker?.();
    };

    return (
      <div className="relative">
        <Input
          ref={setRefs}
          type="date"
          value={value}
          className={cn(
            dateInputClassName,
            hasValue ? "text-input-text" : "text-input-placeholder",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={openPicker}
          className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
          aria-label="Open calendar"
        >
          <Calendar className="size-4" aria-hidden />
        </button>
      </div>
    );
  },
);

DateInput.displayName = "DateInput";

export { DateInput };
