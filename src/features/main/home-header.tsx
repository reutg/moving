import Link from "next/link";

import { ChevronDown } from "lucide-react";

import { getGreeting } from "@/lib/date-utils";

import Avatar from "@/components/avatar";

type HomeHeaderProps = {
  firstName: string | null;
  moveName?: string | null;
  userImage?: string | null;
  userName?: string | null;
  initials: string;
};

const HomeHeader = ({ firstName, moveName, userImage, userName, initials }: HomeHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-muted-foreground text-md font-light">
          {getGreeting()}, {firstName}!
        </span>

        {moveName ? (
          <Link href="/moves" className="flex items-center gap-2">
            <h6 className="line-clamp-1 text-xl font-semibold">{moveName}</h6>
            <ChevronDown className="text-subtle-foreground size-4" />
          </Link>
        ) : null}
      </div>
      <Link href="/settings">
        <Avatar src={userImage ?? ""} alt={userName ?? ""} fallback={initials} />
      </Link>
    </div>
  );
};

export default HomeHeader;
