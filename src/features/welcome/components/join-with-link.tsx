"use client";

import { LinkIcon } from "lucide-react";

import Button from "@/components/button";
import FormInput from "@/components/form/form-input";
import { SectionDescription, SectionSubheader } from "@/components/ui/text";

import useJoinWithLink from "../hooks/use-join-with-link";

interface JoinWithLinkProps {}

const JoinWithLink: React.FC<JoinWithLinkProps> = ({}) => {
  const { control, submit, isSubmitting, handlePaste } = useJoinWithLink();

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h3 className="text-3xl font-bold">Join a household</h3>

          <SectionDescription className="text-start">
            Paste the invite link someone shared with you.
          </SectionDescription>
        </div>

        <div className="flex flex-col gap-2">
          <SectionSubheader>Invite link</SectionSubheader>

          <FormInput
            name="inviteLink"
            size="lg"
            control={control}
            icon={<LinkIcon className="text-subtle-foreground size-4" />}
            trailing={
              <Button variant="secondary" size="sm" onClick={handlePaste}>
                Paste
              </Button>
            }
          />
        </div>
      </div>
      <Button onClick={submit} disabled={isSubmitting} loading={isSubmitting}>
        Join household
      </Button>
    </div>
  );
};

export default JoinWithLink;
