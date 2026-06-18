"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Sheet, SheetTitle, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { COMMON_LOCATIONS } from "@/constants";

interface FilterBoxesProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterBoxes: React.FC<FilterBoxesProps> = ({ isOpen, onClose }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Filter boxes</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 p-3">
          <FieldGroup className="flex flex-col gap-2">
            <Label>Status</Label>
            <Field orientation="horizontal">
              <Checkbox id="packed" name="packed" checked={false} onCheckedChange={() => {}} />
              <FieldLabel className="font-normal" htmlFor="packed">
                Packed
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="unpacked" name="unpacked" checked={false} onCheckedChange={() => {}} />
              <FieldLabel className="font-normal" htmlFor="unpacked">
                Unpacked
              </FieldLabel>
            </Field>
          </FieldGroup>

          <FieldGroup className="flex flex-col gap-2">
            <Label>Room</Label>
            {Object.values(COMMON_LOCATIONS).map((location) => (
              <Field orientation="horizontal">
                <Checkbox
                  id={location}
                  name={location}
                  checked={false}
                  onCheckedChange={() => {}}
                />
                <FieldLabel className="font-normal" htmlFor={location}>
                  {location}
                </FieldLabel>
              </Field>
            ))}
          </FieldGroup>

          <Button>Apply filters</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterBoxes;
