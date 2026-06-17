"use client";

import { Button } from "@base-ui/react/button";
import { Home, List, Settings } from "lucide-react";
import Link from "next/link";

const BottomNavigation = () => {
  return (
    <div className="border-border bg-card sticky bottom-0 z-10 flex items-center justify-around border-t px-6 py-5">
      <Link href="/">
        <Home />
      </Link>
      <Link href="/boxes">
        <List />
      </Link>
      <Link href="/settings">
        <Settings />
      </Link>
    </div>
  );
};

export default BottomNavigation;
