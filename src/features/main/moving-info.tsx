import { Box } from "lucide-react";

import { formatDate, getDaysUntilDate } from "@/lib/date-utils";

import { Card, CardContent } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
import { SectionSubheader } from "@/components/ui/text";

interface MovingInfoProps {
  moveDate: Date | null;
  boxesCount: number;
}

const MovingInfo: React.FC<MovingInfoProps> = ({ moveDate, boxesCount }) => {
  if (!moveDate) {
    return null;
  }

  const daysCount = getDaysUntilDate(moveDate);

  return (
    <Card className="border-0 bg-[linear-gradient(120deg,var(--primary),var(--primary-light))] text-white">
      <CardContent className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <SectionSubheader className="text-white/80">Moving day in</SectionSubheader>
          <h1 className="text-3xl font-bold">{daysCount} days</h1>
          <span className="text-sm">{formatDate(moveDate, "dddd, MMMM DD")}</span>
        </div>
        <Chip label={`${boxesCount} boxes`} icon={Box} className="bg-white/18 text-white" />
      </CardContent>
    </Card>
  );
};

export default MovingInfo;
