import PageHeader from "@/components/PageHeader";
import AddBoxForm from "@/features/boxes/components/add-box-form";

export default function NewBoxPage() {
  return (
    <>
      <PageHeader title="Create a new box" />
      <AddBoxForm />
    </>
  );
}
