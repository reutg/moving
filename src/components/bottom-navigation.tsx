"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Home, LayoutGrid, Plus, Search, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
};

const HOME_ITEM: NavItem = {
  href: "/",
  label: "Home",
  icon: Home,
  isActive: (pathname) => pathname === "/",
};

const BOXES_ITEM: NavItem = {
  href: "/boxes",
  label: "Boxes",
  icon: Box,
  isActive: (pathname) => pathname === "/boxes",
};

const ROOMS_ITEM: NavItem = {
  href: "/rooms",
  label: "Rooms",
  icon: LayoutGrid,
  isActive: (pathname) => pathname === "/rooms",
};

const SEARCH_ITEM: NavItem = {
  href: "/search",
  label: "Search",
  icon: Search,
  isActive: (pathname) => pathname === "/search",
};

type NavLinkProps = {
  item: NavItem;
  pathname: string;
};

const NavLink = ({ item, pathname }: NavLinkProps) => {
  const active = item.isActive(pathname);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center gap-1 py-1",
        active ? "text-primary" : "text-[#8A8A8F]",
      )}
    >
      <Icon className="size-6" strokeWidth={active ? 2.25 : 1.75} />
      <span className={cn("text-[10px] leading-none", active ? "font-semibold" : "font-medium")}>
        {item.label}
      </span>
    </Link>
  );
};

const BottomNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="border-border bg-card relative shrink-0 border-t pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto grid max-w-[960px] grid-cols-5 items-end px-3 pt-2">
        <NavLink item={HOME_ITEM} pathname={pathname} />
        <NavLink item={BOXES_ITEM} pathname={pathname} />

        <div className="flex justify-center">
          <Link
            href="/boxes/add"
            aria-label="Add box"
            className="bg-primary text-primary-foreground -mt-7 flex size-14 items-center justify-center rounded-full shadow-[0_4px_12px_rgba(47,111,98,0.35)]"
          >
            <Plus className="size-7" strokeWidth={2.25} />
          </Link>
        </div>

        <NavLink item={ROOMS_ITEM} pathname={pathname} />
        <NavLink item={SEARCH_ITEM} pathname={pathname} />
      </div>
    </nav>
  );
};

export default BottomNavigation;
