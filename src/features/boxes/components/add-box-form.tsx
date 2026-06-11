"use client";

import { Card, CardContent } from "@/components/ui/card";
import PhotoUpload from "@/components/ui/photo-upload";
import FormSelect from "@/components/form/form-select";
import FormButtonsSwitch from "@/components/form/form-buttons-switch";
import { DEFAULT_BOX_STATUS } from "@/constants";
import { Button } from "@/components/ui/button";
import { useAddBoxForm } from "../boxes";
import FormInput from "@/components/form/form-input";
import FormTextarea from "@/components/form/form-textarea";

const AddBoxForm = () => {
  const {
    onFinishedAnalyzing,
    commonLocations,
    statusOptions,
    control,
    submit,
    isSubmitting,
    submitError,
  } = useAddBoxForm();

  return (
    <form onSubmit={submit}>
      <Card>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h6 className="text-md text-primary font-bold">1. Film box content</h6>
            <PhotoUpload onFinishedAnalyzing={onFinishedAnalyzing} />
          </div>

          <div className="space-y-4">
            <h6 className="text-md text-primary font-bold">2. Box details</h6>
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
              label="Location"
              options={commonLocations}
              placeholder="Select location"
              control={control}
            />
            <FormButtonsSwitch
              name="status"
              label="Status"
              options={statusOptions}
              control={control}
            />
          </div>

          {submitError && (
            <p role="alert" className="text-destructive text-sm">
              {submitError}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create box"}
          </Button>
          <p className="text-center text-sm text-gray-400">You can edit details later</p>
        </CardContent>
      </Card>
    </form>
  );
};

export default AddBoxForm;
