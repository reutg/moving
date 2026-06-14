import PageHeader from "@/components/PageHeader";
import BoxForm from "@/features/boxes/components/box-form";
import { getBoxById } from "@/features/boxes/services/box-service";

interface EditBoxPageProps {
  params: Promise<{ id: number }>;
}

const EditBoxPage: React.FC<EditBoxPageProps> = async ({ params }) => {
  const { id } = await params;
  const box = await getBoxById(id);
  return (
    <div>
      <PageHeader title="Edit Box" />
      <BoxForm box={box} />
    </div>
  );
};

export default EditBoxPage;
