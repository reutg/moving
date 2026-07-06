"use client";

import { FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";
import type { Box } from "@/lib/db/schema";

import useBoxLabelActions from "../../hooks/use-box-label-actions";
import LabelConfig from "./label-config";
import LabelPreview from "./label-preview";
import LabelPrintArea from "./label-print-area";

type LabelContainerProps = {
  box: Box;
};

const LabelContainer = ({ box }: LabelContainerProps) => {
  const { form, labelRef, showError, handlePrintLabel, handleSaveLabel } = useBoxLabelActions(box);

  return (
    <div className="flex flex-col gap-6">
      <FormProvider {...form}>
        <div className="flex flex-col gap-4">
          <LabelPreview box={box} />
          <LabelConfig />
          <LabelPrintArea box={box} labelRef={labelRef} />
        </div>
      </FormProvider>

      <div className="flex flex-col gap-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <Button variant="default" onClick={handlePrintLabel} disabled={showError}>
          Print Label
        </Button>
        <Button variant="outline" onClick={() => void handleSaveLabel()} disabled={showError}>
          Download Label
        </Button>
      </div>
    </div>
  );
};

export default LabelContainer;
