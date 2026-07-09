import type { ComponentProps } from "react";

import Link from "next/link";

import type { VariantProps } from "class-variance-authority";

import type { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";

type ButtonLinkProps = ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

const ButtonLink = ({
  className,
  variant = "default",
  size = "default",
  shape = "default",
  href,
  children,
  ...linkProps
}: ButtonLinkProps) => {
  return (
    <Button
      nativeButton={false}
      variant={variant}
      size={size}
      shape={shape}
      className={className}
      render={<Link href={href} {...linkProps} />}
    >
      {children}
    </Button>
  );
};

export { ButtonLink };
