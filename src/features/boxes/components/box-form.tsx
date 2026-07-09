"use client";

import type { Box } from "@/lib/db/schema";

import FormButtonsSwitch from "@/components/form/form-buttons-switch";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import FormTextarea from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import PhotoUpload from "@/components/ui/photo-upload";

import { useAddBoxForm } from "../hooks/use-add-box-form";

interface BoxFormProps {
  box?: Box;
}

const BoxForm = ({ box }: BoxFormProps) => {
  const {
    onFinishedAnalyzing,
    commonLocations,
    statusOptions,
    control,
    submit,
    isSubmitting,
    submitError,
    isEdit,
  } = useAddBoxForm(box);

  return (
    <form onSubmit={submit} className="flex-content">
      {!isEdit && <PhotoUpload onFinishedAnalyzing={onFinishedAnalyzing} />}

      <div className="flex flex-col gap-4">
        <FormInput
          name="name"
          label="Name"
          placeholder="e.g. Kitchen essentials"
          control={control}
        />

        <FormTextarea
          name="description"
          label="Description"
          placeholder="Auto generated description will be shown here"
          control={control}
        />

        <FormSelect
          name="destinationRoom"
          label="Destination room"
          options={commonLocations}
          placeholder="Select destination room"
          control={control}
        />

        <FormButtonsSwitch
          name="status"
          label="Status"
          size="sm"
          options={statusOptions}
          control={control}
        />
      </div>

      {submitError && (
        <p role="alert" className="text-destructive text-sm">
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-auto">
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};

export default BoxForm;
