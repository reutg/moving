import CircleNumber from "@/components/circle-number";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import IconTile from "@/components/ui/icon-tile";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/ui/text";
import { Box, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

interface EmptyMoveProps {}

const EmptyMove: React.FC<EmptyMoveProps> = ({}) => {
  const steps = [
    {
      title: "Add a box",
      description: "Name it, pick a room, list what’s inside.",
    },
    {
      title: "Print a QR label",
      description: "Stick it on the box to scan later.",
    },
    {
      title: "Find anything",
      description: "Ask where something is, get the box.",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card className="py-6">
        <CardContent className="flex flex-col items-center justify-center gap-5 px-5">
          <IconTile icon={Box} className="size-19" />

          <h3 className="text-lg font-semibold">Nothing packed yet</h3>
          <span className="text-muted-foreground text-center text-base font-thin">
            Create your first box and we'll start tracking your packing progress here.
          </span>

          <ButtonLink href="/boxes/add" className="w-full">
            <Plus className="size-5" /> Add your first box
          </ButtonLink>
        </CardContent>
      </Card>

      <SectionHeader>Get started</SectionHeader>

      <Card>
        <CardContent className="p-0">
          {steps.map((step, index) => (
            <div className="flex flex-col gap-4" key={step.title}>
              <Link href={index === 0 ? `/boxes/add` : `#`}>
                <div className="flex items-center justify-between gap-4 px-4">
                  <div className="flex items-center gap-4">
                    <CircleNumber number={index + 1} active={index === 0} />
                    <div>
                      <p className="text-foreground text-base font-semibold">{step.title}</p>
                      <p className="text-muted-foreground text-sm font-light">{step.description}</p>
                    </div>
                  </div>
                  {index === 0 && <ChevronRight className="text-subtle-foreground size-4" />}
                </div>
              </Link>
              {index < steps.length - 1 && <Separator className="bg-border-light mb-4" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyMove;
