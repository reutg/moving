"use client";

import { Printer, Save, Share2 } from "lucide-react";

import Dialog from "@/components/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import type { Box } from "@/lib/db/schema";

import BoxLabelPreview from "./box-label-preview";
import useBoxLabelActions from "../hooks/use-box-label-actions";

type BoxLabelActionsProps = {
  box: Box;
};

const BoxLabelActions = ({ box }: BoxLabelActionsProps) => {
  const {
    isDialogOpen,
    openDialog,
    closeDialog,
    labelContent,
    labelRef,
    toggleLabelContent,
    showError,
    linkCopied,
    handlePrintLabel,
    handleSaveLabel,
    handleShareLink,
  } = useBoxLabelActions(box);
  return (
    <>
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div>
            <h6 className="text-md font-semibold">Label & QR code</h6>
            <p className="text-muted-foreground text-sm">
              Generate and print a label and QR code for your box
            </p>
          </div>

          <p className="text-sm font-medium">Label includes:</p>
          <FieldGroup className="flex flex-col gap-2">
            <Field orientation="horizontal">
              <Checkbox
                id="boxNumber"
                name="boxNumber"
                checked={labelContent.boxNumber}
                onCheckedChange={() => toggleLabelContent("boxNumber")}
              />
              <FieldLabel className="font-normal" htmlFor="boxNumber">
                Box number
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                id="name"
                name="name"
                checked={labelContent.name}
                onCheckedChange={() => toggleLabelContent("name")}
              />
              <FieldLabel className="font-normal" htmlFor="name">
                Name
              </FieldLabel>
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                id="qrCode"
                name="qrCode"
                checked={labelContent.qrCode}
                onCheckedChange={() => toggleLabelContent("qrCode")}
              />
              <FieldLabel className="font-normal" htmlFor="qrCode">
                QR code
              </FieldLabel>
            </Field>

            {showError && (
              <FieldError errors={[{ message: "Please select at least one option" }]} />
            )}
          </FieldGroup>

          <div className="flex flex-col gap-2">
            <Button variant="default" onClick={openDialog}>
              Preview label
            </Button>
            <Button variant="outline" onClick={handleSaveLabel}>
              <Save />
              Save label
            </Button>
            <Button variant="outline" onClick={handlePrintLabel} disabled={showError}>
              <Printer />
              Print label
            </Button>
            <Button variant="outline" onClick={handleShareLink}>
              <Share2 />
              Share box link
            </Button>
            {linkCopied && (
              <p role="status" className="text-muted-foreground text-center text-xs">
                Link copied to clipboard
              </p>
            )}
          </div>
        </CardContent>
      </Card>

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

export default BoxLabelActions;
