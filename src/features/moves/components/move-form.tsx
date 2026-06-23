"use client";

import FormInput from "@/components/form/form-input";
import { Button } from "@/components/ui/button";

import { useAddMoveForm } from "../hooks/use-add-move-form";

const MoveForm = () => {
  const { control, submit, isSubmitting, submitError } = useAddMoveForm();

  return (
    <form onSubmit={submit} className="flex-content">
      <span className="text-muted-foreground text-md font-thin">
        Give your move a name and a date. You can add boxes and rooms right after.
      </span>
      <div className="flex-content">
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

        <FormInput name="startDate" label="Start date" type="date" control={control} />

        <FormInput name="endDate" label="End date" type="date" control={control} />
      </div>

      {submitError && (
        <p role="alert" className="text-destructive text-sm">
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create move"}
      </Button>
    </form>
  );
};

export default MoveForm;
