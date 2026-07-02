"use client";

import { Trash2 } from "lucide-react";
import IconTile from "./ui/icon-tile";
import { Dialog, DialogContent } from "./ui/dialog";
import Button from "./button";

interface DeletePromptProps {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
  deleteText?: string;
}

const DeletePrompt: React.FC<DeletePromptProps> = ({
  itemName,
  onConfirm,
  onCancel,
  isDeleting,
  isOpen,
  onOpenChange,
  children,
  deleteText,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-center gap-4">
        <IconTile
          icon={Trash2}
          size="md"
          backgroundColor="var(--destructive-border)"
          iconColor="var(--destructive)"
        />
        {children ?? (
          <>
            <h6 className="text-foreground text-center text-xl leading-tight font-bold">
              Are you sure you want to delete {itemName}?
            </h6>
            <span className="text-foreground text-lg">This action cannot be undone.</span>
          </>
        )}
        <div className="flex w-full flex-col items-center gap-2">
          <Button
            variant="destructive-filled"
            onClick={onConfirm}
            loading={isDeleting}
            className="w-full md:w-auto"
          >
            {deleteText ?? "Delete"}
          </Button>
          <Button variant="outline" onClick={onCancel} className="w-full md:w-auto">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePrompt;
