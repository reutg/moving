import { LayoutDashboard, ListSortDescending, SearchX, SpellCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import IconTile from "@/components/ui/icon-tile";
import { Separator } from "@/components/ui/separator";

interface NoResultsProps {
  searchValue: string;
}

const NoResults: React.FC<NoResultsProps> = ({ searchValue }) => {
  const noResultsTips = [
    {
      icon: SpellCheck,
      title: "Check the spelling.",
    },
    {
      icon: ListSortDescending,
      title: "Try a different name for the item.",
    },
    {
      icon: LayoutDashboard,
      title: "Browse by room to find it manually.",
    },
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex-container py-3">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-sm font-light">0 results for</span>
          <span className="text-sm font-semibold">&quot;{searchValue}&quot;</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <IconTile icon={SearchX} variant="outline" size="lg" iconColor="var(--icon)" />
          <span className="text-muted-foreground text-center text-base font-light">
            We couldn&apos;t find &quot;{searchValue}&quot; in your items, boxes, or rooms.
          </span>
        </div>
      </div>

      <Card className="py-4">
        <CardContent className="flex flex-col gap-2.5 p-0">
          {noResultsTips.map((tip, index) => (
            <>
              <div className="flex items-center gap-2 px-4" key={tip.title}>
                <IconTile icon={tip.icon} variant="gray" size="xs" />
                <span className="text-foreground text-sm font-light">{tip.title}</span>
              </div>
              {index !== noResultsTips.length - 1 && <Separator className="bg-border-light" />}
            </>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default NoResults;
