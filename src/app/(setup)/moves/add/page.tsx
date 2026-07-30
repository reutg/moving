import PageHeader from "@/components/ui/page-header";
import MoveForm from "@/features/moves/components/move-form";
import { auth } from "@/auth";
import { X } from "lucide-react";

const AddMovePage = async () => {
  const session = await auth();
  const backHref = session?.user.onboardingCompleted ? "/moves" : "/welcome";

  return (
    <main className="mx-auto flex min-h-full max-w-[960px] flex-col gap-[1.125rem] px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <PageHeader title="New move" backHref={backHref} icon={X} />
      <h1 className="text-2xl font-bold">Start a new move</h1>
      <span className="text-muted-foreground text-md font-thin">
        Give your move a name and a date. You can add boxes and rooms right after.
      </span>
      <MoveForm />
    </main>
  );
};

export default AddMovePage;
