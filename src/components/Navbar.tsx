import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-border bg-card sticky top-0 z-10 shrink-0 border-b">
      <nav className="mx-auto flex max-w-[960px] items-center justify-between p-3">
        <Link href="/" className="flex items-end gap-3">
          <Image
            src="/logo2.png"
            alt={process.env.NEXT_PUBLIC_APP_NAME ?? "Moving on"}
            width={160}
            height={160}
            className="size-10 object-contain"
            priority
          />
          <span className="text-lg font-semibold">{process.env.NEXT_PUBLIC_APP_NAME}</span>
        </Link>
        <Link
          href="/boxes/new"
          className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus size={18} aria-hidden />
          Add Box
        </Link>
      </nav>
    </header>
  );
}
