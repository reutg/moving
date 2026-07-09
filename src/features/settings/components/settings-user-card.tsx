"use client";

import type { User } from "next-auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionSubheader } from "@/components/ui/text";

import { useUserCard } from "../hooks/use-user-card";

import UserCard from "./user-card";

type SettingsUserCardProps = {
  user: User;
};

const SettingsUserCard: React.FC<SettingsUserCardProps> = ({ user }) => {
  const {
    isEditing,
    isSaving,
    nameValue,
    setNameValue,
    handleEdit,
    cancelEdit,
    handleSave,
  } = useUserCard(user);

  if (isEditing) {
    return (
      <Card>
        <CardContent className="flex w-full flex-col gap-2">
          <SectionSubheader>Your name</SectionSubheader>
          <Input
            type="text"
            value={nameValue || ""}
            onChange={(event) => setNameValue(event.target.value)}
          />
          <div className="flex items-center gap-2.5">
            <Button variant="default" onClick={handleSave} disabled={isSaving}>
              Save
            </Button>
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <UserCard
      user={user}
      trailing={
        <Button
          className="h-fit w-fit px-[13px] py-[7px]"
          variant="secondary"
          onClick={handleEdit}
        >
          Edit
        </Button>
      }
    />
  );
};

export default SettingsUserCard;
