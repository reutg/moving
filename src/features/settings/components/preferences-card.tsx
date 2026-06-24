"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { SectionSubheader } from "@/components/ui/text";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

interface PreferencesCardProps {}

const PreferencesCard: React.FC<PreferencesCardProps> = ({}) => {
  const [isChecked, setIsChecked] = useState(true);
  return (
    <div className="flex flex-col gap-[10px]">
      <SectionSubheader>Preferences</SectionSubheader>
      <Card>
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex items-center justify-between px-4">
            <span className="text-foreground text-sm font-medium">Packing reminders</span>
            <Switch checked={isChecked} onCheckedChange={() => setIsChecked(!isChecked)} />
          </div>

          <Separator className="bg-border-light" />
          <div className="flex items-center justify-between px-4">
            <span className="text-foreground text-sm font-medium">Default label size</span>
            <div className="flex items-center gap-2">
              <span className="text-subtle-foreground text-xs font-light">2 x 3 in</span>
              <ChevronRight className="text-subtle-foreground size-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesCard;
