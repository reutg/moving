import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import IconTile from "@/components/ui/icon-tile";
import { LinkIcon, MapPin, PlusIcon } from "lucide-react";

const NoMoves = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <IconTile icon={MapPin} size="xl" />
      <h1 className="text-2xl font-bold">Where are you moving?</h1>
      <span className="text-muted-foreground text-center">
        Set up a move to start adding <br /> boxes, rooms, and labels.
      </span>

      <div className="flex w-full flex-col gap-3 pb-[max(0rem,env(safe-area-inset-bottom))]">
        <ButtonLink href="/moves/add" variant="default" className="flex gap-2">
          <PlusIcon className="size-5" />
          Start a move
        </ButtonLink>

        <Button variant="outline" className="border-border flex gap-2 border">
          <LinkIcon className="size-5" /> Join with an invite link
        </Button>
      </div>
    </div>
  );
};

export default NoMoves;
