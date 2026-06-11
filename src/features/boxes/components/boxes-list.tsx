"use client";

import { Box } from "@/lib/db/schema";
import BoxCard from "./box-card";

interface BoxesListProps {
  boxes: Box[];
}

const BoxesList: React.FC<BoxesListProps> = ({ boxes }) => {
  return (
    <div className="flex flex-col gap-4">
      {boxes.map((box) => (
        <BoxCard key={box.id} box={box} />
      ))}
    </div>
  );
};

export default BoxesList;
