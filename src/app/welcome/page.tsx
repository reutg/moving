import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import IconTile from "@/components/ui/icon-tile";
import { BoxIcon, Link as LinkIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

interface PageProps {}

const Page: React.FC<PageProps> = ({}) => {
  return (
    <main className="bg-primary flex min-h-svh flex-col px-8 py-10">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <IconTile icon={BoxIcon} size="logo" backgroundColor="#437C70" iconColor="#FFFFFF" />

        <span className="text-sm font-bold text-white/60 uppercase">Moving On</span>
        <span className="text-center text-3xl font-semibold text-white">
          Let&apos;s set up
          <br />
          your move
        </span>
        <span className="text-md px-8 text-center font-thin text-white/70">
          Create a move to start cataloguing boxes, printing QR labels, and finding anything in
          seconds.
        </span>
      </div>

      <div className="flex w-full flex-col gap-3 pb-[max(0rem,env(safe-area-inset-bottom))]">
        <ButtonLink
          href="/moves/add"
          variant="outline"
          className="text-primary flex gap-2 font-bold"
        >
          <PlusIcon className="size-5" />
          Create your first move
        </ButtonLink>

        <Button className="border-border flex gap-2 border font-bold">
          <LinkIcon className="size-5" /> Join with an invite link
        </Button>
      </div>
    </main>
  );
};

export default Page;
