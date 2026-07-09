import { User } from "lucide-react";

import { Avatar, AvatarFallback } from "./ui/avatar";

interface BlankAvatarProps {}

const BlankAvatar: React.FC<BlankAvatarProps> = ({}) => {
  return (
    <Avatar size="xl" className="after:border-border after:border-2 after:border-dashed">
      <AvatarFallback className="bg-card border-none">
        <User className="text-muted-foreground h-5 w-5" />
      </AvatarFallback>
    </Avatar>
  );
};

export default BlankAvatar;
