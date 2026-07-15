import Link from "next/link";

import type { Box } from "@/lib/db/schema";

import BoxCard from "@/features/boxes/box-card";

import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/text";

type RecentlyUpdatedProps = {
  boxes: Box[];
};

const RecentlyUpdated = ({ boxes }: RecentlyUpdatedProps) => {
  if (boxes.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <SectionHeader>Recently updated</SectionHeader>
        <Link href="/boxes" className="text-primary text-[12.5px] font-medium">
          See all
        </Link>
      </div>

      <Card className="p-0">
        <CardContent>
          <div className="divide-border divide-y">
            {boxes.map((box) => (
              <BoxCard key={box.id} box={box} />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default RecentlyUpdated;
