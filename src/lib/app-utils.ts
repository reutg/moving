import { User } from "next-auth";

export const getUserInitials = (user: User) => {
  const { firstName, lastName } = user;
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`;
};
