"use client";

import { Printer, Save, Share2 } from "lucide-react";

import Dialog from "@/components/dialog";
import type { Box } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

import BoxLabelPreview from "./components/box-label-preview";
import useBoxLabelActions from "./hooks/use-box-label-actions";

type BoxCardPrintButtonProps = {
  box: Box;
  className?: string;
};

const BoxCardPrintButton = ({ box, className }: BoxCardPrintButtonProps) => {
  const {
    isDialogOpen,
    openDialog,
    closeDialog,
    labelContent,
    labelRef,
    handlePrintLabel,
    handleSaveLabel,
    handleShareLink,
  } = useBoxLabelActions(box);

  return (
    <>
      <button
        type="button"
        aria-label={`Print label for box ${box.number}`}
        onClick={openDialog}
        className={cn(
          "bg-muted text-muted-foreground hover:bg-border flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
          className,
        )}
      >
        <Printer className="size-4" aria-hidden />
      </button>

      <Dialog
        title="Label Preview"
        description="Preview the label for your box"
        actions={[
          {
            label: "Print label",
            icon: <Printer className="text-primary" />,
            onClick: handlePrintLabel,
            variant: "outline",
          },
          {
            label: "Save label",
            icon: <Save className="text-blue" />,
            onClick: handleSaveLabel,
            variant: "outline",
          },
          {
            label: "Share label",
            icon: <Share2 />,
            onClick: handleShareLink,
            variant: "outline",
          },
        ]}
        isOpen={isDialogOpen}
        onClose={closeDialog}
      >
        <BoxLabelPreview box={box} labelContent={labelContent} />
      </Dialog>

      <div ref={labelRef} className="print-area" aria-hidden>
        <BoxLabelPreview box={box} labelContent={labelContent} />
      </div>
    </>
  );
};

export default BoxCardPrintButton;
