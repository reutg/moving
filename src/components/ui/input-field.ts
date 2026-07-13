export type InputFieldSize = "sm" | "default" | "lg";

export const inputFieldSizeClassName: Record<InputFieldSize, string> = {
  sm: "h-10",
  default: "h-12",
  lg: "h-14",
};

export const inputFieldClassName =
  "w-full min-w-0 rounded-2xl border border-input-border bg-white px-3.5 text-base leading-none text-input-text transition-colors placeholder:text-input-placeholder focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15 focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20";

export const inputGroupClassName =
  "flex w-full min-w-0 items-center gap-2.5 rounded-2xl border border-input-border bg-white px-3.5 text-base leading-none transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 focus-within:outline-none has-[[data-slot=input-group-control]:disabled]:pointer-events-none has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:opacity-50 has-[[data-slot=input-group-control][aria-invalid=true]]:border-destructive has-[[data-slot=input-group-control][aria-invalid=true]]:ring-2 has-[[data-slot=input-group-control][aria-invalid=true]]:ring-destructive/20";

export const inputGroupControlClassName =
  "h-full min-h-0 min-w-0 flex-1 border-0 bg-transparent px-0 text-base leading-none text-input-text shadow-none ring-0 placeholder:text-input-placeholder focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-none disabled:bg-transparent aria-invalid:border-transparent aria-invalid:ring-0";
