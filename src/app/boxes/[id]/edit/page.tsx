import BoxForm from "@/features/boxes/components/box-form";
import { getBoxById } from "@/features/boxes/services/box-service";
import PageHeader from "@/components/ui/page-header";
import { ChevronLeft } from "lucide-react";

interface EditBoxPageProps {
  params: Promise<{ id: number }>;
}

const EditBoxPage: React.FC<EditBoxPageProps> = async ({ params }) => {
  const { id } = await params;
  const box = await getBoxById(id);
  return (
    <main className="flex-container page-content">
      <PageHeader title="Edit box" backHref="/" icon={ChevronLeft} />
      <BoxForm box={box} />
    </main>
  );
};

export default EditBoxPage;
