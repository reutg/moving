"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup as AvatarGroupComponent,
  AvatarImage,
} from "@/components/ui/avatar";

interface AvatarGroupProps {}

const AvatarGroup: React.FC<AvatarGroupProps> = ({}) => {
  return (
    <AvatarGroupComponent className="grayscale">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
        <AvatarFallback>LR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
    </AvatarGroupComponent>
  );
};

export default AvatarGroup;
