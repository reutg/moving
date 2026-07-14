"use client";

import { XIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { COMMON_LOCATIONS, type CommonLocationKey,ROOM_TYPES } from "@/constants";
import { FALLBACK_LOCATION_ICON, LOCATION_ICONS } from "@/constants/location-icons";

import Button from "@/components/button";
import FormInput from "@/components/form/form-input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SectionSubheader } from "@/components/ui/text";

import type { RoomTypeValues } from "../schemas/room-type-schema";

import RoomTypeCard from "./room-type-card";

interface AddRoomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

const AddRoomSheet: React.FC<AddRoomSheetProps> = ({
  open,
  onOpenChange,
  onClose,
  onSubmit,
  isSubmitting,
  submitError,
}) => {
  const { control, setValue, watch } = useFormContext<RoomTypeValues>();
  const selectedType = watch("type");

  const handleSelectRoomType = (type: CommonLocationKey, roomLabel: string) => {
    setValue("type", type);
    setValue("name", roomLabel);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent showCloseButton={false} className="gap-4">
        <SheetHeader>
          <SheetTitle>Add a room</SheetTitle>
          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-lg"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <XIcon />
          </Button>
        </SheetHeader>
        <div className="flex flex-col gap-2">
          <SectionSubheader>Room Type</SectionSubheader>
          <div className="flex flex-wrap gap-2">
            {ROOM_TYPES.map((type) => {
              const icon = LOCATION_ICONS[type] ?? FALLBACK_LOCATION_ICON;
              const roomLabel = COMMON_LOCATIONS[type];

              return (
                <RoomTypeCard
                  key={type}
                  icon={icon}
                  roomLabel={roomLabel}
                  type={type}
                  selected={selectedType === type}
                  onSelect={() => handleSelectRoomType(type, roomLabel)}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <SectionSubheader>Room name</SectionSubheader>
          <FormInput name="name" control={control} />
        </div>

        {submitError ? <p className="text-destructive text-sm">{submitError}</p> : null}

        <Button onClick={onSubmit} loading={isSubmitting}>
          Add room
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default AddRoomSheet;
