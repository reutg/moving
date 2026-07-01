"use client";
import { Button as BaseButton, ButtonShape, ButtonSize, ButtonVariant } from "./ui/button";
import Spinner from "./ui/spinner";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  size,
  shape,
  disabled,
  loading,
  onClick,
  className,
}) => {
  return (
    <BaseButton
      variant={variant}
      size={size}
      shape={shape}
      disabled={loading || disabled}
      onClick={onClick}
      className={className}
    >
      <div className="flex items-center gap-2">
        {children}
        {loading && <Spinner data-icon="inline-start" />}
      </div>
    </BaseButton>
  );
};

export default Button;
