import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import IconTile from "@/components/ui/icon-tile";
import { Box, PlusIcon } from "lucide-react";

interface EmptyListProps {}

const EmptyList: React.FC<EmptyListProps> = ({}) => {
  return (
    <Card className="m-auto py-7">
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <IconTile icon={Box} size="logo" />

        <p className="text-foreground text-xl font-bold">No boxes yet</p>
        <span className="text-subtle-foreground px-6 text-center text-base font-thin">
          Every box you create gets a number, a QR label and lives here so you always know what's
          inside.
        </span>

        <ButtonLink href="/boxes/add">
          <PlusIcon size={20} />
          Add your first box
        </ButtonLink>
      </CardContent>
    </Card>
  );
};

export default EmptyList;
