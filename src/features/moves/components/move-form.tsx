"use client";

import FormInput from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { useMoveForm } from "../hooks/use-move-form";
import { Move } from "@/lib/db/schema";

interface MoveFormProps {
  move?: Move;
}

const MoveForm: React.FC<MoveFormProps> = ({ move }) => {
  const { control, submit, isSubmitting, submitError } = useMoveForm(move);
  const saveButtonText = move ? "Save move" : "Create move";

  return (
    <form onSubmit={submit} className="flex-content">
      <FormInput
        name="name"
        label="Move name"
        placeholder="e.g. Maple Street move"
        control={control}
      />

      <FormInput
        name="address"
        label="Address"
        placeholder="e.g. 123 Main St, City"
        control={control}
      />

      <FormInput name="moveDate" label="Move date" type="date" control={control} />

      {submitError && (
        <p role="alert" className="text-destructive text-sm">
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-auto">
        {isSubmitting ? "Saving..." : saveButtonText}
      </Button>
    </form>
  );
};

export default MoveForm;
