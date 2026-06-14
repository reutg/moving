"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog as DialogPrimitive,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface DialogAction {
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "soft" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  onClick: () => void;
  disabled?: boolean;
}

interface DialogProps {
  children?: React.ReactNode;
  title: string;
  description: string;
  actions: DialogAction[];
  isOpen: boolean;
  onClose: () => void;
}

const Dialog: React.FC<DialogProps> = ({
  children,
  title,
  description,
  actions,
  isOpen,
  onClose,
}) => {
  return (
    <DialogPrimitive open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <div className="flex gap-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              onClick={action.onClick}
              variant={action.variant}
              disabled={action.disabled}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </DialogPrimitive>
  );
};

export default Dialog;
