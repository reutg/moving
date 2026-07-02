import IconTile from "@/components/ui/icon-tile";
import PageHeader from "@/components/ui/page-header";
import { SectionDescription } from "@/components/ui/text";
import MoveForm from "@/features/moves/components/move-form";
import { getMoveById } from "@/features/moves/services/move-service";
import { ChevronLeft, Truck } from "lucide-react";

interface EditMovePageProps {
  params: Promise<{ id: string }>;
}

const EditMovePage: React.FC<EditMovePageProps> = async ({ params }) => {
  const { id } = await params;
  const move = await getMoveById(Number(id));
  return (
    <main className="flex-container page-content">
      <PageHeader title="Edit move" backHref="/moves" icon={ChevronLeft} />
      <div className="flex flex-col items-center gap-3">
        <IconTile icon={Truck} className="rounded-2xl" size="lg" />
        <SectionDescription>
          Give your move a name and a date
          <br />
          so we can count down with you.
        </SectionDescription>
      </div>
      <MoveForm move={move} />
    </main>
  );
};

export default EditMovePage;
