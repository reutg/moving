import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonVariant = NonNullable<ButtonVariants["variant"]>;
export type ButtonSize = NonNullable<ButtonVariants["size"]>;
export type ButtonShape = NonNullable<ButtonVariants["shape"]>;

const buttonVariants = cva(
  "group/button inline-flex h-13 w-full items-center justify-center rounded-2xl border border-transparent bg-clip-padding text-base font-medium whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-0 bg-primary p-[15px] font-semibold text-primary-foreground transition-colors",
        outline: "border-border bg-white",
        secondary: "bg-accent text-primary font-semibold",
        ghost:
          "text-foreground w-fit hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive: "bg-white border-destructive-border text-destructive p-[15px]",
        "destructive-filled": "bg-destructive text-white",
        list: "text-foreground text-start font-base flex items-center gap-2 justify-start",
        selected: "text-primary font-semibold h-9.5",
        unselected: "text-[#8A8A8F] font-normal h-9.5",
        icon: "size-10 bg-background text-[#9A9AA0] border border-border",
      },
      size: {
        default:
          "h-13 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-9 gap-1 rounded-lg px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-lg px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-10 [&_svg:not([class*='size-'])]:size-5",
        "icon-xs":
          "size-6 in-data-[slot=button-group]:rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8  in-data-[slot=button-group]: [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-9",
      },
      shape: {
        default: "",
        pill: "rounded-full px-3 py-2 text-sm h-fit",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  shape = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, shape }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
