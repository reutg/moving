"use client";

import { Box } from "@/lib/db/schema";
import BoxCard from "./box-card";
import EmptyList from "./empty-list";

interface BoxesListProps {
  boxes: Box[];
}

const BoxesList: React.FC<BoxesListProps> = ({ boxes }) => {
  return (
    <div className="flex flex-col gap-4">
      {boxes.length === 0 ? <EmptyList /> : boxes.map((box) => <BoxCard key={box.id} box={box} />)}
    </div>
  );
};

export default BoxesList;
