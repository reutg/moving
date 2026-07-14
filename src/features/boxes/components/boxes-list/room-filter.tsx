"use client";

import { COMMON_LOCATIONS, type CommonLocationKey } from "@/constants";

import { Button } from "@/components/ui/button";

interface RoomFilterProps {
  selectedRoom: CommonLocationKey | null;
  handleSelectRoom: (room: CommonLocationKey | null) => void;
}

const RoomFilter: React.FC<RoomFilterProps> = ({ selectedRoom, handleSelectRoom }) => {
  const buttonVariant = (room: CommonLocationKey | null) =>
    selectedRoom === room ? "default" : "outline";

  return (
    <div className="flex w-full scrollbar-none gap-2 overflow-x-auto">
      <Button
        className="w-auto shrink-0"
        onClick={() => handleSelectRoom(null)}
        variant={buttonVariant(null)}
        shape="pill"
      >
        All rooms
      </Button>
      {(Object.entries(COMMON_LOCATIONS) as [CommonLocationKey, string][]).map(
        ([roomKey, roomLabel]) => (
          <Button
            key={roomKey}
            className="w-auto shrink-0"
            onClick={() => handleSelectRoom(roomKey)}
            variant={buttonVariant(roomKey)}
            shape="pill"
          >
            {roomLabel}
          </Button>
        ),
      )}
    </div>
  );
};

export default RoomFilter;
