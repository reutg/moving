import BoxForm from "@/features/boxes/components/box-form/box-form";
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
    <main className="mx-auto flex min-h-full max-w-[960px] flex-col gap-[1.125rem] px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <PageHeader title="Edit box" backHref="/" icon={ChevronLeft} />
      <BoxForm box={box} />
    </main>
  );
};

export default EditBoxPage;
