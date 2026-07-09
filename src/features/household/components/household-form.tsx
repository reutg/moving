"use client";

import { House } from "lucide-react";

import FormInput from "@/components/form/form-input";
import { Button } from "@/components/ui/button";

import useHouseholdForm from "../hooks/use-household-form";
import type { HouseholdWithMembers } from "../services/household-service";

interface HouseholdFormProps {
  household: HouseholdWithMembers | null;
}

const HouseholdForm: React.FC<HouseholdFormProps> = ({}) => {
  const { control, isSubmitting, submitError, submit } = useHouseholdForm();

  return (
    <form onSubmit={submit} className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-4">
        <FormInput
          name="name"
          label="Name"
          placeholder="e.g. Smith Family"
          control={control}
          icon={<House className="size-5" />}
          description="Something recognizable, like your street or family name."
        />

        {submitError && (
          <p role="alert" className="text-destructive text-sm">
            {submitError}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-auto">
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};

export default HouseholdForm;
