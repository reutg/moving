"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup as AvatarGroupComponent,
  AvatarImage,
} from "@/components/ui/avatar";

interface AvatarGroupProps {
  items: {
    name: string;
    image: string | undefined;
  }[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ items }) => {
  return (
    <AvatarGroupComponent className="grayscale">
      {items.map((item) => (
        <Avatar key={item.name}>
          <AvatarImage src={item.image} alt={item.name} />
          <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroupComponent>
  );
};

export default AvatarGroup;
