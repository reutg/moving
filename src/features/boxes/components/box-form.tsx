"use client";

import FormButtonsSwitch from "@/components/form/form-buttons-switch";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import FormTextarea from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import PhotoUpload from "@/components/ui/photo-upload";
import type { Box } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

import { useAddBoxForm } from "../hooks/use-add-box-form";

const STATUS_HELPER_TEXT = "Packed boxes are ready for labeling and moving.";

const BoxForm = ({ box }: { box?: Box }) => {
  const {
    onFinishedAnalyzing,
    commonLocations,
    statusOptions,
    control,
    submit,
    isSubmitting,
    isDirty,
    submitError,
    isEdit,
  } = useAddBoxForm(box);

  const submitDisabled = isSubmitting || (isEdit && !isDirty);
  const submitLabel = isSubmitting
    ? isEdit
      ? "Saving…"
      : "Creating…"
    : isEdit
      ? "Save changes"
      : "Create box";

  return (
    <form onSubmit={submit}>
      {!isEdit && (
        <div className="space-y-4">
          <h6 className="text-md text-primary font-bold">Film box content</h6>
          <PhotoUpload onFinishedAnalyzing={onFinishedAnalyzing} />
        </div>
      )}

      <h6 className="text-md text-primary font-bold">Box details</h6>
      <div className="space-y-4">
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
          rows={2}
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
          description={STATUS_HELPER_TEXT}
          size="sm"
          options={statusOptions}
          control={control}
        />
      </div>

      {!isEdit && (
        <>
          {submitError && (
            <p role="alert" className="text-destructive text-sm">
              {submitError}
            </p>
          )}
          <Button type="submit" disabled={submitDisabled}>
            {submitLabel}
          </Button>
          <p className="text-center text-sm text-gray-400">You can edit details later</p>
        </>
      )}

      {isEdit && (
        <div className="bg-background/95 border-border fixed inset-x-0 bottom-0 z-30 border-t px-4 py-4 backdrop-blur">
          <div className="mx-auto max-w-[960px] space-y-2">
            {submitError && (
              <p role="alert" className="text-destructive text-sm">
                {submitError}
              </p>
            )}
            <Button type="submit" disabled={submitDisabled}>
              {submitLabel}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default BoxForm;
