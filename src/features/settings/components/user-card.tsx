"use client";

import Avatar from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { User } from "next-auth";

import { useUserCard } from "../hooks/use-user-card";
import { SectionSubheader } from "@/components/ui/text";

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const {
    isEditing,
    isSaving,
    nameValue,
    setNameValue,
    handleEdit,
    cancelEdit,
    handleSave,
    initials,
    name,
    image,
  } = useUserCard(user);

  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        {isEditing ? (
          <div className="flex w-full flex-col gap-2">
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
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <Avatar src={image || ""} alt={name || ""} fallback={initials} size="xl" />
              <div>
                <h3 className="text-foreground text-lg font-semibold">{user.name}</h3>
                <p className="text-subtle-foreground text-sm">{user.email}</p>
              </div>
            </div>

            <Button
              className="h-fit w-fit px-[13px] py-[7px]"
              variant="secondary"
              onClick={handleEdit}
            >
              Edit
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;
