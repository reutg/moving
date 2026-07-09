"use client";

import { Link, Trash2 } from "lucide-react";

import { formatDistanceToNow } from "@/lib/date-utils";

import BlankAvatar from "@/components/blank-avatar";
import Button from "@/components/button";
import FormInput from "@/components/form/form-input";
import Chip from "@/components/ui/chip";
import SummaryCard from "@/components/ui/summary-card";
import { SectionSubheader } from "@/components/ui/text";

import useInvites from "../hooks/use-invites";
import type { HouseholdInviteSummary } from "../services/household-service";

interface InvitesProps {
  invites: HouseholdInviteSummary[];
}

const Invites: React.FC<InvitesProps> = ({ invites }) => {
  const { control, submit, isSubmitting, deleteInvite, deletingInviteId } = useInvites();

  return (
    <>
      {invites.length > 0 && (
        <div className="flex flex-col gap-2">
          <SectionSubheader>Pending</SectionSubheader>

          {invites.map((invite) => (
            <SummaryCard
              key={invite.id}
              leading={<BlankAvatar />}
              title={invite.email}
              subtitle={`Invite sent ${formatDistanceToNow(invite.createdAt)}`}
              trailing={
                <div className="flex items-center gap-2">
                  <Chip
                    label="Invited"
                    className="bg-chip-background-invited text-chip-text-invited"
                  />

                  <Button
                    variant="icon"
                    size="icon-sm"
                    onClick={() => deleteInvite(invite.id)}
                    loading={deletingInviteId === invite.id}
                  >
                    <Trash2 />
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <SectionSubheader>Invite by email</SectionSubheader>
        <div className="flex items-center gap-2.5">
          <FormInput control={control} name="email" placeholder="Email" />
          <Button
            onClick={submit}
            className="h-12 w-fit rounded-xl px-5 py-0"
            loading={isSubmitting}
          >
            Send
          </Button>
        </div>
        <SummaryCard
          icon={Link}
          title="Share invite link"
          subtitle="initelink/url"
          trailing={
            <Button variant="secondary" size="sm" onClick={() => {}}>
              Copy
            </Button>
          }
        />
      </div>
    </>
  );
};

export default Invites;
