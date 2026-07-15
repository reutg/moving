import { formatDate, getDaysUntilDate } from "@/lib/date-utils";

import { Card, CardContent } from "@/components/ui/card";
import { SectionSubheader } from "@/components/ui/text";

interface MovingInfoProps {
  moveDate: Date | null;
}

const MovingInfo: React.FC<MovingInfoProps> = ({ moveDate }) => {
  if (!moveDate) {
    return null;
  }

  const daysCount = getDaysUntilDate(moveDate);

  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <SectionSubheader>Moving day</SectionSubheader>
          <h1 className="text-2xl font-bold">{formatDate(moveDate, "MMM d")}</h1>
        </div>
        <div className="bg-primary flex size-16 flex-col items-center justify-center gap-1 rounded-2xl">
          <span className="text-2xl font-bold text-white">{daysCount}</span>
          <span className="text-xs text-white/70 uppercase">days</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovingInfo;
