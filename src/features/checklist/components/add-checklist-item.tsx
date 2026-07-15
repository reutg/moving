"use client";

import { PlusIcon } from "lucide-react";

interface AddChecklistItemProps {
  onClick: () => void;
}

const AddChecklistItem: React.FC<AddChecklistItemProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-icon flex w-full items-center justify-between px-4 py-3.5"
    >
      <div className="flex items-center gap-3">
        <div className="border-checkbox-border flex size-[22px] items-center justify-center rounded-full border-[1.5px] border-dashed">
          <PlusIcon className="size-4" />
        </div>
        <span className="text-base">Add task</span>
      </div>
    </button>
  );
};

export default AddChecklistItem;
