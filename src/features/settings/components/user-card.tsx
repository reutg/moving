import type { ReactNode } from "react";

import type { User } from "next-auth";

import { getUserInitials } from "@/lib/app-utils";

import Avatar from "@/components/avatar";
import { Card, CardContent } from "@/components/ui/card";
import SeparatorDot from "@/components/ui/separator-dot";

type UserCardProps = {
  user: User;
  trailing?: ReactNode;
  currentUser?: boolean;
};

const UserCard = ({ user, trailing, currentUser }: UserCardProps) => {
  const initials = getUserInitials(user);

  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar src={user.image ?? ""} alt={user.name || ""} fallback={initials} size="xl" />
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-foreground text-lg leading-none font-semibold">{user.name}</h3>

              {currentUser && (
                <div className="flex items-center gap-1 pt-0.5">
                  <SeparatorDot />
                  <span className="text-subtle-foreground text-sm leading-none font-light">
                    You
                  </span>
                </div>
              )}
            </div>
            <p className="text-subtle-foreground text-sm">{user.email}</p>
          </div>
        </div>

        {trailing}
      </CardContent>
    </Card>
  );
};

export default UserCard;
