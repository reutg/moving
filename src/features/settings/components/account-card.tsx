"use client";

import GoogleIcon from "@/components/icons/google-icon";
import { Card, CardContent } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
import { SectionSubheader } from "@/components/ui/text";

interface AccountCardProps {
  email?: string | null;
}

const AccountCard: React.FC<AccountCardProps> = ({ email }) => {
  return (
    <div className="flex flex-col gap-[10px]">
      <SectionSubheader>Account</SectionSubheader>

      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GoogleIcon className="size-5" />

            <div>
              <h3 className="text-foreground text-md font-semibold">Connected with Google</h3>
              <p className="text-subtle-foreground text-sm">{email}</p>
            </div>
          </div>

          <Chip label="Active" />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountCard;
