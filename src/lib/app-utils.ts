import type { User } from "next-auth";

const getFirstLetter = (name?: string | null) => {
  return name?.[0]?.toUpperCase() ?? "";
};

export const getUserInitials = (user: User) => {
  const { firstName, lastName, name } = user;
  if (name) {
    return name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  }

  return `${getFirstLetter(firstName)}${getFirstLetter(lastName)}`;
};
