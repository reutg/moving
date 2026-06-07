import Link from "next/link";

import { Boxes, Plus } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-border bg-card sticky top-0 z-10 border-b">
      <nav className="mx-auto flex max-w-[960px] items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Boxes className="text-primary" size={28} aria-hidden />
          <span className="text-lg font-semibold">Moving</span>
        </Link>
        <Link
          href="/boxes/new"
          className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus size={18} aria-hidden />
          Add
        </Link>
      </nav>
    </header>
  );
}
