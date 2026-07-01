"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, RotateCw } from "lucide-react";

interface MakeMoveActiveButtonProps {
  isReActivating: boolean;
  handleReActivateMove: () => Promise<void>;
}

const MakeMoveActiveButton: React.FC<MakeMoveActiveButtonProps> = ({
  isReActivating,
  handleReActivateMove,
}) => {
  return (
    <Button
      variant="ghost"
      className="hover:bg-muted/50 h-auto w-full justify-between rounded-none px-4 font-normal"
      onClick={() => void handleReActivateMove()}
      disabled={isReActivating}
    >
      <div className="flex items-center gap-3">
        <RotateCw className="text-foreground size-5" />
        <span className="text-foreground text-sm font-medium">Make active again</span>
      </div>
      {isReActivating ? (
        <Loader2 className="text-subtle-foreground size-4 animate-spin" aria-hidden />
      ) : (
        <ChevronRight className="text-subtle-foreground size-4" aria-hidden />
      )}
    </Button>
  );
};

export default MakeMoveActiveButton;
