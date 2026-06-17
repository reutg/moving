"use client";

import Link from "next/link";
import Image from "next/image";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface EmptyListProps {}

const EmptyList: React.FC<EmptyListProps> = ({}) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Image src="/empty.png" alt="No boxes yet" width={160} height={160} />
        </EmptyMedia>
        <EmptyTitle>No boxes yet</EmptyTitle>
        <EmptyDescription>
          Start tracking your move by adding the first box you&apos;ve packed.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Link
          href="/boxes/new"
          className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          Add your first box
        </Link>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyList;
